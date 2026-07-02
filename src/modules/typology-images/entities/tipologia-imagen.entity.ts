import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipologiaEntidad } from '../../typologies/entities/tipologia.entity';

@Entity('tipologia_imagenes')
export class TipologiaImagenEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'tipologia_id', type: 'bigint' })
  tipologiaId: number;

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

  @ManyToOne(() => TipologiaEntidad)
  @JoinColumn({ name: 'tipologia_id' })
  tipologia: TipologiaEntidad;
}
