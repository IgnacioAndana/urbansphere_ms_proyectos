import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsInt, IsPositive } from 'class-validator';

export class ConsultarCatalogoDto {
  @ApiProperty({ example: [12, 34, 99], type: [Number] })
  @IsArray()
  @ArrayMaxSize(100)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Type(() => Number)
  ids: number[];
}
