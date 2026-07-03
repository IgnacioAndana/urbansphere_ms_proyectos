/**
 * Archivo: s3.service.ts
 * Ubicación: modules/storage/services
 * Tipo: Servicio de almacenamiento
 * Contenido: subida de imágenes a AWS S3 (bucket urbansphere-images)
 *
 * Estructura de claves en el bucket:
 *   proyectos/{proyectoId}/galeria/{archivo}     — imágenes generales del proyecto
 *   proyectos/{proyectoId}/tipologias/{tipologiaId}/{archivo} — imágenes por tipología
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';

@Injectable()
export class S3Servicio {
  private readonly cliente: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly configServicio: ConfigService) {
    this.region = this.configServicio.get<string>('aws.region') || 'us-east-1';
    this.bucket = this.configServicio.get<string>('aws.bucket') || 'urbansphere-images';

    this.cliente = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configServicio.get<string>('aws.accessKeyId') || '',
        secretAccessKey: this.configServicio.get<string>('aws.secretAccessKey') || '',
      },
    });
  }

  async subirImagenProyecto(
    proyectoId: number,
    archivo: Express.Multer.File,
  ): Promise<string> {
    const extension = this.obtenerExtension(archivo.originalname);
    const clave = `proyectos/${proyectoId}/galeria/${randomUUID()}.${extension}`;
    return this.subirArchivo(clave, archivo);
  }

  async subirImagenTipologia(
    proyectoId: number,
    tipologiaId: number,
    archivo: Express.Multer.File,
  ): Promise<string> {
    const extension = this.obtenerExtension(archivo.originalname);
    const clave = `proyectos/${proyectoId}/tipologias/${tipologiaId}/${randomUUID()}.${extension}`;
    return this.subirArchivo(clave, archivo);
  }

  construirUrlPublica(clave: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${clave}`;
  }

  private async subirArchivo(
    clave: string,
    archivo: Express.Multer.File,
  ): Promise<string> {
    if (!archivo.buffer?.length) {
      throw new ExcepcionNegocio(
        'El archivo está vacío o no llegó al servidor (revise proxy multipart)',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!this.configServicio.get<string>('aws.accessKeyId')) {
      throw new ExcepcionNegocio(
        'Credenciales AWS no configuradas en el servidor',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      await this.cliente.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: clave,
          Body: archivo.buffer,
          ContentType: archivo.mimetype || 'application/octet-stream',
        }),
      );
    } catch (error) {
      const detalle = error instanceof Error ? error.message : 'error desconocido';
      throw new ExcepcionNegocio(
        `No se pudo subir la imagen a S3 (${this.bucket}): ${detalle}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    return this.construirUrlPublica(clave);
  }

  private obtenerExtension(nombreArchivo: string): string {
    return nombreArchivo.split('.').pop()?.toLowerCase() || 'jpg';
  }
}
