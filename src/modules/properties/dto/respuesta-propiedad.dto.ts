/**
 * Archivo: respuesta-propiedad.dto.ts
 * Ubicación: modules/properties/dto
 * Tipo: DTO de salida
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoPropiedad } from '../../../common/enums/estado-propiedad.enum';

export class RespuestaPropiedadDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  proyectoId: number;

  @ApiPropertyOptional({ example: 'Residencial Las Palmas' })
  nombreProyecto?: string;

  @ApiProperty({ example: 'Departamento 3D/2B con vista al mar' })
  titulo: string;

  @ApiPropertyOptional()
  descripcion?: string | null;

  @ApiProperty({ example: 185000000 })
  precio: number;

  @ApiProperty({ example: 3 })
  dormitorios: number;

  @ApiProperty({ example: 2 })
  banos: number;

  @ApiPropertyOptional({ example: 95.5 })
  areaM2?: number | null;

  @ApiProperty({ enum: EstadoPropiedad, example: EstadoPropiedad.DISPONIBLE })
  estado: EstadoPropiedad;

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  creadoEn: Date;

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  actualizadoEn: Date;
}
