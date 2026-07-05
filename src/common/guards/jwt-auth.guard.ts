/**
 * Archivo: jwt-auth.guard.ts
 * Ubicación: common/guards
 * Tipo: Guard de autenticación
 * Contenido: protege rutas que requieren JWT válido (salvo @Public())
 */

import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CLAVE_RUTA_PUBLICA } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(contexto: ExecutionContext) {
    const esPublica = this.reflector.getAllAndOverride<boolean>(CLAVE_RUTA_PUBLICA, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    if (esPublica) {
      return true;
    }

    return super.canActivate(contexto);
  }
}
