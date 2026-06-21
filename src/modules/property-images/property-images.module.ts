/**
 * Archivo: property-images.module.ts
 * Ubicación: modules/property-images
 * Tipo: Módulo NestJS
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from '../properties/properties.module';
import { StorageModule } from '../storage/storage.module';
import { PropiedadImagenesControlador } from './controllers/propiedad-imagenes.controller';
import { PropiedadImagenesServicio } from './services/propiedad-imagenes.service';
import { PropiedadImagenesRepositorio } from './repositories/propiedad-imagenes.repository';
import { PropiedadImagenEntidad } from './entities/propiedad-imagen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropiedadImagenEntidad]),
    PropertiesModule,
    StorageModule,
  ],
  controllers: [PropiedadImagenesControlador],
  providers: [PropiedadImagenesServicio, PropiedadImagenesRepositorio],
  exports: [PropiedadImagenesServicio, PropiedadImagenesRepositorio],
})
export class PropertyImagesModule {}
