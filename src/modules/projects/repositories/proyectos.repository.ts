/**
 * Archivo: proyectos.repository.ts
 * Ubicación: modules/projects/repositories
 * Tipo: Repositorio
 * Tabla BD: proyectos
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';
import { ProyectoEntidad } from '../entities/proyecto.entity';

@Injectable()
export class ProyectosRepositorio {
  constructor(
    @InjectRepository(ProyectoEntidad)
    private readonly repositorio: Repository<ProyectoEntidad>,
  ) {}

  async crearProyecto(datos: Partial<ProyectoEntidad>): Promise<ProyectoEntidad> {
    const proyecto = this.repositorio.create(datos);
    return this.repositorio.save(proyecto);
  }

  async buscarProyectoPorId(id: number): Promise<ProyectoEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async buscarProyectoPorSlug(slug: string): Promise<ProyectoEntidad | null> {
    return this.repositorio.findOne({ where: { slug } });
  }

  async listarProyectos(soloActivos = false): Promise<ProyectoEntidad[]> {
    return this.repositorio.find({
      where: soloActivos ? { estado: EstadoProyecto.ACTIVO } : {},
      order: { creadoEn: 'DESC' },
    });
  }

  async actualizarProyecto(
    id: number,
    datos: Partial<ProyectoEntidad>,
  ): Promise<ProyectoEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.buscarProyectoPorId(id);
  }

  async eliminarProyecto(id: number): Promise<void> {
    await this.repositorio.delete(id);
  }
}
