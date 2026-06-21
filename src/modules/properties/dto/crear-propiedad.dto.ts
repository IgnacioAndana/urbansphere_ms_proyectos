/**
 * Archivo: crear-propiedad.dto.ts
 * Ubicación: modules/properties/dto
 * Tipo: DTO de entrada
 * Uso: POST /api/propiedades
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { EstadoPropiedad } from '../../../common/enums/estado-propiedad.enum';

export class CrearPropiedadDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  proyectoId: number;

  @ApiProperty({ example: 'Departamento 3D/2B con vista al mar' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiPropertyOptional({ example: 'Amplio departamento en piso alto' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 185000000 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  dormitorios?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  banos?: number;

  @ApiPropertyOptional({ example: 95.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  areaM2?: number;

  @ApiPropertyOptional({ enum: EstadoPropiedad, example: EstadoPropiedad.DISPONIBLE })
  @IsOptional()
  @IsEnum(EstadoPropiedad)
  estado?: EstadoPropiedad;
}
