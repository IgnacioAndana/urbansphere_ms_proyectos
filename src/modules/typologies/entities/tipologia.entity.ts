/**
 * Archivo: tipologia.entity.ts
 * Ubicación: modules/typologies/entities
 * Tabla BD: tipologias
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProyectoEntidad } from '../../projects/entities/proyecto.entity';

@Entity('tipologias')
export class TipologiaEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'proyecto_id', type: 'bigint' })
  proyectoId: number;

  @Column({ name: 'codigo_tipologia', type: 'varchar', length: 50 })
  codigoTipologia: string;

  @Column({ type: 'int' })
  dormitorios: number;

  @Column({ type: 'int' })
  banos: number;

  @Column({ name: 'superficie_m2', type: 'decimal', precision: 8, scale: 2 })
  superficieM2: number;

  @Column({ name: 'valor_en_uf', type: 'decimal', precision: 12, scale: 2 })
  valorEnUf: number;

  @CreateDateColumn({ name: 'creado_en', type: 'datetime', precision: 0 })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'datetime', precision: 0 })
  actualizadoEn: Date;

  @ManyToOne(() => ProyectoEntidad)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoEntidad;
}
