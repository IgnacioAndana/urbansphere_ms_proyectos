/**
 * Archivo: filtro-excepciones-http.filter.ts
 * Ubicación: common/filters
 * Tipo: Filtro global de excepciones
 * Contenido: formatea errores HTTP y excepciones no controladas en respuestas JSON
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { formatearFechaRespuesta } from '../utils/formatear-fecha.util';

@Catch()
export class FiltroExcepcionesHttp implements ExceptionFilter {
  private readonly logger = new Logger(FiltroExcepcionesHttp.name);

  catch(excepcion: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const respuesta = ctx.getResponse<Response>();
    const peticion = ctx.getRequest<Request>();

    let estado = HttpStatus.INTERNAL_SERVER_ERROR;
    let mensaje: string | object = 'Error interno del servidor';

    if (excepcion instanceof HttpException) {
      estado = excepcion.getStatus();
      mensaje = excepcion.getResponse();
    } else if (excepcion instanceof QueryFailedError) {
      estado = HttpStatus.INTERNAL_SERVER_ERROR;
      const detalleSql = excepcion.message;
      this.logger.error(
        `Error SQL en ${peticion.method} ${peticion.url}: ${detalleSql}`,
        excepcion.stack,
      );
      mensaje =
        'Error de base de datos. Verifique que el esquema coincida con el código desplegado (ver database/migracion-sincronizar-imagenes.sql).';
    } else if (excepcion instanceof Error) {
      this.logger.error(
        `${peticion.method} ${peticion.url} - ${excepcion.message}`,
        excepcion.stack,
      );
      mensaje = 'Error interno del servidor';
    }

    respuesta.status(estado).json({
      codigoEstado: estado,
      fecha: formatearFechaRespuesta(new Date()),
      ruta: peticion.url,
      mensaje,
    });
  }
}
