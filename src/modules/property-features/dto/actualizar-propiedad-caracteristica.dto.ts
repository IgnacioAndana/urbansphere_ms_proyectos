/**
 * Archivo: actualizar-propiedad-caracteristica.dto.ts
 * Ubicación: modules/property-features/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ActualizarPropiedadCaracteristicaDto {
  @ApiPropertyOptional({ example: 'Estacionamiento' })
  @IsOptional()
  @IsString()
  nombreCaracteristica?: string;

  @ApiPropertyOptional({ example: '1 vehículo' })
  @IsOptional()
  @IsString()
  valorCaracteristica?: string;
}
