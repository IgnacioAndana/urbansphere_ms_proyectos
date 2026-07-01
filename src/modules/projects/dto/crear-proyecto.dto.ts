/**
 * Archivo: crear-proyecto.dto.ts
 * Ubicación: modules/projects/dto
 * Tipo: DTO de entrada
 * Uso: POST /api/proyectos
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

export class CrearProyectoDto {
  @ApiProperty({ example: 'Edificio Vista Parque' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @ApiProperty({ example: 'Av. Providencia 1234, Providencia, Santiago' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  direccion: string;

  @ApiProperty({ example: 250000000, description: 'Precio en CLP' })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiPropertyOptional({ example: -33.4489 })
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @ApiPropertyOptional({ example: -70.6693 })
  @IsOptional()
  @IsNumber()
  longitud?: number;

  @ApiPropertyOptional({ example: 'Proyecto residencial con vista al parque...' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  descripcion?: string;

  @ApiPropertyOptional({ example: 'edificio-vista-parque' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ enum: EstadoProyecto, example: EstadoProyecto.BORRADOR })
  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;
}
