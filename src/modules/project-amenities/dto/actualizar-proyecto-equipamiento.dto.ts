import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsBoolean, IsOptional } from 'class-validator';

/** Acepta true/false, 0/1 o "0"/"1" desde el front. */
function aBooleano({ value }: { value: unknown }): unknown {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return value;
}

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
