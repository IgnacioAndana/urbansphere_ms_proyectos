import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoProyecto } from '../../../common/enums/tipo-proyecto.enum';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

export class ProyectoCatalogoItemDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'Edificio Vista Parque' })
  titulo: string;

  @ApiProperty({ enum: TipoProyecto, example: TipoProyecto.DEPARTAMENTO })
  tipo: TipoProyecto;

  @ApiProperty({ example: 'Providencia' })
  comuna: string;

  @ApiProperty({ example: 'Av. Providencia 1234' })
  direccion: string;

  @ApiPropertyOptional({ example: -33.4489, nullable: true })
  latitud: number | null;

  @ApiPropertyOptional({ example: -70.6693, nullable: true })
  longitud: number | null;

  @ApiPropertyOptional({ nullable: true })
  descripcion: string | null;

  @ApiPropertyOptional({ example: '2027-06-30', nullable: true })
  fechaEntregaEstimada: string | null;

  @ApiProperty({ enum: EstadoProyecto, example: EstadoProyecto.ACTIVO })
  estado: EstadoProyecto;

  @ApiPropertyOptional({ nullable: true })
  urlPortada: string | null;

  @ApiPropertyOptional({ example: 3200, nullable: true })
  precioDesdeUf: number | null;

  @ApiPropertyOptional({ example: 2, nullable: true })
  dormitoriosMin: number | null;

  @ApiPropertyOptional({ example: 3, nullable: true })
  dormitoriosMax: number | null;

  @ApiPropertyOptional({ example: 2, nullable: true })
  banosMin: number | null;

  @ApiPropertyOptional({ example: 2, nullable: true })
  banosMax: number | null;

  @ApiPropertyOptional({ example: 64, nullable: true })
  superficieMin: number | null;

  @ApiPropertyOptional({ example: 85, nullable: true })
  superficieMax: number | null;
}
