import { ApiProperty } from '@nestjs/swagger';

export class RespuestaProyectoEquipamientoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  proyectoId: number;

  @ApiProperty({ example: true })
  gimnasio: boolean;

  @ApiProperty({ example: true })
  quincho: boolean;

  @ApiProperty({ example: true })
  areasVerdes: boolean;

  @ApiProperty({ example: false })
  bicicletero: boolean;

  @ApiProperty({ example: true })
  piscina: boolean;

  @ApiProperty({ example: false })
  juegosInfantiles: boolean;

  @ApiProperty({ example: false })
  gourmetLounge: boolean;

  @ApiProperty({ example: true })
  coworkingRoom: boolean;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;
}
