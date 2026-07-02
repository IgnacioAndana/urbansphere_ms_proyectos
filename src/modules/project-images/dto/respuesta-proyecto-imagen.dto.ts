/**
 * Archivo: respuesta-proyecto-imagen.dto.ts
 * Ubicación: modules/project-images/dto
 * Tipo: DTO de salida
 */

import { ApiProperty } from '@nestjs/swagger';

export class RespuestaProyectoImagenDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  proyectoId: number;

  @ApiProperty({
    example: 'https://urbansphere-images.s3.us-east-1.amazonaws.com/proyectos/1/galeria/img.jpg',
  })
  urlS3: string;

  @ApiProperty({ example: 'fachada', nullable: true })
  etiqueta: string | null;

  @ApiProperty({ example: true })
  esPortada: boolean;

  @ApiProperty({ example: false })
  esPanoramica360: boolean;

  @ApiProperty({ example: 0 })
  orden: number;

  @ApiProperty({ example: '20-06-2025 14:30:45' })
  creadoEn: Date;
}
