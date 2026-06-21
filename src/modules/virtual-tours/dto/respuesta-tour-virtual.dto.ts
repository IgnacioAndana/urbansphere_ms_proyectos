/**
 * Archivo: respuesta-tour-virtual.dto.ts
 * Ubicación: modules/virtual-tours/dto
 * Tipo: DTO de salida
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoTourVirtual } from '../../../common/enums/estado-tour-virtual.enum';

export class RespuestaTourVirtualDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  propiedadId: number;

  @ApiPropertyOptional({ example: 'https://urbansphere.s3.amazonaws.com/tours/1/tour.html' })
  urlTour?: string | null;

  @ApiProperty({ enum: EstadoTourVirtual, example: EstadoTourVirtual.PENDIENTE })
  estado: EstadoTourVirtual;

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  creadoEn: Date;
}
