/**
 * Archivo: respuesta-propiedad-imagen.dto.ts
 * Ubicación: modules/property-images/dto
 * Tipo: DTO de salida
 */

import { ApiProperty } from '@nestjs/swagger';

export class RespuestaPropiedadImagenDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  propiedadId: number;

  @ApiProperty({ example: 'https://urbansphere.s3.amazonaws.com/properties/1/img.jpg' })
  urlS3: string;

  @ApiProperty({ example: true })
  esPortada: boolean;

  @ApiProperty({ example: 0 })
  orden: number;

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  creadoEn: Date;
}
