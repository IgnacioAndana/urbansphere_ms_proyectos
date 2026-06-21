/**
 * Archivo: usuarios.repository.ts
 * Ubicación: modules/auth/repositories
 * Tipo: Repositorio
 * Tabla BD: usuarios
 * Métodos: buscarUsuarioPorId (validación JWT)
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntidad } from '../entities/usuario.entity';

@Injectable()
export class UsuariosRepositorio {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly repositorio: Repository<UsuarioEntidad>,
  ) {}

  async buscarUsuarioPorId(id: number): Promise<UsuarioEntidad | null> {
    return this.repositorio.findOne({ where: { id } });
  }
}
