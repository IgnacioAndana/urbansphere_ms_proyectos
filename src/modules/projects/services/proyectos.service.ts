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
import {
  ConsultarCatalogoResponseDto,
  OmitidoCatalogoDto,
} from '../dto/consultar-catalogo-response.dto';
import { ProyectoCatalogoItemDto } from '../dto/proyecto-catalogo-item.dto';
import { ProyectoEntidad } from '../entities/proyecto.entity';
import { AgregacionTipologiasCatalogo } from '../interfaces/agregacion-tipologias-catalogo.interface';
import { CatalogoProyectosRepositorio } from '../repositories/catalogo-proyectos.repository';
import { ProyectosRepositorio } from '../repositories/proyectos.repository';
import { deduplicarIdsPreservandoOrden } from '../utils/deduplicar-ids.util';

@Injectable()
export class ProyectosServicio {
  constructor(
    private readonly proyectosRepositorio: ProyectosRepositorio,
    private readonly catalogoRepositorio: CatalogoProyectosRepositorio,
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
      tipo: dto.tipo,
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

  async consultarCatalogo(
    ids: number[],
    rolUsuario: string,
  ): Promise<ConsultarCatalogoResponseDto> {
    const idsOrdenados = deduplicarIdsPreservandoOrden(ids);

    if (!idsOrdenados.length) {
      return { items: [], omitidos: [] };
    }

    const proyectos = await this.catalogoRepositorio.buscarProyectosPorIds(idsOrdenados);
    const mapaProyectos = new Map(proyectos.map((p) => [Number(p.id), p]));

    const idsIncluidos: number[] = [];
    const omitidos: OmitidoCatalogoDto[] = [];
    const soloActivos = rolUsuario === ROLES.USER;

    for (const id of idsOrdenados) {
      const proyecto = mapaProyectos.get(id);
      if (!proyecto) {
        omitidos.push({ id, motivo: 'no_encontrado' });
        continue;
      }
      if (soloActivos && proyecto.estado !== EstadoProyecto.ACTIVO) {
        omitidos.push({ id, motivo: 'inactivo' });
        continue;
      }
      idsIncluidos.push(id);
    }

    const [agregaciones, portadas] = await Promise.all([
      this.catalogoRepositorio.agregarTipologiasPorProyectos(idsIncluidos),
      this.catalogoRepositorio.obtenerUrlPortadaPorProyectos(idsIncluidos),
    ]);

    const items = idsIncluidos.map((id) =>
      this.mapearCatalogoItem(
        mapaProyectos.get(id)!,
        agregaciones.get(id),
        portadas.get(id) ?? null,
      ),
    );

    return { items, omitidos };
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
    if (dto.tipo !== undefined) datos.tipo = dto.tipo;
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
    if (existente && Number(existente.id) !== Number(excluirId)) {
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
      tipo: proyecto.tipo,
      fechaEntregaEstimada: proyecto.fechaEntregaEstimada,
      latitud: proyecto.latitud !== null ? Number(proyecto.latitud) : null,
      longitud: proyecto.longitud !== null ? Number(proyecto.longitud) : null,
      descripcion: proyecto.descripcion,
      estado: proyecto.estado,
      creadoEn: proyecto.creadoEn,
      actualizadoEn: proyecto.actualizadoEn,
    };
  }

  private mapearCatalogoItem(
    proyecto: ProyectoEntidad,
    agregacion: AgregacionTipologiasCatalogo | undefined,
    urlPortada: string | null,
  ): ProyectoCatalogoItemDto {
    return {
      id: Number(proyecto.id),
      titulo: proyecto.titulo,
      tipo: proyecto.tipo,
      comuna: proyecto.comuna,
      direccion: proyecto.direccion,
      latitud: proyecto.latitud !== null ? Number(proyecto.latitud) : null,
      longitud: proyecto.longitud !== null ? Number(proyecto.longitud) : null,
      descripcion: proyecto.descripcion,
      fechaEntregaEstimada: proyecto.fechaEntregaEstimada,
      estado: proyecto.estado,
      urlPortada,
      precioDesdeUf: agregacion?.precioDesdeUf ?? null,
      dormitoriosMin: agregacion?.dormitoriosMin ?? null,
      dormitoriosMax: agregacion?.dormitoriosMax ?? null,
      banosMin: agregacion?.banosMin ?? null,
      banosMax: agregacion?.banosMax ?? null,
      superficieMin: agregacion?.superficieMin ?? null,
      superficieMax: agregacion?.superficieMax ?? null,
    };
  }
}
