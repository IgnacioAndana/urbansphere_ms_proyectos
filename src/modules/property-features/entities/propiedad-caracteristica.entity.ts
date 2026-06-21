/**
 * Archivo: propiedad-caracteristica.entity.ts
 * Ubicación: modules/property-features/entities
 * Tipo: Entidad TypeORM
 * Tabla BD: propiedad_caracteristicas
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PropiedadEntidad } from '../../properties/entities/propiedad.entity';

@Entity('propiedad_caracteristicas')
export class PropiedadCaracteristicaEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'propiedad_id', type: 'bigint' })
  propiedadId: number;

  @Column({ name: 'nombre_caracteristica', type: 'varchar', length: 100 })
  nombreCaracteristica: string;

  @Column({ name: 'valor_caracteristica', type: 'varchar', length: 255 })
  valorCaracteristica: string;

  @ManyToOne(() => PropiedadEntidad)
  @JoinColumn({ name: 'propiedad_id' })
  propiedad: PropiedadEntidad;
}
