/**
 * Archivo: propiedades.repository.ts
 * Ubicación: modules/properties/repositories
 * Tipo: Repositorio
 * Tabla BD: propiedades
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropiedadEntidad } from '../entities/propiedad.entity';

@Injectable()
export class PropiedadesRepositorio {
  constructor(
    @InjectRepository(PropiedadEntidad)
    private readonly repositorio: Repository<PropiedadEntidad>,
  ) {}

  async crearPropiedad(datos: Partial<PropiedadEntidad>): Promise<PropiedadEntidad> {
    const propiedad = this.repositorio.create(datos);
    return this.repositorio.save(propiedad);
  }

  async buscarPropiedadPorId(id: number): Promise<PropiedadEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listarPropiedades(): Promise<PropiedadEntidad[]> {
    return this.repositorio.find({ order: { creadoEn: 'DESC' } });
  }

  async listarPropiedadesPorProyecto(proyectoId: number): Promise<PropiedadEntidad[]> {
    return this.repositorio.find({
      where: { proyectoId },
      order: { creadoEn: 'DESC' },
    });
  }

  async actualizarPropiedad(
    id: number,
    datos: Partial<PropiedadEntidad>,
  ): Promise<PropiedadEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.buscarPropiedadPorId(id);
  }

  async eliminarPropiedad(id: number): Promise<void> {
    await this.repositorio.delete(id);
  }
}
