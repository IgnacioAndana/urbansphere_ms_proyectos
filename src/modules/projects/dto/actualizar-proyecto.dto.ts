/**
 * Archivo: actualizar-proyecto.dto.ts
 * Ubicación: modules/projects/dto
 * Tipo: DTO de entrada
 * Uso: PATCH /api/proyectos/:id
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

export class ActualizarProyectoDto {
  @ApiPropertyOptional({ example: 'Residencial Las Palmas II' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: 'residencial-las-palmas-ii' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'Santiago' })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ enum: EstadoProyecto })
  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;
}
