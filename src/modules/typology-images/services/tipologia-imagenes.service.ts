import { HttpStatus, Injectable } from '@nestjs/common';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { S3Servicio } from '../../storage/services/s3.service';
import { TipologiasServicio } from '../../typologies/services/tipologias.service';
import { CrearTipologiaImagenDto } from '../dto/crear-tipologia-imagen.dto';
import { ActualizarTipologiaImagenDto } from '../dto/actualizar-tipologia-imagen.dto';
import { RespuestaTipologiaImagenDto } from '../dto/respuesta-tipologia-imagen.dto';
import { TipologiaImagenEntidad } from '../entities/tipologia-imagen.entity';
import { TipologiaImagenesRepositorio } from '../repositories/tipologia-imagenes.repository';

@Injectable()
export class TipologiaImagenesServicio {
  constructor(
    private readonly imagenesRepositorio: TipologiaImagenesRepositorio,
    private readonly tipologiasServicio: TipologiasServicio,
    private readonly s3Servicio: S3Servicio,
  ) {}

  async crearImagen(
    proyectoId: number,
    tipologiaId: number,
    dto: CrearTipologiaImagenDto,
    archivo?: Express.Multer.File,
  ): Promise<RespuestaTipologiaImagenDto> {
    await this.tipologiasServicio.obtenerTipologiaDeProyecto(proyectoId, tipologiaId);

    let urlS3 = dto.urlS3;
    if (archivo) {
      urlS3 = await this.s3Servicio.subirImagenTipologia(tipologiaId, archivo);
    }

    if (!urlS3) {
      throw new ExcepcionNegocio(
        'Debe proporcionar urlS3 o subir un archivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.esPortada) {
      await this.imagenesRepositorio.quitarPortadaDeTipologia(tipologiaId);
    }

    if (dto.esPanoramica360) {
      await this.imagenesRepositorio.quitarPanoramica360DeTipologia(tipologiaId);
    }

    const imagen = await this.imagenesRepositorio.crearImagen({
      tipologiaId,
      urlS3,
      esPortada: dto.esPortada ?? false,
      esPanoramica360: dto.esPanoramica360 ?? false,
      orden: dto.orden ?? 0,
    });

    return this.mapearARespuesta(imagen);
  }

  async listarImagenes(
    proyectoId: number,
    tipologiaId: number,
  ): Promise<RespuestaTipologiaImagenDto[]> {
    await this.tipologiasServicio.obtenerTipologiaDeProyecto(proyectoId, tipologiaId);
    const imagenes = await this.imagenesRepositorio.listarImagenesPorTipologia(tipologiaId);
    return imagenes.map((i) => this.mapearARespuesta(i));
  }

  async actualizarImagen(
    proyectoId: number,
    tipologiaId: number,
    id: number,
    dto: ActualizarTipologiaImagenDto,
  ): Promise<RespuestaTipologiaImagenDto> {
    const imagen = await this.obtenerImagenDeTipologia(proyectoId, tipologiaId, id);

    if (dto.esPortada) {
      await this.imagenesRepositorio.quitarPortadaDeTipologia(tipologiaId);
    }

    if (dto.esPanoramica360) {
      await this.imagenesRepositorio.quitarPanoramica360DeTipologia(tipologiaId);
    }

    const datos: Partial<TipologiaImagenEntidad> = {};
    if (dto.urlS3 !== undefined) datos.urlS3 = dto.urlS3;
    if (dto.esPortada !== undefined) datos.esPortada = dto.esPortada;
    if (dto.esPanoramica360 !== undefined) datos.esPanoramica360 = dto.esPanoramica360;
    if (dto.orden !== undefined) datos.orden = dto.orden;

    const actualizada = await this.imagenesRepositorio.actualizarImagen(imagen.id, datos);
    if (!actualizada) {
      throw new ExcepcionNegocio('Imagen no encontrada', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizada);
  }

  async eliminarImagen(proyectoId: number, tipologiaId: number, id: number): Promise<void> {
    const imagen = await this.obtenerImagenDeTipologia(proyectoId, tipologiaId, id);
    await this.imagenesRepositorio.eliminarImagen(imagen.id);
  }

  private async obtenerImagenDeTipologia(
    proyectoId: number,
    tipologiaId: number,
    id: number,
  ): Promise<TipologiaImagenEntidad> {
    await this.tipologiasServicio.obtenerTipologiaDeProyecto(proyectoId, tipologiaId);
    const imagen = await this.imagenesRepositorio.buscarImagenPorId(id);
    if (!imagen || imagen.tipologiaId !== tipologiaId) {
      throw new ExcepcionNegocio('Imagen no encontrada', HttpStatus.NOT_FOUND);
    }
    return imagen;
  }

  mapearARespuesta(imagen: TipologiaImagenEntidad): RespuestaTipologiaImagenDto {
    return {
      id: imagen.id,
      tipologiaId: imagen.tipologiaId,
      urlS3: imagen.urlS3,
      esPortada: imagen.esPortada,
      esPanoramica360: imagen.esPanoramica360,
      orden: imagen.orden,
      creadoEn: imagen.creadoEn,
    };
  }
}
