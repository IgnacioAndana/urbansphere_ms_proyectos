/**
 * Archivo: properties.module.ts
 * Ubicación: modules/properties
 * Tipo: Módulo NestJS
 * Contenido: gestión de propiedades inmobiliarias
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingModule } from '../../messaging/messaging.module';
import { ProjectsModule } from '../projects/projects.module';
import { PropiedadesControlador } from './controllers/propiedades.controller';
import { PropiedadesServicio } from './services/propiedades.service';
import { PropiedadesRepositorio } from './repositories/propiedades.repository';
import { PropiedadEntidad } from './entities/propiedad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropiedadEntidad]),
    ProjectsModule,
    MessagingModule,
  ],
  controllers: [PropiedadesControlador],
  providers: [PropiedadesServicio, PropiedadesRepositorio],
  exports: [PropiedadesServicio, PropiedadesRepositorio],
})
export class PropertiesModule {}
