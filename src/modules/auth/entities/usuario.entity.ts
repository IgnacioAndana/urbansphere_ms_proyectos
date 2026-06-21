/**
 * Archivo: usuario.entity.ts
 * Ubicación: modules/auth/entities
 * Tipo: Entidad TypeORM (solo lectura para validación JWT)
 * Tabla BD: usuarios
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class UsuarioEntidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 36, unique: true })
  uuid: string;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;
}
