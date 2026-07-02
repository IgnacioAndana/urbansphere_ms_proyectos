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

@Entity('proyecto_equipamiento')
export class ProyectoEquipamientoEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'proyecto_id', type: 'bigint', unique: true })
  proyectoId: number;

  @Column({ type: 'boolean', default: false })
  gimnasio: boolean;

  @Column({ type: 'boolean', default: false })
  quincho: boolean;

  @Column({ name: 'areas_verdes', type: 'boolean', default: false })
  areasVerdes: boolean;

  @Column({ type: 'boolean', default: false })
  bicicletero: boolean;

  @Column({ type: 'boolean', default: false })
  piscina: boolean;

  @Column({ name: 'juegos_infantiles', type: 'boolean', default: false })
  juegosInfantiles: boolean;

  @Column({ name: 'gourmet_lounge', type: 'boolean', default: false })
  gourmetLounge: boolean;

  @Column({ name: 'coworking_room', type: 'boolean', default: false })
  coworkingRoom: boolean;

  @CreateDateColumn({ name: 'creado_en', type: 'datetime', precision: 0 })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'datetime', precision: 0 })
  actualizadoEn: Date;

  @ManyToOne(() => ProyectoEntidad)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoEntidad;
}
