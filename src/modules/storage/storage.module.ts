/**
 * Archivo: storage.module.ts
 * Ubicación: modules/storage
 * Tipo: Módulo NestJS
 * Contenido: servicios de almacenamiento AWS S3
 */

import { Module } from '@nestjs/common';
import { S3Servicio } from './services/s3.service';

@Module({
  providers: [S3Servicio],
  exports: [S3Servicio],
})
export class StorageModule {}
