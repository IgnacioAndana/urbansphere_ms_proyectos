import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { aBooleano, aEntero } from '../../../common/utils/transformar-multipart.util';

export class CrearTipologiaImagenDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urlS3?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Si true, esta imagen pasa a ser la portada de la tipología (solo una)',
  })
  @IsOptional()
  @Transform(aBooleano)
  @IsBoolean()
  esPortada?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Transform(aEntero)
  @IsInt()
  @Min(0)
  orden?: number;
}
