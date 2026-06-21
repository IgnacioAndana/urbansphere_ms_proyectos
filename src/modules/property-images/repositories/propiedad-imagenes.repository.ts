/**
 * Archivo: propiedad-imagenes.repository.ts
 * Ubicación: modules/property-images/repositories
 * Tipo: Repositorio
 * Tabla BD: propiedad_imagenes
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropiedadImagenEntidad } from '../entities/propiedad-imagen.entity';

@Injectable()
export class PropiedadImagenesRepositorio {
  constructor(
    @InjectRepository(PropiedadImagenEntidad)
    private readonly repositorio: Repository<PropiedadImagenEntidad>,
  ) {}

  async crearImagen(datos: Partial<PropiedadImagenEntidad>): Promise<PropiedadImagenEntidad> {
    const imagen = this.repositorio.create(datos);
    return this.repositorio.save(imagen);
  }

  async buscarImagenPorId(id: number): Promise<PropiedadImagenEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listarImagenesPorPropiedad(propiedadId: number): Promise<PropiedadImagenEntidad[]> {
    return this.repositorio.find({
      where: { propiedadId },
      order: { orden: 'ASC', creadoEn: 'ASC' },
    });
  }

  async actualizarImagen(
    id: number,
    datos: Partial<PropiedadImagenEntidad>,
  ): Promise<PropiedadImagenEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.buscarImagenPorId(id);
  }

  async eliminarImagen(id: number): Promise<void> {
    await this.repositorio.delete(id);
  }

  async quitarPortadaDePropiedad(propiedadId: number): Promise<void> {
    await this.repositorio.update({ propiedadId, esPortada: true }, { esPortada: false });
  }
}
