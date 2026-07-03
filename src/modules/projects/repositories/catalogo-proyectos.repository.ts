import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProyectoImagenEntidad } from '../../project-images/entities/proyecto-imagen.entity';
import { TipologiaEntidad } from '../../typologies/entities/tipologia.entity';
import { AgregacionTipologiasCatalogo } from '../interfaces/agregacion-tipologias-catalogo.interface';
import { ProyectoEntidad } from '../entities/proyecto.entity';

@Injectable()
export class CatalogoProyectosRepositorio {
  constructor(
    @InjectRepository(ProyectoEntidad)
    private readonly proyectosRepo: Repository<ProyectoEntidad>,
    @InjectRepository(TipologiaEntidad)
    private readonly tipologiasRepo: Repository<TipologiaEntidad>,
    @InjectRepository(ProyectoImagenEntidad)
    private readonly imagenesRepo: Repository<ProyectoImagenEntidad>,
  ) {}

  async buscarProyectosPorIds(ids: number[]): Promise<ProyectoEntidad[]> {
    if (!ids.length) return [];
    return this.proyectosRepo.find({ where: { id: In(ids) } });
  }

  async agregarTipologiasPorProyectos(
    proyectoIds: number[],
  ): Promise<Map<number, AgregacionTipologiasCatalogo>> {
    const resultado = new Map<number, AgregacionTipologiasCatalogo>();
    if (!proyectoIds.length) return resultado;

    const filas = await this.tipologiasRepo
      .createQueryBuilder('t')
      .select('t.proyecto_id', 'proyectoId')
      .addSelect(
        'MIN(CASE WHEN t.valor_en_uf > 0 THEN t.valor_en_uf ELSE NULL END)',
        'precioDesdeUf',
      )
      .addSelect('MIN(t.dormitorios)', 'dormitoriosMin')
      .addSelect('MAX(t.dormitorios)', 'dormitoriosMax')
      .addSelect('MIN(t.banos)', 'banosMin')
      .addSelect('MAX(t.banos)', 'banosMax')
      .addSelect('MIN(t.superficie_m2)', 'superficieMin')
      .addSelect('MAX(t.superficie_m2)', 'superficieMax')
      .where('t.proyecto_id IN (:...proyectoIds)', { proyectoIds })
      .groupBy('t.proyecto_id')
      .getRawMany<Record<string, unknown>>();

    for (const fila of filas) {
      const proyectoId = Number(fila.proyectoId);
      resultado.set(proyectoId, {
        precioDesdeUf: this.aNumeroONulo(fila.precioDesdeUf),
        dormitoriosMin: this.aNumeroONulo(fila.dormitoriosMin),
        dormitoriosMax: this.aNumeroONulo(fila.dormitoriosMax),
        banosMin: this.aNumeroONulo(fila.banosMin),
        banosMax: this.aNumeroONulo(fila.banosMax),
        superficieMin: this.aNumeroONulo(fila.superficieMin),
        superficieMax: this.aNumeroONulo(fila.superficieMax),
      });
    }

    return resultado;
  }

  async obtenerUrlPortadaPorProyectos(proyectoIds: number[]): Promise<Map<number, string>> {
    const portadas = new Map<number, string>();
    if (!proyectoIds.length) return portadas;

    const imagenes = await this.imagenesRepo.find({
      where: { proyectoId: In(proyectoIds) },
      order: { esPortada: 'DESC', orden: 'ASC', creadoEn: 'ASC' },
    });

    for (const imagen of imagenes) {
      const proyectoId = Number(imagen.proyectoId);
      if (!portadas.has(proyectoId)) {
        portadas.set(proyectoId, imagen.urlS3);
      }
    }

    return portadas;
  }

  private aNumeroONulo(valor: unknown): number | null {
    if (valor === null || valor === undefined) return null;
    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
  }
}
