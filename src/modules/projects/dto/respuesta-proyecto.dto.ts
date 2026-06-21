/**
 * Archivo: respuesta-proyecto.dto.ts
 * Ubicación: modules/projects/dto
 * Tipo: DTO de salida
 * Uso: respuestas de endpoints de proyectos
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

export class RespuestaProyectoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Residencial Las Palmas' })
  nombre: string;

  @ApiProperty({ example: 'residencial-las-palmas' })
  slug: string;

  @ApiPropertyOptional({ example: 'Proyecto residencial de lujo' })
  descripcion?: string | null;

  @ApiPropertyOptional({ example: 'Santiago' })
  ciudad?: string | null;

  @ApiPropertyOptional({ example: 'Av. Las Condes 1234' })
  direccion?: string | null;

  @ApiProperty({ enum: EstadoProyecto, example: EstadoProyecto.ACTIVO })
  estado: EstadoProyecto;

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  creadoEn: Date;

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  actualizadoEn: Date;
}
