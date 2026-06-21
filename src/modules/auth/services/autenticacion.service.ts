/**
 * Archivo: autenticacion.service.ts
 * Ubicación: modules/auth/services
 * Tipo: Servicio de negocio
 * Métodos: validarUsuario
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CargaJwt } from '../interfaces/carga-jwt.interface';
import { UsuariosRepositorio } from '../repositories/usuarios.repository';

@Injectable()
export class AutenticacionServicio {
  constructor(private readonly usuariosRepositorio: UsuariosRepositorio) {}

  async validarUsuario(carga: CargaJwt): Promise<CargaJwt> {
    const usuario = await this.usuariosRepositorio.buscarUsuarioPorId(carga.sub);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }
    return carga;
  }
}
