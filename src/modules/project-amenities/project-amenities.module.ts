import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module';
import { ProyectoEquipamientoControlador } from './controllers/proyecto-equipamiento.controller';
import { ProyectoEquipamientoServicio } from './services/proyecto-equipamiento.service';
import { ProyectoEquipamientoRepositorio } from './repositories/proyecto-equipamiento.repository';
import { ProyectoEquipamientoEntidad } from './entities/proyecto-equipamiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoEquipamientoEntidad]), ProjectsModule],
  controllers: [ProyectoEquipamientoControlador],
  providers: [ProyectoEquipamientoServicio, ProyectoEquipamientoRepositorio],
})
export class ProjectAmenitiesModule {}
