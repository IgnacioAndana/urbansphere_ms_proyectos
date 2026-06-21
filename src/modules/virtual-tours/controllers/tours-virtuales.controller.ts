/**
 * Archivo: tours-virtuales.controller.ts
 * Ubicación: modules/virtual-tours/controllers
 * Tipo: Controlador REST
 * Endpoints: /api/propiedades/:propiedadId/tours-virtuales y /api/tours-virtuales/:id
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
import { CrearTourVirtualDto } from '../dto/crear-tour-virtual.dto';
import { ActualizarTourVirtualDto } from '../dto/actualizar-tour-virtual.dto';
import { RespuestaTourVirtualDto } from '../dto/respuesta-tour-virtual.dto';
import { ToursVirtualesServicio } from '../services/tours-virtuales.service';

@ApiTags('Tours virtuales')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ToursVirtualesControlador {
  constructor(private readonly toursServicio: ToursVirtualesServicio) {}

  @Post('propiedades/:propiedadId/tours-virtuales')
  @ApiOperation({ summary: 'Crear tour virtual para una propiedad' })
  @ApiResponse({ status: 201, type: RespuestaTourVirtualDto })
  crearTour(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
    @Body() dto: CrearTourVirtualDto,
  ): Promise<RespuestaTourVirtualDto> {
    return this.toursServicio.crearTour(propiedadId, dto);
  }

  @Get('propiedades/:propiedadId/tours-virtuales')
  @ApiOperation({ summary: 'Listar tours virtuales de una propiedad' })
  @ApiResponse({ status: 200, type: [RespuestaTourVirtualDto] })
  listarToursPorPropiedad(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
  ): Promise<RespuestaTourVirtualDto[]> {
    return this.toursServicio.listarToursPorPropiedad(propiedadId);
  }

  @Get('tours-virtuales/:id')
  @ApiOperation({ summary: 'Obtener tour virtual por ID' })
  @ApiResponse({ status: 200, type: RespuestaTourVirtualDto })
  buscarTourPorId(@Param('id', ParseIntPipe) id: number): Promise<RespuestaTourVirtualDto> {
    return this.toursServicio.buscarTourPorId(id);
  }

  @Patch('tours-virtuales/:id')
  @ApiOperation({ summary: 'Actualizar tour virtual' })
  @ApiResponse({ status: 200, type: RespuestaTourVirtualDto })
  actualizarTour(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarTourVirtualDto,
  ): Promise<RespuestaTourVirtualDto> {
    return this.toursServicio.actualizarTour(id, dto);
  }

  @Delete('tours-virtuales/:id')
  @ApiOperation({ summary: 'Eliminar tour virtual' })
  @ApiResponse({ status: 204 })
  async eliminarTour(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.toursServicio.eliminarTour(id);
  }
}
