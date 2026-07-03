import { ApiProperty } from '@nestjs/swagger';

export class RespuestaTipologiaImagenDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tipologiaId: number;

  @ApiProperty()
  urlS3: string;

  @ApiProperty()
  esPortada: boolean;

  @ApiProperty()
  orden: number;

  @ApiProperty()
  creadoEn: Date;
}
