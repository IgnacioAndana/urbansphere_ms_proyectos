import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEquipamientoEntidad } from '../entities/proyecto-equipamiento.entity';

@Injectable()
export class ProyectoEquipamientoRepositorio {
  constructor(
    @InjectRepository(ProyectoEquipamientoEntidad)
    private readonly repositorio: Repository<ProyectoEquipamientoEntidad>,
  ) {}

  async buscarPorProyecto(proyectoId: number): Promise<ProyectoEquipamientoEntidad | null> {
    return this.repositorio.findOne({ where: { proyectoId } });
  }

  async crearEquipamiento(
    datos: Partial<ProyectoEquipamientoEntidad>,
  ): Promise<ProyectoEquipamientoEntidad> {
    const equipamiento = this.repositorio.create(datos);
    return this.repositorio.save(equipamiento);
  }

  async actualizarEquipamiento(
    id: number,
    datos: Partial<ProyectoEquipamientoEntidad>,
  ): Promise<ProyectoEquipamientoEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.repositorio.findOne({ where: { id } });
  }
}
