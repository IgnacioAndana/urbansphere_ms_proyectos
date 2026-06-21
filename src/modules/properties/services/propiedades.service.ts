/**
 * Archivo: propiedades.service.ts
 * Ubicación: modules/properties/services
 * Tipo: Servicio de negocio
 * Métodos: crearPropiedad, buscarPropiedadPorId, listarPropiedades, actualizarPropiedad, eliminarPropiedad
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { EstadoPropiedad } from '../../../common/enums/estado-propiedad.enum';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { RabbitmqProductor } from '../../../messaging/producers/rabbitmq.producer';
import { ProyectosRepositorio } from '../../projects/repositories/proyectos.repository';
import { CrearPropiedadDto } from '../dto/crear-propiedad.dto';
import { ActualizarPropiedadDto } from '../dto/actualizar-propiedad.dto';
import { RespuestaPropiedadDto } from '../dto/respuesta-propiedad.dto';
import { PropiedadEntidad } from '../entities/propiedad.entity';
import { PropiedadesRepositorio } from '../repositories/propiedades.repository';

@Injectable()
export class PropiedadesServicio {
  constructor(
    private readonly propiedadesRepositorio: PropiedadesRepositorio,
    private readonly proyectosRepositorio: ProyectosRepositorio,
    private readonly rabbitmqProductor: RabbitmqProductor,
  ) {}

  async crearPropiedad(dto: CrearPropiedadDto): Promise<RespuestaPropiedadDto> {
    await this.validarProyectoExiste(dto.proyectoId);

    const propiedad = await this.propiedadesRepositorio.crearPropiedad({
      proyectoId: dto.proyectoId,
      titulo: dto.titulo,
      descripcion: dto.descripcion ?? null,
      precio: dto.precio,
      dormitorios: dto.dormitorios ?? 0,
      banos: dto.banos ?? 0,
      areaM2: dto.areaM2 ?? null,
      estado: dto.estado ?? EstadoPropiedad.DISPONIBLE,
    });

    await this.rabbitmqProductor.publicarPropiedadCreada(propiedad.id);

    return this.mapearARespuesta(propiedad);
  }

  async buscarPropiedadPorId(id: number): Promise<RespuestaPropiedadDto> {
    const propiedad = await this.propiedadesRepositorio.buscarPropiedadPorId(id);
    if (!propiedad) {
      throw new ExcepcionNegocio('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }
    return this.mapearARespuesta(propiedad);
  }

  async listarPropiedades(): Promise<RespuestaPropiedadDto[]> {
    const propiedades = await this.propiedadesRepositorio.listarPropiedades();
    return propiedades.map((p) => this.mapearARespuesta(p));
  }

  async listarPropiedadesPorProyecto(proyectoId: number): Promise<RespuestaPropiedadDto[]> {
    await this.validarProyectoExiste(proyectoId);
    const propiedades =
      await this.propiedadesRepositorio.listarPropiedadesPorProyecto(proyectoId);
    return propiedades.map((p) => this.mapearARespuesta(p));
  }

  async actualizarPropiedad(
    id: number,
    dto: ActualizarPropiedadDto,
  ): Promise<RespuestaPropiedadDto> {
    const propiedad = await this.propiedadesRepositorio.buscarPropiedadPorId(id);
    if (!propiedad) {
      throw new ExcepcionNegocio('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }

    if (dto.proyectoId !== undefined) {
      await this.validarProyectoExiste(dto.proyectoId);
    }

    const datos: Partial<PropiedadEntidad> = {};
    if (dto.proyectoId !== undefined) datos.proyectoId = dto.proyectoId;
    if (dto.titulo !== undefined) datos.titulo = dto.titulo;
    if (dto.descripcion !== undefined) datos.descripcion = dto.descripcion;
    if (dto.precio !== undefined) datos.precio = dto.precio;
    if (dto.dormitorios !== undefined) datos.dormitorios = dto.dormitorios;
    if (dto.banos !== undefined) datos.banos = dto.banos;
    if (dto.areaM2 !== undefined) datos.areaM2 = dto.areaM2;
    if (dto.estado !== undefined) datos.estado = dto.estado;

    const actualizada = await this.propiedadesRepositorio.actualizarPropiedad(id, datos);
    if (!actualizada) {
      throw new ExcepcionNegocio('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizada);
  }

  async eliminarPropiedad(id: number): Promise<void> {
    const propiedad = await this.propiedadesRepositorio.buscarPropiedadPorId(id);
    if (!propiedad) {
      throw new ExcepcionNegocio('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.propiedadesRepositorio.eliminarPropiedad(id);
  }

  private async validarProyectoExiste(proyectoId: number): Promise<void> {
    const proyecto = await this.proyectosRepositorio.buscarProyectoPorId(proyectoId);
    if (!proyecto) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.BAD_REQUEST);
    }
  }

  mapearARespuesta(propiedad: PropiedadEntidad): RespuestaPropiedadDto {
    return {
      id: propiedad.id,
      proyectoId: propiedad.proyectoId,
      nombreProyecto: propiedad.proyecto?.nombre,
      titulo: propiedad.titulo,
      descripcion: propiedad.descripcion,
      precio: Number(propiedad.precio),
      dormitorios: propiedad.dormitorios,
      banos: propiedad.banos,
      areaM2: propiedad.areaM2 !== null ? Number(propiedad.areaM2) : null,
      estado: propiedad.estado,
      creadoEn: propiedad.creadoEn,
      actualizadoEn: propiedad.actualizadoEn,
    };
  }
}
