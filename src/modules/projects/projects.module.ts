/**
 * Archivo: projects.module.ts
 * Ubicación: modules/projects
 * Tipo: Módulo NestJS
 * Contenido: gestión de proyectos inmobiliarios
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosControlador } from './controllers/proyectos.controller';
import { ProyectosServicio } from './services/proyectos.service';
import { ProyectosRepositorio } from './repositories/proyectos.repository';
import { ProyectoEntidad } from './entities/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoEntidad])],
  controllers: [ProyectosControlador],
  providers: [ProyectosServicio, ProyectosRepositorio],
  exports: [ProyectosServicio, ProyectosRepositorio],
})
export class ProjectsModule {}
