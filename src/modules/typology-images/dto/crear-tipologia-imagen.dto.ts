import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { aBooleano, aEntero } from '../../../common/utils/transformar-multipart.util';

export class CrearTipologiaImagenDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urlS3?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  esPortada?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  esPanoramica360?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Transform(aEntero)
  @IsInt()
  @Min(0)
  orden?: number;
}
