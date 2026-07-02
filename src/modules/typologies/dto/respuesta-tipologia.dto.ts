import { ApiProperty } from '@nestjs/swagger';

export class RespuestaTipologiaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  proyectoId: number;

  @ApiProperty({ example: '2D2B-64' })
  codigoTipologia: string;

  @ApiProperty({ example: 2 })
  dormitorios: number;

  @ApiProperty({ example: 2 })
  banos: number;

  @ApiProperty({ example: 64.5 })
  superficieM2: number;

  @ApiProperty({ example: 3200 })
  valorEnUf: number;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;
}
