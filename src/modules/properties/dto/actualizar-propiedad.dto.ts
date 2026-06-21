/**
 * Archivo: actualizar-propiedad.dto.ts
 * Ubicación: modules/properties/dto
 * Tipo: DTO de entrada
 * Uso: PATCH /api/propiedades/:id
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { EstadoPropiedad } from '../../../common/enums/estado-propiedad.enum';

export class ActualizarPropiedadDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  proyectoId?: number;

  @ApiPropertyOptional({ example: 'Departamento 3D/2B renovado' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 190000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

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

  @ApiPropertyOptional({ example: 98 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  areaM2?: number;

  @ApiPropertyOptional({ enum: EstadoPropiedad })
  @IsOptional()
  @IsEnum(EstadoPropiedad)
  estado?: EstadoPropiedad;
}
