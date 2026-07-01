/**
 * Archivo: actualizar-proyecto.dto.ts
 * Ubicación: modules/projects/dto
 * Tipo: DTO de entrada
 * Uso: PATCH /api/proyectos/:id
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

export class ActualizarProyectoDto {
  @ApiPropertyOptional({ example: 'Edificio Vista Parque II' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string;

  @ApiPropertyOptional({ example: 265000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @ApiPropertyOptional({ example: -33.4489 })
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @ApiPropertyOptional({ example: -70.6693 })
  @IsOptional()
  @IsNumber()
  longitud?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  descripcion?: string;

  @ApiPropertyOptional({ example: 'edificio-vista-parque-ii' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ enum: EstadoProyecto })
  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;
}
