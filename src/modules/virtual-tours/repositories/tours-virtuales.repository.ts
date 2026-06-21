/**
 * Archivo: tours-virtuales.repository.ts
 * Ubicación: modules/virtual-tours/repositories
 * Tipo: Repositorio
 * Tabla BD: tours_virtuales
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TourVirtualEntidad } from '../entities/tour-virtual.entity';

@Injectable()
export class ToursVirtualesRepositorio {
  constructor(
    @InjectRepository(TourVirtualEntidad)
    private readonly repositorio: Repository<TourVirtualEntidad>,
  ) {}

  async crearTour(datos: Partial<TourVirtualEntidad>): Promise<TourVirtualEntidad> {
    const tour = this.repositorio.create(datos);
    return this.repositorio.save(tour);
  }

  async buscarTourPorId(id: number): Promise<TourVirtualEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listarToursPorPropiedad(propiedadId: number): Promise<TourVirtualEntidad[]> {
    return this.repositorio.find({
      where: { propiedadId },
      order: { creadoEn: 'DESC' },
    });
  }

  async actualizarTour(
    id: number,
    datos: Partial<TourVirtualEntidad>,
  ): Promise<TourVirtualEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.buscarTourPorId(id);
  }

  async eliminarTour(id: number): Promise<void> {
    await this.repositorio.delete(id);
  }
}
