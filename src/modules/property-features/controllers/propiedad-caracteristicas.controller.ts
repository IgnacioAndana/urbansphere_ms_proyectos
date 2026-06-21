/**
 * Archivo: propiedad-caracteristicas.controller.ts
 * Ubicación: modules/property-features/controllers
 * Tipo: Controlador REST
 * Endpoints: /api/propiedades/:propiedadId/caracteristicas
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CrearPropiedadCaracteristicaDto } from '../dto/crear-propiedad-caracteristica.dto';
import { ActualizarPropiedadCaracteristicaDto } from '../dto/actualizar-propiedad-caracteristica.dto';
import { RespuestaPropiedadCaracteristicaDto } from '../dto/respuesta-propiedad-caracteristica.dto';
import { PropiedadCaracteristicasServicio } from '../services/propiedad-caracteristicas.service';

@ApiTags('Características de propiedad')
@Controller('propiedades/:propiedadId/caracteristicas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropiedadCaracteristicasControlador {
  constructor(private readonly caracteristicasServicio: PropiedadCaracteristicasServicio) {}

  @Post()
  @ApiOperation({ summary: 'Agregar característica a una propiedad' })
  @ApiResponse({ status: 201, type: RespuestaPropiedadCaracteristicaDto })
  crearCaracteristica(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
    @Body() dto: CrearPropiedadCaracteristicaDto,
  ): Promise<RespuestaPropiedadCaracteristicaDto> {
    return this.caracteristicasServicio.crearCaracteristica(propiedadId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar características de una propiedad' })
  @ApiResponse({ status: 200, type: [RespuestaPropiedadCaracteristicaDto] })
  listarCaracteristicas(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
  ): Promise<RespuestaPropiedadCaracteristicaDto[]> {
    return this.caracteristicasServicio.listarCaracteristicasPorPropiedad(propiedadId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar característica' })
  @ApiResponse({ status: 200, type: RespuestaPropiedadCaracteristicaDto })
  actualizarCaracteristica(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarPropiedadCaracteristicaDto,
  ): Promise<RespuestaPropiedadCaracteristicaDto> {
    return this.caracteristicasServicio.actualizarCaracteristica(propiedadId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar característica' })
  @ApiResponse({ status: 204 })
  async eliminarCaracteristica(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.caracteristicasServicio.eliminarCaracteristica(propiedadId, id);
  }
}
