/**
 * Archivo: crear-proyecto-imagen.dto.ts
 * Ubicación: modules/project-images/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CrearProyectoImagenDto {
  @ApiPropertyOptional({ example: 'https://bucket.s3.amazonaws.com/projects/1/img.jpg' })
  @IsOptional()
  @IsString()
  urlS3?: string;

  @ApiPropertyOptional({ example: 'fachada', description: 'Etiqueta: fachada, ubicacion, etc.' })
  @IsOptional()
  @IsString()
  etiqueta?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  esPortada?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Imagen panorámica 360° del proyecto' })
  @IsOptional()
  @IsBoolean()
  esPanoramica360?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;
}
