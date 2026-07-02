/**
 * Archivo: proyectos.service.ts
 * Ubicación: modules/projects/services
 * Tipo: Servicio de negocio
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { ROLES } from '../../../common/constants/app.constants';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { generarSlug } from '../../../common/utils/generar-slug.util';
import { RabbitmqProductor } from '../../../messaging/producers/rabbitmq.producer';
import { CrearProyectoDto } from '../dto/crear-proyecto.dto';
import { ActualizarProyectoDto } from '../dto/actualizar-proyecto.dto';
import { RespuestaProyectoDto } from '../dto/respuesta-proyecto.dto';
import { ProyectoEntidad } from '../entities/proyecto.entity';
import { ProyectosRepositorio } from '../repositories/proyectos.repository';

@Injectable()
export class ProyectosServicio {
  constructor(
    private readonly proyectosRepositorio: ProyectosRepositorio,
    private readonly rabbitmqProductor: RabbitmqProductor,
  ) {}

  async crearProyecto(dto: CrearProyectoDto): Promise<RespuestaProyectoDto> {
    const slug = dto.slug || generarSlug(dto.titulo);
    await this.validarSlugUnico(slug);

    const proyecto = await this.proyectosRepositorio.crearProyecto({
      titulo: dto.titulo,
      slug,
      direccion: dto.direccion,
      comuna: dto.comuna,
      fechaEntregaEstimada: dto.fechaEntregaEstimada ?? null,
      latitud: dto.latitud ?? null,
      longitud: dto.longitud ?? null,
      descripcion: dto.descripcion ?? null,
      estado: dto.estado ?? EstadoProyecto.BORRADOR,
    });

    await this.rabbitmqProductor.publicarProyectoCreado(proyecto.id);

    return this.mapearARespuesta(proyecto);
  }

  async buscarProyectoPorId(id: number, rolUsuario: string): Promise<RespuestaProyectoDto> {
    const proyecto = await this.proyectosRepositorio.buscarProyectoPorId(id);
    if (!proyecto) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }
    this.validarAccesoConsulta(proyecto, rolUsuario);
    return this.mapearARespuesta(proyecto);
  }

  async listarProyectos(rolUsuario: string): Promise<RespuestaProyectoDto[]> {
    const soloActivos = rolUsuario === ROLES.USER;
    const proyectos = await this.proyectosRepositorio.listarProyectos(soloActivos);
    return proyectos.map((p) => this.mapearARespuesta(p));
  }

  async actualizarProyecto(
    id: number,
    dto: ActualizarProyectoDto,
  ): Promise<RespuestaProyectoDto> {
    const proyecto = await this.proyectosRepositorio.buscarProyectoPorId(id);
    if (!proyecto) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }

    if (dto.slug && dto.slug !== proyecto.slug) {
      await this.validarSlugUnico(dto.slug, id);
    }

    const datos: Partial<ProyectoEntidad> = {};
    if (dto.titulo !== undefined) datos.titulo = dto.titulo;
    if (dto.slug !== undefined) datos.slug = dto.slug;
    if (dto.direccion !== undefined) datos.direccion = dto.direccion;
    if (dto.comuna !== undefined) datos.comuna = dto.comuna;
    if (dto.fechaEntregaEstimada !== undefined) {
      datos.fechaEntregaEstimada = dto.fechaEntregaEstimada;
    }
    if (dto.latitud !== undefined) datos.latitud = dto.latitud;
    if (dto.longitud !== undefined) datos.longitud = dto.longitud;
    if (dto.descripcion !== undefined) datos.descripcion = dto.descripcion;
    if (dto.estado !== undefined) datos.estado = dto.estado;

    const actualizado = await this.proyectosRepositorio.actualizarProyecto(id, datos);
    if (!actualizado) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizado);
  }

  async eliminarProyecto(id: number): Promise<void> {
    const proyecto = await this.proyectosRepositorio.buscarProyectoPorId(id);
    if (!proyecto) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.proyectosRepositorio.eliminarProyecto(id);
  }

  private validarAccesoConsulta(proyecto: ProyectoEntidad, rolUsuario: string): void {
    if (rolUsuario === ROLES.USER && proyecto.estado !== EstadoProyecto.ACTIVO) {
      throw new ExcepcionNegocio('Proyecto no disponible', HttpStatus.NOT_FOUND);
    }
  }

  private async validarSlugUnico(slug: string, excluirId?: number): Promise<void> {
    const existente = await this.proyectosRepositorio.buscarProyectoPorSlug(slug);
    if (existente && existente.id !== excluirId) {
      throw new ExcepcionNegocio('El slug ya está en uso', HttpStatus.CONFLICT);
    }
  }

  mapearARespuesta(proyecto: ProyectoEntidad): RespuestaProyectoDto {
    return {
      id: proyecto.id,
      titulo: proyecto.titulo,
      slug: proyecto.slug,
      direccion: proyecto.direccion,
      comuna: proyecto.comuna,
      fechaEntregaEstimada: proyecto.fechaEntregaEstimada,
      latitud: proyecto.latitud !== null ? Number(proyecto.latitud) : null,
      longitud: proyecto.longitud !== null ? Number(proyecto.longitud) : null,
      descripcion: proyecto.descripcion,
      estado: proyecto.estado,
      creadoEn: proyecto.creadoEn,
      actualizadoEn: proyecto.actualizadoEn,
    };
  }
}
