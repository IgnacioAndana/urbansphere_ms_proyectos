/**
 * Archivo: respuesta-proyecto.dto.ts
 * Ubicación: modules/projects/dto
 * Tipo: DTO de salida
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';
import { RespuestaProyectoImagenDto } from '../../project-images/dto/respuesta-proyecto-imagen.dto';

export class RespuestaProyectoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Edificio Vista Parque' })
  titulo: string;

  @ApiProperty({ example: 'edificio-vista-parque' })
  slug: string;

  @ApiProperty({ example: 'Av. Providencia 1234, Providencia, Santiago' })
  direccion: string;

  @ApiProperty({ example: 250000000 })
  precio: number;

  @ApiPropertyOptional({ example: -33.4489 })
  latitud?: number | null;

  @ApiPropertyOptional({ example: -70.6693 })
  longitud?: number | null;

  @ApiPropertyOptional()
  descripcion?: string | null;

  @ApiProperty({ enum: EstadoProyecto, example: EstadoProyecto.ACTIVO })
  estado: EstadoProyecto;

  @ApiPropertyOptional({ type: [RespuestaProyectoImagenDto] })
  imagenes?: RespuestaProyectoImagenDto[];

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  creadoEn: Date;

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  actualizadoEn: Date;
}
