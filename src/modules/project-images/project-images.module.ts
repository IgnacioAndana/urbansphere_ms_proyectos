/**
 * Archivo: project-images.module.ts
 * Ubicación: modules/project-images
 * Tipo: Módulo NestJS
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module';
import { StorageModule } from '../storage/storage.module';
import { ProyectoImagenesControlador } from './controllers/proyecto-imagenes.controller';
import { ProyectoImagenesServicio } from './services/proyecto-imagenes.service';
import { ProyectoImagenesRepositorio } from './repositories/proyecto-imagenes.repository';
import { ProyectoImagenEntidad } from './entities/proyecto-imagen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProyectoImagenEntidad]),
    ProjectsModule,
    StorageModule,
  ],
  controllers: [ProyectoImagenesControlador],
  providers: [ProyectoImagenesServicio, ProyectoImagenesRepositorio],
  exports: [ProyectoImagenesServicio, ProyectoImagenesRepositorio],
})
export class ProjectImagesModule {}
