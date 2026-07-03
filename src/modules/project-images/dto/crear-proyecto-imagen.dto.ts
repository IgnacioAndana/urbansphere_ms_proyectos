/**
 * Archivo: crear-proyecto-imagen.dto.ts
 * Ubicación: modules/project-images/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { aBooleano, aEntero } from '../../../common/utils/transformar-multipart.util';

export class CrearProyectoImagenDto {
  @ApiPropertyOptional({
    example: 'https://urbansphere-images.s3.us-east-1.amazonaws.com/proyectos/1/galeria/img.jpg',
  })
  @IsOptional()
  @IsString()
  urlS3?: string;

  @ApiPropertyOptional({ example: 'fachada', description: 'Etiqueta: fachada, ubicacion, etc.' })
  @IsOptional()
  @IsString()
  etiqueta?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Si true, esta imagen pasa a ser la portada del proyecto (solo una)',
  })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  esPortada?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Transform(aEntero)
  @IsInt()
  @Min(0)
  orden?: number;
}
