/**
 * Archivo: actualizar-proyecto-imagen.dto.ts
 * Ubicación: modules/project-images/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { aBooleano, aEntero } from '../../../common/utils/transformar-multipart.util';

export class ActualizarProyectoImagenDto {
  @Allow()
  id?: number;

  @Allow()
  proyectoId?: number;

  @Allow()
  creadoEn?: unknown;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urlS3?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  etiqueta?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  esPortada?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  esPanoramica360?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(aEntero)
  @IsInt()
  @Min(0)
  orden?: number;
}
