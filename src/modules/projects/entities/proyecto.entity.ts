/**
 * Archivo: proyecto.entity.ts
 * Ubicación: modules/projects/entities
 * Tipo: Entidad TypeORM
 * Tabla BD: proyectos
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

@Entity('proyectos')
export class ProyectoEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  ciudad: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string | null;

  @Column({
    type: 'enum',
    enum: EstadoProyecto,
    default: EstadoProyecto.BORRADOR,
  })
  estado: EstadoProyecto;

  @CreateDateColumn({ name: 'creado_en', type: 'datetime', precision: 0 })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'datetime', precision: 0 })
  actualizadoEn: Date;
}
