/**
 * Archivo: proyecto-imagenes.service.ts
 * Ubicación: modules/project-images/services
 * Tipo: Servicio de negocio
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { S3Servicio } from '../../storage/services/s3.service';
import { ProyectosRepositorio } from '../../projects/repositories/proyectos.repository';
import { CrearProyectoImagenDto } from '../dto/crear-proyecto-imagen.dto';
import { ActualizarProyectoImagenDto } from '../dto/actualizar-proyecto-imagen.dto';
import { RespuestaProyectoImagenDto } from '../dto/respuesta-proyecto-imagen.dto';
import { ProyectoImagenEntidad } from '../entities/proyecto-imagen.entity';
import { ProyectoImagenesRepositorio } from '../repositories/proyecto-imagenes.repository';

@Injectable()
export class ProyectoImagenesServicio {
  constructor(
    private readonly imagenesRepositorio: ProyectoImagenesRepositorio,
    private readonly proyectosRepositorio: ProyectosRepositorio,
    private readonly s3Servicio: S3Servicio,
  ) {}

  async crearImagen(
    proyectoId: number,
    dto: CrearProyectoImagenDto,
    archivo?: Express.Multer.File,
  ): Promise<RespuestaProyectoImagenDto> {
    await this.validarProyectoExiste(proyectoId);

    let urlS3 = dto.urlS3;
    if (archivo) {
      urlS3 = await this.s3Servicio.subirImagenProyecto(proyectoId, archivo);
    }

    if (!urlS3) {
      throw new ExcepcionNegocio(
        'Debe proporcionar urlS3 o subir un archivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.esPortada) {
      await this.imagenesRepositorio.quitarPortadaDeProyecto(proyectoId);
    }

    const imagen = await this.imagenesRepositorio.crearImagen({
      proyectoId,
      urlS3,
      etiqueta: dto.etiqueta ?? null,
      esPortada: dto.esPortada ?? false,
      orden: dto.orden ?? 0,
    });

    return this.mapearARespuesta(imagen);
  }

  async listarImagenesPorProyecto(
    proyectoId: number,
  ): Promise<RespuestaProyectoImagenDto[]> {
    await this.validarProyectoExiste(proyectoId);
    const imagenes = await this.imagenesRepositorio.listarImagenesPorProyecto(proyectoId);
    return imagenes.map((i) => this.mapearARespuesta(i));
  }

  async actualizarImagen(
    proyectoId: number,
    id: number,
    dto: ActualizarProyectoImagenDto,
    archivo?: Express.Multer.File,
  ): Promise<RespuestaProyectoImagenDto> {
    const imagen = await this.obtenerImagenDeProyecto(proyectoId, id);

    if (dto.esPortada) {
      await this.imagenesRepositorio.quitarPortadaDeProyecto(proyectoId);
    }

    const datos: Partial<ProyectoImagenEntidad> = {};
    if (archivo) {
      datos.urlS3 = await this.s3Servicio.subirImagenProyecto(proyectoId, archivo);
    } else if (dto.urlS3 !== undefined) {
      datos.urlS3 = dto.urlS3;
    }
    if (dto.etiqueta !== undefined) datos.etiqueta = dto.etiqueta;
    if (dto.esPortada !== undefined) datos.esPortada = dto.esPortada;
    if (dto.orden !== undefined) datos.orden = dto.orden;

    const actualizada = await this.imagenesRepositorio.actualizarImagen(imagen.id, datos);
    if (!actualizada) {
      throw new ExcepcionNegocio('Imagen no encontrada', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizada);
  }

  async eliminarImagen(proyectoId: number, id: number): Promise<void> {
    const imagen = await this.obtenerImagenDeProyecto(proyectoId, id);
    await this.imagenesRepositorio.eliminarImagen(imagen.id);
  }

  private async validarProyectoExiste(proyectoId: number): Promise<void> {
    const proyecto = await this.proyectosRepositorio.buscarProyectoPorId(proyectoId);
    if (!proyecto) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }
  }

  private async obtenerImagenDeProyecto(
    proyectoId: number,
    id: number,
  ): Promise<ProyectoImagenEntidad> {
    const imagen = await this.imagenesRepositorio.buscarImagenPorId(id);
    if (!imagen || imagen.proyectoId !== proyectoId) {
      throw new ExcepcionNegocio('Imagen no encontrada', HttpStatus.NOT_FOUND);
    }
    return imagen;
  }

  mapearARespuesta(imagen: ProyectoImagenEntidad): RespuestaProyectoImagenDto {
    return {
      id: imagen.id,
      proyectoId: imagen.proyectoId,
      urlS3: imagen.urlS3,
      etiqueta: imagen.etiqueta,
      esPortada: imagen.esPortada,
      orden: imagen.orden,
      creadoEn: imagen.creadoEn,
    };
  }
}
