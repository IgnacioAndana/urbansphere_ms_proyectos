/**
 * Archivo: propiedad-imagenes.service.ts
 * Ubicación: modules/property-images/services
 * Tipo: Servicio de negocio
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { S3Servicio } from '../../storage/services/s3.service';
import { PropiedadesRepositorio } from '../../properties/repositories/propiedades.repository';
import { CrearPropiedadImagenDto } from '../dto/crear-propiedad-imagen.dto';
import { ActualizarPropiedadImagenDto } from '../dto/actualizar-propiedad-imagen.dto';
import { RespuestaPropiedadImagenDto } from '../dto/respuesta-propiedad-imagen.dto';
import { PropiedadImagenEntidad } from '../entities/propiedad-imagen.entity';
import { PropiedadImagenesRepositorio } from '../repositories/propiedad-imagenes.repository';

@Injectable()
export class PropiedadImagenesServicio {
  constructor(
    private readonly imagenesRepositorio: PropiedadImagenesRepositorio,
    private readonly propiedadesRepositorio: PropiedadesRepositorio,
    private readonly s3Servicio: S3Servicio,
  ) {}

  async crearImagen(
    propiedadId: number,
    dto: CrearPropiedadImagenDto,
    archivo?: Express.Multer.File,
  ): Promise<RespuestaPropiedadImagenDto> {
    await this.validarPropiedadExiste(propiedadId);

    let urlS3 = dto.urlS3;
    if (archivo) {
      urlS3 = await this.s3Servicio.subirImagenPropiedad(propiedadId, archivo);
    }

    if (!urlS3) {
      throw new ExcepcionNegocio(
        'Debe proporcionar urlS3 o subir un archivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.esPortada) {
      await this.imagenesRepositorio.quitarPortadaDePropiedad(propiedadId);
    }

    const imagen = await this.imagenesRepositorio.crearImagen({
      propiedadId,
      urlS3,
      esPortada: dto.esPortada ?? false,
      orden: dto.orden ?? 0,
    });

    return this.mapearARespuesta(imagen);
  }

  async listarImagenesPorPropiedad(
    propiedadId: number,
  ): Promise<RespuestaPropiedadImagenDto[]> {
    await this.validarPropiedadExiste(propiedadId);
    const imagenes = await this.imagenesRepositorio.listarImagenesPorPropiedad(propiedadId);
    return imagenes.map((i) => this.mapearARespuesta(i));
  }

  async actualizarImagen(
    propiedadId: number,
    id: number,
    dto: ActualizarPropiedadImagenDto,
  ): Promise<RespuestaPropiedadImagenDto> {
    const imagen = await this.obtenerImagenDePropiedad(propiedadId, id);

    if (dto.esPortada) {
      await this.imagenesRepositorio.quitarPortadaDePropiedad(propiedadId);
    }

    const datos: Partial<PropiedadImagenEntidad> = {};
    if (dto.urlS3 !== undefined) datos.urlS3 = dto.urlS3;
    if (dto.esPortada !== undefined) datos.esPortada = dto.esPortada;
    if (dto.orden !== undefined) datos.orden = dto.orden;

    const actualizada = await this.imagenesRepositorio.actualizarImagen(imagen.id, datos);
    if (!actualizada) {
      throw new ExcepcionNegocio('Imagen no encontrada', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizada);
  }

  async eliminarImagen(propiedadId: number, id: number): Promise<void> {
    const imagen = await this.obtenerImagenDePropiedad(propiedadId, id);
    await this.imagenesRepositorio.eliminarImagen(imagen.id);
  }

  private async validarPropiedadExiste(propiedadId: number): Promise<void> {
    const propiedad = await this.propiedadesRepositorio.buscarPropiedadPorId(propiedadId);
    if (!propiedad) {
      throw new ExcepcionNegocio('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }
  }

  private async obtenerImagenDePropiedad(
    propiedadId: number,
    id: number,
  ): Promise<PropiedadImagenEntidad> {
    const imagen = await this.imagenesRepositorio.buscarImagenPorId(id);
    if (!imagen || imagen.propiedadId !== propiedadId) {
      throw new ExcepcionNegocio('Imagen no encontrada', HttpStatus.NOT_FOUND);
    }
    return imagen;
  }

  mapearARespuesta(imagen: PropiedadImagenEntidad): RespuestaPropiedadImagenDto {
    return {
      id: imagen.id,
      propiedadId: imagen.propiedadId,
      urlS3: imagen.urlS3,
      esPortada: imagen.esPortada,
      orden: imagen.orden,
      creadoEn: imagen.creadoEn,
    };
  }
}
