/**
 * Archivo: proyecto-imagenes.repository.ts
 * Ubicación: modules/project-images/repositories
 * Tipo: Repositorio
 * Tabla BD: proyecto_imagenes
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoImagenEntidad } from '../entities/proyecto-imagen.entity';

@Injectable()
export class ProyectoImagenesRepositorio {
  constructor(
    @InjectRepository(ProyectoImagenEntidad)
    private readonly repositorio: Repository<ProyectoImagenEntidad>,
  ) {}

  async crearImagen(datos: Partial<ProyectoImagenEntidad>): Promise<ProyectoImagenEntidad> {
    const imagen = this.repositorio.create(datos);
    return this.repositorio.save(imagen);
  }

  async buscarImagenPorId(id: number): Promise<ProyectoImagenEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listarImagenesPorProyecto(proyectoId: number): Promise<ProyectoImagenEntidad[]> {
    return this.repositorio.find({
      where: { proyectoId },
      order: { orden: 'ASC', creadoEn: 'ASC' },
    });
  }

  async actualizarImagen(
    id: number,
    datos: Partial<ProyectoImagenEntidad>,
  ): Promise<ProyectoImagenEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.buscarImagenPorId(id);
  }

  async eliminarImagen(id: number): Promise<void> {
    await this.repositorio.delete(id);
  }

  async quitarPortadaDeProyecto(proyectoId: number): Promise<void> {
    await this.repositorio.update({ proyectoId, esPortada: true }, { esPortada: false });
  }

  async quitarPanoramica360DeProyecto(proyectoId: number): Promise<void> {
    await this.repositorio.update(
      { proyectoId, esPanoramica360: true },
      { esPanoramica360: false },
    );
  }
}
