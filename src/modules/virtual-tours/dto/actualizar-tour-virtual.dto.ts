/**
 * Archivo: actualizar-tour-virtual.dto.ts
 * Ubicación: modules/virtual-tours/dto
 * Tipo: DTO de entrada
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoTourVirtual } from '../../../common/enums/estado-tour-virtual.enum';

export class ActualizarTourVirtualDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urlTour?: string;

  @ApiPropertyOptional({ enum: EstadoTourVirtual })
  @IsOptional()
  @IsEnum(EstadoTourVirtual)
  estado?: EstadoTourVirtual;
}
