/**
 * Archivo: propiedad-caracteristicas.repository.ts
 * Ubicación: modules/property-features/repositories
 * Tipo: Repositorio
 * Tabla BD: propiedad_caracteristicas
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropiedadCaracteristicaEntidad } from '../entities/propiedad-caracteristica.entity';

@Injectable()
export class PropiedadCaracteristicasRepositorio {
  constructor(
    @InjectRepository(PropiedadCaracteristicaEntidad)
    private readonly repositorio: Repository<PropiedadCaracteristicaEntidad>,
  ) {}

  async crearCaracteristica(
    datos: Partial<PropiedadCaracteristicaEntidad>,
  ): Promise<PropiedadCaracteristicaEntidad> {
    const caracteristica = this.repositorio.create(datos);
    return this.repositorio.save(caracteristica);
  }

  async buscarCaracteristicaPorId(id: number): Promise<PropiedadCaracteristicaEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listarCaracteristicasPorPropiedad(
    propiedadId: number,
  ): Promise<PropiedadCaracteristicaEntidad[]> {
    return this.repositorio.find({
      where: { propiedadId },
      order: { nombreCaracteristica: 'ASC' },
    });
  }

  async actualizarCaracteristica(
    id: number,
    datos: Partial<PropiedadCaracteristicaEntidad>,
  ): Promise<PropiedadCaracteristicaEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.buscarCaracteristicaPorId(id);
  }

  async eliminarCaracteristica(id: number): Promise<void> {
    await this.repositorio.delete(id);
  }
}
