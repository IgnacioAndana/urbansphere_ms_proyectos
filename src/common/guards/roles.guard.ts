/**
 * Archivo: roles.guard.ts
 * Ubicación: common/guards
 * Tipo: Guard de autorización
 * Contenido: valida que el rol del JWT esté permitido en el endpoint
 */

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../constants/app.constants';
import { CLAVE_RUTA_PUBLICA } from '../decorators/public.decorator';
import { ROLES_CLAVE } from '../decorators/roles.decorator';
import { CargaJwt } from '../../modules/auth/interfaces/carga-jwt.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<string[]>(ROLES_CLAVE, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    if (!rolesPermitidos?.length) {
      return true;
    }

    const peticion = contexto.switchToHttp().getRequest<{ user?: CargaJwt }>();
    const usuario = peticion.user;

    if (!usuario?.rol) {
      const esPublica = this.reflector.getAllAndOverride<boolean>(CLAVE_RUTA_PUBLICA, [
        contexto.getHandler(),
        contexto.getClass(),
      ]);

      if (esPublica && rolesPermitidos.includes(ROLES.USER)) {
        return true;
      }

      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
