/**
 * Archivo: crear-propiedad-caracteristica.dto.ts
 * Ubicación: modules/property-features/dto
 * Tipo: DTO de entrada
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CrearPropiedadCaracteristicaDto {
  @ApiProperty({ example: 'Estacionamiento' })
  @IsString()
  @IsNotEmpty()
  nombreCaracteristica: string;

  @ApiProperty({ example: '2 vehículos' })
  @IsString()
  @IsNotEmpty()
  valorCaracteristica: string;
}
