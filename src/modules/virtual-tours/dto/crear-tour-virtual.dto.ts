/**
 * Archivo: crear-tour-virtual.dto.ts
 * Ubicación: modules/virtual-tours/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoTourVirtual } from '../../../common/enums/estado-tour-virtual.enum';

export class CrearTourVirtualDto {
  @ApiPropertyOptional({ example: 'https://urbansphere.s3.amazonaws.com/tours/1/tour.html' })
  @IsOptional()
  @IsString()
  urlTour?: string;

  @ApiPropertyOptional({ enum: EstadoTourVirtual, example: EstadoTourVirtual.PENDIENTE })
  @IsOptional()
  @IsEnum(EstadoTourVirtual)
  estado?: EstadoTourVirtual;
}
