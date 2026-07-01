/**
 * Archivo: proyecto-imagen.entity.ts
 * Ubicación: modules/project-images/entities
 * Tipo: Entidad TypeORM
 * Tabla BD: proyecto_imagenes
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProyectoEntidad } from '../../projects/entities/proyecto.entity';

@Entity('proyecto_imagenes')
export class ProyectoImagenEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'proyecto_id', type: 'bigint' })
  proyectoId: number;

  @Column({ name: 'url_s3', type: 'text' })
  urlS3: string;

  @Column({ name: 'es_portada', type: 'boolean', default: false })
  esPortada: boolean;

  @Column({ name: 'es_panoramica_360', type: 'boolean', default: false })
  esPanoramica360: boolean;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @CreateDateColumn({ name: 'creado_en', type: 'datetime', precision: 0 })
  creadoEn: Date;

  @ManyToOne(() => ProyectoEntidad)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoEntidad;
}
