import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipologiaEntidad } from '../entities/tipologia.entity';

@Injectable()
export class TipologiasRepositorio {
  constructor(
    @InjectRepository(TipologiaEntidad)
    private readonly repositorio: Repository<TipologiaEntidad>,
  ) {}

  async crearTipologia(datos: Partial<TipologiaEntidad>): Promise<TipologiaEntidad> {
    const tipologia = this.repositorio.create(datos);
    return this.repositorio.save(tipologia);
  }

  async buscarPorId(id: number): Promise<TipologiaEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async buscarPorProyectoYCodigo(
    proyectoId: number,
    codigoTipologia: string,
  ): Promise<TipologiaEntidad | null> {
    return this.repositorio.findOne({ where: { proyectoId, codigoTipologia } });
  }

  async listarPorProyecto(proyectoId: number): Promise<TipologiaEntidad[]> {
    return this.repositorio.find({
      where: { proyectoId },
      order: { codigoTipologia: 'ASC' },
    });
  }

  async actualizarTipologia(
    id: number,
    datos: Partial<TipologiaEntidad>,
  ): Promise<TipologiaEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.buscarPorId(id);
  }

  async eliminarTipologia(id: number): Promise<void> {
    await this.repositorio.delete(id);
  }
}
