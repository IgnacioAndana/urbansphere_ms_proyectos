/**
 * Archivo: projects.module.ts
 * Ubicación: modules/projects
 * Tipo: Módulo NestJS
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingModule } from '../../messaging/messaging.module';
import { ProyectoImagenEntidad } from '../project-images/entities/proyecto-imagen.entity';
import { TipologiaEntidad } from '../typologies/entities/tipologia.entity';
import { ProyectosControlador } from './controllers/proyectos.controller';
import { ProyectoEntidad } from './entities/proyecto.entity';
import { CatalogoProyectosRepositorio } from './repositories/catalogo-proyectos.repository';
import { ProyectosRepositorio } from './repositories/proyectos.repository';
import { ProyectosServicio } from './services/proyectos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProyectoEntidad, TipologiaEntidad, ProyectoImagenEntidad]),
    MessagingModule,
  ],
  controllers: [ProyectosControlador],
  providers: [ProyectosServicio, ProyectosRepositorio, CatalogoProyectosRepositorio],
  exports: [ProyectosServicio, ProyectosRepositorio],
})
export class ProjectsModule {}
