/**
 * Archivo: tours-virtuales.service.ts
 * Ubicación: modules/virtual-tours/services
 * Tipo: Servicio de negocio
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { EstadoTourVirtual } from '../../../common/enums/estado-tour-virtual.enum';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { PropiedadesRepositorio } from '../../properties/repositories/propiedades.repository';
import { CrearTourVirtualDto } from '../dto/crear-tour-virtual.dto';
import { ActualizarTourVirtualDto } from '../dto/actualizar-tour-virtual.dto';
import { RespuestaTourVirtualDto } from '../dto/respuesta-tour-virtual.dto';
import { TourVirtualEntidad } from '../entities/tour-virtual.entity';
import { ToursVirtualesRepositorio } from '../repositories/tours-virtuales.repository';

@Injectable()
export class ToursVirtualesServicio {
  constructor(
    private readonly toursRepositorio: ToursVirtualesRepositorio,
    private readonly propiedadesRepositorio: PropiedadesRepositorio,
  ) {}

  async crearTour(
    propiedadId: number,
    dto: CrearTourVirtualDto,
  ): Promise<RespuestaTourVirtualDto> {
    await this.validarPropiedadExiste(propiedadId);

    const tour = await this.toursRepositorio.crearTour({
      propiedadId,
      urlTour: dto.urlTour ?? null,
      estado: dto.estado ?? EstadoTourVirtual.PENDIENTE,
    });

    return this.mapearARespuesta(tour);
  }

  async buscarTourPorId(id: number): Promise<RespuestaTourVirtualDto> {
    const tour = await this.toursRepositorio.buscarTourPorId(id);
    if (!tour) {
      throw new ExcepcionNegocio('Tour virtual no encontrado', HttpStatus.NOT_FOUND);
    }
    return this.mapearARespuesta(tour);
  }

  async listarToursPorPropiedad(propiedadId: number): Promise<RespuestaTourVirtualDto[]> {
    await this.validarPropiedadExiste(propiedadId);
    const tours = await this.toursRepositorio.listarToursPorPropiedad(propiedadId);
    return tours.map((t) => this.mapearARespuesta(t));
  }

  async actualizarTour(id: number, dto: ActualizarTourVirtualDto): Promise<RespuestaTourVirtualDto> {
    const tour = await this.toursRepositorio.buscarTourPorId(id);
    if (!tour) {
      throw new ExcepcionNegocio('Tour virtual no encontrado', HttpStatus.NOT_FOUND);
    }

    const datos: Partial<TourVirtualEntidad> = {};
    if (dto.urlTour !== undefined) datos.urlTour = dto.urlTour;
    if (dto.estado !== undefined) datos.estado = dto.estado;

    const actualizado = await this.toursRepositorio.actualizarTour(id, datos);
    if (!actualizado) {
      throw new ExcepcionNegocio('Tour virtual no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizado);
  }

  async eliminarTour(id: number): Promise<void> {
    const tour = await this.toursRepositorio.buscarTourPorId(id);
    if (!tour) {
      throw new ExcepcionNegocio('Tour virtual no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.toursRepositorio.eliminarTour(id);
  }

  private async validarPropiedadExiste(propiedadId: number): Promise<void> {
    const propiedad = await this.propiedadesRepositorio.buscarPropiedadPorId(propiedadId);
    if (!propiedad) {
      throw new ExcepcionNegocio('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }
  }

  mapearARespuesta(tour: TourVirtualEntidad): RespuestaTourVirtualDto {
    return {
      id: tour.id,
      propiedadId: tour.propiedadId,
      urlTour: tour.urlTour,
      estado: tour.estado,
      creadoEn: tour.creadoEn,
    };
  }
}
