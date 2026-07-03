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
import { TipoProyecto } from '../../../common/enums/tipo-proyecto.enum';

@Entity('proyectos')
export class ProyectoEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @Column({ type: 'varchar', length: 100 })
  comuna: string;

  @Column({
    type: 'enum',
    enum: TipoProyecto,
    default: TipoProyecto.DEPARTAMENTO,
  })
  tipo: TipoProyecto;

  @Column({ name: 'fecha_entrega_estimada', type: 'date', nullable: true })
  fechaEntregaEstimada: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitud: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitud: number | null;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

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
