import { ApiProperty } from '@nestjs/swagger';
import { ProyectoCatalogoItemDto } from './proyecto-catalogo-item.dto';

export type MotivoOmitidoCatalogo = 'no_encontrado' | 'inactivo';

export class OmitidoCatalogoDto {
  @ApiProperty({ example: 99 })
  id: number;

  @ApiProperty({ enum: ['no_encontrado', 'inactivo'], example: 'no_encontrado' })
  motivo: MotivoOmitidoCatalogo;
}

export class ConsultarCatalogoResponseDto {
  @ApiProperty({ type: [ProyectoCatalogoItemDto] })
  items: ProyectoCatalogoItemDto[];

  @ApiProperty({ type: [OmitidoCatalogoDto] })
  omitidos: OmitidoCatalogoDto[];
}
