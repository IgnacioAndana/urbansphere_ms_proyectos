/**
 * Archivo: carga-jwt.interface.ts
 * Ubicación: modules/auth/interfaces
 * Tipo: Interfaces de autenticación
 * Contenido: estructura del payload JWT
 */

export interface CargaJwt {
  sub: number;
  uuid: string;
  email: string;
  rol: string;
}
