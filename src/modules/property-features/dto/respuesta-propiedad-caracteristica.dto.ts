/**
 * Archivo: respuesta-propiedad-caracteristica.dto.ts
 * Ubicación: modules/property-features/dto
 * Tipo: DTO de salida
 */

import { ApiProperty } from '@nestjs/swagger';

export class RespuestaPropiedadCaracteristicaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  propiedadId: number;

  @ApiProperty({ example: 'Estacionamiento' })
  nombreCaracteristica: string;

  @ApiProperty({ example: '2 vehículos' })
  valorCaracteristica: string;
}
