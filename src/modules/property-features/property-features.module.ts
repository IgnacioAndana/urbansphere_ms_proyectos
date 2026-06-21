/**
 * Archivo: property-features.module.ts
 * Ubicación: modules/property-features
 * Tipo: Módulo NestJS
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from '../properties/properties.module';
import { PropiedadCaracteristicasControlador } from './controllers/propiedad-caracteristicas.controller';
import { PropiedadCaracteristicasServicio } from './services/propiedad-caracteristicas.service';
import { PropiedadCaracteristicasRepositorio } from './repositories/propiedad-caracteristicas.repository';
import { PropiedadCaracteristicaEntidad } from './entities/propiedad-caracteristica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropiedadCaracteristicaEntidad]), PropertiesModule],
  controllers: [PropiedadCaracteristicasControlador],
  providers: [PropiedadCaracteristicasServicio, PropiedadCaracteristicasRepositorio],
  exports: [PropiedadCaracteristicasServicio, PropiedadCaracteristicasRepositorio],
})
export class PropertyFeaturesModule {}
