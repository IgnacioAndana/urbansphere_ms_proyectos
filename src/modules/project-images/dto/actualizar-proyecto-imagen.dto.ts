/**
 * Archivo: actualizar-proyecto-imagen.dto.ts
 * Ubicación: modules/project-images/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ActualizarProyectoImagenDto {
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
  @IsBoolean()
  esPanoramica360?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;
}
