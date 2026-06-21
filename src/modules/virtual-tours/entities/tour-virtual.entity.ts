/**
 * Archivo: tour-virtual.entity.ts
 * Ubicación: modules/virtual-tours/entities
 * Tipo: Entidad TypeORM
 * Tabla BD: tours_virtuales
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EstadoTourVirtual } from '../../../common/enums/estado-tour-virtual.enum';
import { PropiedadEntidad } from '../../properties/entities/propiedad.entity';

@Entity('tours_virtuales')
export class TourVirtualEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'propiedad_id', type: 'bigint' })
  propiedadId: number;

  @Column({ name: 'url_tour', type: 'text', nullable: true })
  urlTour: string | null;

  @Column({
    type: 'enum',
    enum: EstadoTourVirtual,
    default: EstadoTourVirtual.PENDIENTE,
  })
  estado: EstadoTourVirtual;

  @CreateDateColumn({ name: 'creado_en', type: 'datetime', precision: 0 })
  creadoEn: Date;

  @ManyToOne(() => PropiedadEntidad)
  @JoinColumn({ name: 'propiedad_id' })
  propiedad: PropiedadEntidad;
}
