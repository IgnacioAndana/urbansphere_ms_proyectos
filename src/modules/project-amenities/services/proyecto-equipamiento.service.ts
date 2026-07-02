import { HttpStatus, Injectable } from '@nestjs/common';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { ProyectosRepositorio } from '../../projects/repositories/proyectos.repository';
import { ActualizarProyectoEquipamientoDto } from '../dto/actualizar-proyecto-equipamiento.dto';
import { RespuestaProyectoEquipamientoDto } from '../dto/respuesta-proyecto-equipamiento.dto';
import { ProyectoEquipamientoEntidad } from '../entities/proyecto-equipamiento.entity';
import { ProyectoEquipamientoRepositorio } from '../repositories/proyecto-equipamiento.repository';

@Injectable()
export class ProyectoEquipamientoServicio {
  constructor(
    private readonly equipamientoRepositorio: ProyectoEquipamientoRepositorio,
    private readonly proyectosRepositorio: ProyectosRepositorio,
  ) {}

  async obtenerEquipamiento(proyectoId: number): Promise<RespuestaProyectoEquipamientoDto> {
    await this.validarProyectoExiste(proyectoId);
    const equipamiento = await this.equipamientoRepositorio.buscarPorProyecto(proyectoId);

    if (!equipamiento) {
      return this.crearEquipamientoVacio(proyectoId);
    }

    return this.mapearARespuesta(equipamiento);
  }

  async actualizarEquipamiento(
    proyectoId: number,
    dto: ActualizarProyectoEquipamientoDto,
  ): Promise<RespuestaProyectoEquipamientoDto> {
    await this.validarProyectoExiste(proyectoId);

    let equipamiento = await this.equipamientoRepositorio.buscarPorProyecto(proyectoId);

    if (!equipamiento) {
      equipamiento = await this.equipamientoRepositorio.crearEquipamiento({
        proyectoId,
        ...this.valoresPorDefecto(),
        ...dto,
      });
      return this.mapearARespuesta(equipamiento);
    }

    const datos: Partial<ProyectoEquipamientoEntidad> = {};
    if (dto.gimnasio !== undefined) datos.gimnasio = dto.gimnasio;
    if (dto.quincho !== undefined) datos.quincho = dto.quincho;
    if (dto.areasVerdes !== undefined) datos.areasVerdes = dto.areasVerdes;
    if (dto.bicicletero !== undefined) datos.bicicletero = dto.bicicletero;
    if (dto.piscina !== undefined) datos.piscina = dto.piscina;
    if (dto.juegosInfantiles !== undefined) datos.juegosInfantiles = dto.juegosInfantiles;
    if (dto.gourmetLounge !== undefined) datos.gourmetLounge = dto.gourmetLounge;
    if (dto.coworkingRoom !== undefined) datos.coworkingRoom = dto.coworkingRoom;

    const actualizado = await this.equipamientoRepositorio.actualizarEquipamiento(
      equipamiento.id,
      datos,
    );

    if (!actualizado) {
      throw new ExcepcionNegocio('Equipamiento no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizado);
  }

  private async crearEquipamientoVacio(
    proyectoId: number,
  ): Promise<RespuestaProyectoEquipamientoDto> {
    return {
      id: 0,
      proyectoId,
      ...this.valoresPorDefecto(),
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    };
  }

  private valoresPorDefecto() {
    return {
      gimnasio: false,
      quincho: false,
      areasVerdes: false,
      bicicletero: false,
      piscina: false,
      juegosInfantiles: false,
      gourmetLounge: false,
      coworkingRoom: false,
    };
  }

  private async validarProyectoExiste(proyectoId: number): Promise<void> {
    const proyecto = await this.proyectosRepositorio.buscarProyectoPorId(proyectoId);
    if (!proyecto) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }
  }

  mapearARespuesta(equipamiento: ProyectoEquipamientoEntidad): RespuestaProyectoEquipamientoDto {
    return {
      id: equipamiento.id,
      proyectoId: equipamiento.proyectoId,
      gimnasio: equipamiento.gimnasio,
      quincho: equipamiento.quincho,
      areasVerdes: equipamiento.areasVerdes,
      bicicletero: equipamiento.bicicletero,
      piscina: equipamiento.piscina,
      juegosInfantiles: equipamiento.juegosInfantiles,
      gourmetLounge: equipamiento.gourmetLounge,
      coworkingRoom: equipamiento.coworkingRoom,
      creadoEn: equipamiento.creadoEn,
      actualizadoEn: equipamiento.actualizadoEn,
    };
  }
}
