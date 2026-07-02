import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsBoolean, IsOptional } from 'class-validator';
import { aBooleano } from '../../../common/utils/transformar-multipart.util';

export class ActualizarProyectoEquipamientoDto {
  /** Campos de la respuesta GET que el front puede reenviar; se ignoran al guardar. */
  @Allow()
  id?: number;

  @Allow()
  proyectoId?: number;

  @Allow()
  creadoEn?: unknown;

  @Allow()
  actualizadoEn?: unknown;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  gimnasio?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  quincho?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  areasVerdes?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  bicicletero?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  piscina?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  juegosInfantiles?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  gourmetLounge?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  coworkingRoom?: boolean;
}
