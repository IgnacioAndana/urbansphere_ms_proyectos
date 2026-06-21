/**
 * Archivo: propiedad.entity.ts
 * Ubicación: modules/properties/entities
 * Tipo: Entidad TypeORM
 * Tabla BD: propiedades
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
import { EstadoPropiedad } from '../../../common/enums/estado-propiedad.enum';
import { ProyectoEntidad } from '../../projects/entities/proyecto.entity';

@Entity('propiedades')
export class PropiedadEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'proyecto_id', type: 'bigint' })
  proyectoId: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  precio: number;

  @Column({ type: 'int', default: 0 })
  dormitorios: number;

  @Column({ type: 'int', default: 0 })
  banos: number;

  @Column({ name: 'area_m2', type: 'decimal', precision: 10, scale: 2, nullable: true })
  areaM2: number | null;

  @Column({
    type: 'enum',
    enum: EstadoPropiedad,
    default: EstadoPropiedad.DISPONIBLE,
  })
  estado: EstadoPropiedad;

  @CreateDateColumn({ name: 'creado_en', type: 'datetime', precision: 0 })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'datetime', precision: 0 })
  actualizadoEn: Date;

  @ManyToOne(() => ProyectoEntidad, { eager: true })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoEntidad;
}
