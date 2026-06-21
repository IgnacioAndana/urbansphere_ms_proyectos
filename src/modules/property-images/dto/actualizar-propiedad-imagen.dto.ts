/**
 * Archivo: actualizar-propiedad-imagen.dto.ts
 * Ubicación: modules/property-images/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ActualizarPropiedadImagenDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urlS3?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  esPortada?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;
}
