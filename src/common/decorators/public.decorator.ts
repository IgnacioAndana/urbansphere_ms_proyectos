import { SetMetadata } from '@nestjs/common';

export const CLAVE_RUTA_PUBLICA = 'rutaPublica';

/** Marca un endpoint como accesible sin JWT (catálogo público). */
export const Public = () => SetMetadata(CLAVE_RUTA_PUBLICA, true);
