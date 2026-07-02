import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipologiaImagenEntidad } from '../entities/tipologia-imagen.entity';

@Injectable()
export class TipologiaImagenesRepositorio {
  constructor(
    @InjectRepository(TipologiaImagenEntidad)
    private readonly repositorio: Repository<TipologiaImagenEntidad>,
  ) {}

  async crearImagen(datos: Partial<TipologiaImagenEntidad>): Promise<TipologiaImagenEntidad> {
    const imagen = this.repositorio.create(datos);
    return this.repositorio.save(imagen);
  }

  async buscarImagenPorId(id: number): Promise<TipologiaImagenEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listarImagenesPorTipologia(tipologiaId: number): Promise<TipologiaImagenEntidad[]> {
    return this.repositorio.find({
      where: { tipologiaId },
      order: { orden: 'ASC', creadoEn: 'ASC' },
    });
  }

  async actualizarImagen(
    id: number,
    datos: Partial<TipologiaImagenEntidad>,
  ): Promise<TipologiaImagenEntidad | null> {
    await this.repositorio.update(id, datos);
    return this.buscarImagenPorId(id);
  }

  async eliminarImagen(id: number): Promise<void> {
    await this.repositorio.delete(id);
  }

  async quitarPortadaDeTipologia(tipologiaId: number): Promise<void> {
    await this.repositorio.update({ tipologiaId, esPortada: true }, { esPortada: false });
  }

  async quitarPanoramica360DeTipologia(tipologiaId: number): Promise<void> {
    await this.repositorio.update(
      { tipologiaId, esPanoramica360: true },
      { esPanoramica360: false },
    );
  }
}
