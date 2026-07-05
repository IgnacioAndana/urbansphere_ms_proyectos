/**
 * Archivo: usuario-actual.decorator.ts
 * Ubicación: common/decorators
 * Tipo: Decorador de parámetro
 * Contenido: extrae la carga JWT del usuario autenticado
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CargaJwt } from '../../modules/auth/interfaces/carga-jwt.interface';

export const UsuarioActual = createParamDecorator(
  (_datos: unknown, ctx: ExecutionContext): CargaJwt | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: CargaJwt }>();
    return request.user;
  },
);
