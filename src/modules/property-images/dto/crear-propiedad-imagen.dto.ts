/**
 * Archivo: crear-propiedad-imagen.dto.ts
 * Ubicación: modules/property-images/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CrearPropiedadImagenDto {
  @ApiPropertyOptional({ example: 'https://urbansphere.s3.amazonaws.com/properties/1/img.jpg' })
  @IsOptional()
  @IsString()
  urlS3?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  esPortada?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;
}
