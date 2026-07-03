import { HttpStatus, Injectable } from '@nestjs/common';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { ProyectosRepositorio } from '../../projects/repositories/proyectos.repository';
import { CrearTipologiaDto } from '../dto/crear-tipologia.dto';
import { ActualizarTipologiaDto } from '../dto/actualizar-tipologia.dto';
import { RespuestaTipologiaDto } from '../dto/respuesta-tipologia.dto';
import { TipologiaEntidad } from '../entities/tipologia.entity';
import { TipologiasRepositorio } from '../repositories/tipologias.repository';

@Injectable()
export class TipologiasServicio {
  constructor(
    private readonly tipologiasRepositorio: TipologiasRepositorio,
    private readonly proyectosRepositorio: ProyectosRepositorio,
  ) {}

  async crearTipologia(
    proyectoId: number,
    dto: CrearTipologiaDto,
  ): Promise<RespuestaTipologiaDto> {
    await this.validarProyectoExiste(proyectoId);
    await this.validarCodigoUnico(proyectoId, dto.codigoTipologia);

    const tipologia = await this.tipologiasRepositorio.crearTipologia({
      proyectoId,
      codigoTipologia: dto.codigoTipologia,
      dormitorios: dto.dormitorios,
      banos: dto.banos,
      superficieM2: dto.superficieM2,
      valorEnUf: dto.valorEnUf,
    });

    return this.mapearARespuesta(tipologia);
  }

  async listarPorProyecto(proyectoId: number): Promise<RespuestaTipologiaDto[]> {
    await this.validarProyectoExiste(proyectoId);
    const tipologias = await this.tipologiasRepositorio.listarPorProyecto(proyectoId);
    return tipologias.map((t) => this.mapearARespuesta(t));
  }

  async buscarPorId(proyectoId: number, id: number): Promise<RespuestaTipologiaDto> {
    const tipologia = await this.obtenerTipologiaDeProyecto(proyectoId, id);
    return this.mapearARespuesta(tipologia);
  }

  async actualizarTipologia(
    proyectoId: number,
    id: number,
    dto: ActualizarTipologiaDto,
  ): Promise<RespuestaTipologiaDto> {
    const tipologia = await this.obtenerTipologiaDeProyecto(proyectoId, id);

    if (dto.codigoTipologia && dto.codigoTipologia !== tipologia.codigoTipologia) {
      await this.validarCodigoUnico(proyectoId, dto.codigoTipologia, id);
    }

    const datos: Partial<TipologiaEntidad> = {};
    if (dto.codigoTipologia !== undefined) datos.codigoTipologia = dto.codigoTipologia;
    if (dto.dormitorios !== undefined) datos.dormitorios = dto.dormitorios;
    if (dto.banos !== undefined) datos.banos = dto.banos;
    if (dto.superficieM2 !== undefined) datos.superficieM2 = dto.superficieM2;
    if (dto.valorEnUf !== undefined) datos.valorEnUf = dto.valorEnUf;

    const actualizada = await this.tipologiasRepositorio.actualizarTipologia(id, datos);
    if (!actualizada) {
      throw new ExcepcionNegocio('Tipología no encontrada', HttpStatus.NOT_FOUND);
    }

    return this.mapearARespuesta(actualizada);
  }

  async eliminarTipologia(proyectoId: number, id: number): Promise<void> {
    await this.obtenerTipologiaDeProyecto(proyectoId, id);
    await this.tipologiasRepositorio.eliminarTipologia(id);
  }

  async obtenerTipologiaDeProyecto(
    proyectoId: number,
    id: number,
  ): Promise<TipologiaEntidad> {
    const tipologia = await this.tipologiasRepositorio.buscarPorId(id);
    if (!tipologia || Number(tipologia.proyectoId) !== Number(proyectoId)) {
      throw new ExcepcionNegocio('Tipología no encontrada', HttpStatus.NOT_FOUND);
    }
    return tipologia;
  }

  private async validarProyectoExiste(proyectoId: number): Promise<void> {
    const proyecto = await this.proyectosRepositorio.buscarProyectoPorId(proyectoId);
    if (!proyecto) {
      throw new ExcepcionNegocio('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }
  }

  private async validarCodigoUnico(
    proyectoId: number,
    codigo: string,
    excluirId?: number,
  ): Promise<void> {
    const existente = await this.tipologiasRepositorio.buscarPorProyectoYCodigo(
      proyectoId,
      codigo,
    );
    if (existente && Number(existente.id) !== Number(excluirId)) {
      throw new ExcepcionNegocio('El código de tipología ya existe en este proyecto', HttpStatus.CONFLICT);
    }
  }

  mapearARespuesta(tipologia: TipologiaEntidad): RespuestaTipologiaDto {
    return {
      id: tipologia.id,
      proyectoId: tipologia.proyectoId,
      codigoTipologia: tipologia.codigoTipologia,
      dormitorios: tipologia.dormitorios,
      banos: tipologia.banos,
      superficieM2: Number(tipologia.superficieM2),
      valorEnUf: Number(tipologia.valorEnUf),
      creadoEn: tipologia.creadoEn,
      actualizadoEn: tipologia.actualizadoEn,
    };
  }
}
