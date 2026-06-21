/**
 * Archivo: propiedad-imagen.entity.ts
 * Ubicación: modules/property-images/entities
 * Tipo: Entidad TypeORM
 * Tabla BD: propiedad_imagenes
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PropiedadEntidad } from '../../properties/entities/propiedad.entity';

@Entity('propiedad_imagenes')
export class PropiedadImagenEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'propiedad_id', type: 'bigint' })
  propiedadId: number;

  @Column({ name: 'url_s3', type: 'text' })
  urlS3: string;

  @Column({ name: 'es_portada', type: 'boolean', default: false })
  esPortada: boolean;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @CreateDateColumn({ name: 'creado_en', type: 'datetime', precision: 0 })
  creadoEn: Date;

  @ManyToOne(() => PropiedadEntidad)
  @JoinColumn({ name: 'propiedad_id' })
  propiedad: PropiedadEntidad;
}
