import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CrearTipologiaDto {
  @ApiProperty({ example: '2D2B-64' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigoTipologia: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  dormitorios: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  banos: number;

  @ApiProperty({ example: 64.5 })
  @IsNumber()
  @Min(0)
  superficieM2: number;

  @ApiProperty({ example: 3200, description: 'Valor en UF' })
  @IsNumber()
  @Min(0)
  valorEnUf: number;
}
