/**
 * Archivo: crear-proyecto.dto.ts
 * Ubicación: modules/projects/dto
 * Tipo: DTO de entrada
 * Uso: POST /api/proyectos
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

export class CrearProyectoDto {
  @ApiProperty({ example: 'Residencial Las Palmas' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: 'residencial-las-palmas' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Proyecto residencial de lujo en zona norte' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'Santiago' })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiPropertyOptional({ example: 'Av. Las Condes 1234' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ enum: EstadoProyecto, example: EstadoProyecto.BORRADOR })
  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;
}
