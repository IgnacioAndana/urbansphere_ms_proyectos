/**
 * Archivo: proyectos.service.ts
 * Ubicación: modules/projects/services
 * Tipo: Servicio de negocio
 * Métodos: crearProyecto, buscarProyectoPorId, listarProyectos, actualizarProyecto, eliminarProyecto
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { generarSlug } from '../../../common/utils/generar-slug.util';
import { CrearProyectoDto } from '../dto/crear-proyecto.dto';
import { ActualizarProyectoDto } from '../dto/actualizar-proyecto.dto';
import { RespuestaProyectoDto } from '../dto/respuesta-proyecto.dto';
import { ProyectoEntidad } from '../entities/proyecto.entity';
import { ProyectosRepositorio } from '../repositories/proyectos.repository';

@Injectable()
export class ProyectosServicio {
  constructor(private readonly proyectosRepositorio: ProyectosRepositorio) {}

  async crearProyecto(dto: CrearProyectoDto): Promise<RespuestaProyectoDto> {
    const slug = dto.slug || generarSlug(dto.nombre);
    await this.validarSlugUnico(slug);

    const proyecto = await this.proyectosRepositorio.crearProyecto({
      nombre: dto.nombre,
      slug,
      descripcion: dto.descripcion ?? null,
      ciudad: dto.ciudad ?? null,
      direccion: dto.direccion ?? null,
      estado: dto.estado ?? EstadoProyecto.BORRADOR,
    });

    return this.mapearARespuesta(proyecto);
  }

  async buscarProyectoPorId(id: number): Promise<RespuestaProyectoDto> {
    const proyecto = await this.proyectosRepositorio.buscarProyectoPorId(id);
    if (!proyecto) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }
    return this.mapearARespuesta(proyecto);
  }

  async listarProyectos(): Promise<RespuestaProyectoDto[]> {
    const proyectos = await this.proyectosRepositorio.listarProyectos();
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
    if (dto.nombre !== undefined) datos.nombre = dto.nombre;
    if (dto.slug !== undefined) datos.slug = dto.slug;
    if (dto.descripcion !== undefined) datos.descripcion = dto.descripcion;
    if (dto.ciudad !== undefined) datos.ciudad = dto.ciudad;
    if (dto.direccion !== undefined) datos.direccion = dto.direccion;
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

  private async validarSlugUnico(slug: string, excluirId?: number): Promise<void> {
    const existente = await this.proyectosRepositorio.buscarProyectoPorSlug(slug);
    if (existente && existente.id !== excluirId) {
      throw new ExcepcionNegocio('El slug ya está en uso', HttpStatus.CONFLICT);
    }
  }

  mapearARespuesta(proyecto: ProyectoEntidad): RespuestaProyectoDto {
    return {
      id: proyecto.id,
      nombre: proyecto.nombre,
      slug: proyecto.slug,
      descripcion: proyecto.descripcion,
      ciudad: proyecto.ciudad,
      direccion: proyecto.direccion,
      estado: proyecto.estado,
      creadoEn: proyecto.creadoEn,
      actualizadoEn: proyecto.actualizadoEn,
    };
  }
}
