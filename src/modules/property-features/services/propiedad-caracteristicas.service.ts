/**
 * Archivo: propiedad-caracteristicas.service.ts
 * Ubicación: modules/property-features/services
 * Tipo: Servicio de negocio
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { PropiedadesRepositorio } from '../../properties/repositories/propiedades.repository';
import { CrearPropiedadCaracteristicaDto } from '../dto/crear-propiedad-caracteristica.dto';
import { ActualizarPropiedadCaracteristicaDto } from '../dto/actualizar-propiedad-caracteristica.dto';
import { RespuestaPropiedadCaracteristicaDto } from '../dto/respuesta-propiedad-caracteristica.dto';
import { PropiedadCaracteristicaEntidad } from '../entities/propiedad-caracteristica.entity';
import { PropiedadCaracteristicasRepositorio } from '../repositories/propiedad-caracteristicas.repository';

@Injectable()
export class PropiedadCaracteristicasServicio {
  constructor(
    private readonly caracteristicasRepositorio: PropiedadCaracteristicasRepositorio,
    private readonly propiedadesRepositorio: PropiedadesRepositorio,
  ) {}

  async crearCaracteristica(
    propiedadId: number,
    dto: CrearPropiedadCaracteristicaDto,
  ): Promise<RespuestaPropiedadCaracteristicaDto> {
    await this.validarPropiedadExiste(propiedadId);

    const caracteristica = await this.caracteristicasRepositorio.crearCaracteristica({
      propiedadId,
      nombreCaracteristica: dto.nombreCaracteristica,
      valorCaracteristica: dto.valorCaracteristica,
    });

    return this.mapearARespuesta(caracteristica);
  }

  async listarCaracteristicasPorPropiedad(
    propiedadId: number,
  ): Promise<RespuestaPropiedadCaracteristicaDto[]> {
    await this.validarPropiedadExiste(propiedadId);
    const caracteristicas =
      await this.caracteristicasRepositorio.listarCaracteristicasPorPropiedad(propiedadId);
    return caracteristicas.map((c) => this.mapearARespuesta(c));
  }

  async actualizarCaracteristica(
    propiedadId: number,
    id: number,
    dto: ActualizarPropiedadCaracteristicaDto,
  ): Promise<RespuestaPropiedadCaracteristicaDto> {
    const caracteristica = await this.obtenerCaracteristicaDePropiedad(propiedadId, id);

    const datos: Partial<PropiedadCaracteristicaEntidad> = {};
    if (dto.nombreCaracteristica !== undefined) {
      datos.nombreCaracteristica = dto.nombreCaracteristica;
    }
    if (dto.valorCaracteristica !== undefined) {
      datos.valorCaracteristica = dto.valorCaracteristica;
    }

    const actualizada = await this.caracteristicasRepositorio.actualizarCaracteristica(
      caracteristica.id,
      datos,
    );
    if (!actualizada) {
      throw new ExcepcionNegocio('Característica no encontrada', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizada);
  }

  async eliminarCaracteristica(propiedadId: number, id: number): Promise<void> {
    const caracteristica = await this.obtenerCaracteristicaDePropiedad(propiedadId, id);
    await this.caracteristicasRepositorio.eliminarCaracteristica(caracteristica.id);
  }

  private async validarPropiedadExiste(propiedadId: number): Promise<void> {
    const propiedad = await this.propiedadesRepositorio.buscarPropiedadPorId(propiedadId);
    if (!propiedad) {
      throw new ExcepcionNegocio('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }
  }

  private async obtenerCaracteristicaDePropiedad(
    propiedadId: number,
    id: number,
  ): Promise<PropiedadCaracteristicaEntidad> {
    const caracteristica = await this.caracteristicasRepositorio.buscarCaracteristicaPorId(id);
    if (!caracteristica || caracteristica.propiedadId !== propiedadId) {
      throw new ExcepcionNegocio('Característica no encontrada', HttpStatus.NOT_FOUND);
    }
    return caracteristica;
  }

  mapearARespuesta(
    caracteristica: PropiedadCaracteristicaEntidad,
  ): RespuestaPropiedadCaracteristicaDto {
    return {
      id: caracteristica.id,
      propiedadId: caracteristica.propiedadId,
      nombreCaracteristica: caracteristica.nombreCaracteristica,
      valorCaracteristica: caracteristica.valorCaracteristica,
    };
  }
}
