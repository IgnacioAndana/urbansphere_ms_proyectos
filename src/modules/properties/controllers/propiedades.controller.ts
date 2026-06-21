/**
 * Archivo: propiedades.controller.ts
 * Ubicación: modules/properties/controllers
 * Tipo: Controlador REST
 * Endpoints: CRUD /api/propiedades
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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CrearPropiedadDto } from '../dto/crear-propiedad.dto';
import { ActualizarPropiedadDto } from '../dto/actualizar-propiedad.dto';
import { RespuestaPropiedadDto } from '../dto/respuesta-propiedad.dto';
import { PropiedadesServicio } from '../services/propiedades.service';

@ApiTags('Propiedades')
@Controller('propiedades')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropiedadesControlador {
  constructor(private readonly propiedadesServicio: PropiedadesServicio) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva propiedad' })
  @ApiResponse({ status: 201, type: RespuestaPropiedadDto })
  crearPropiedad(@Body() dto: CrearPropiedadDto): Promise<RespuestaPropiedadDto> {
    return this.propiedadesServicio.crearPropiedad(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar propiedades (opcionalmente filtrar por proyectoId)' })
  @ApiResponse({ status: 200, type: [RespuestaPropiedadDto] })
  listarPropiedades(
    @Query('proyectoId') proyectoId?: string,
  ): Promise<RespuestaPropiedadDto[]> {
    if (proyectoId) {
      return this.propiedadesServicio.listarPropiedadesPorProyecto(parseInt(proyectoId, 10));
    }
    return this.propiedadesServicio.listarPropiedades();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener propiedad por ID' })
  @ApiResponse({ status: 200, type: RespuestaPropiedadDto })
  buscarPropiedadPorId(@Param('id', ParseIntPipe) id: number): Promise<RespuestaPropiedadDto> {
    return this.propiedadesServicio.buscarPropiedadPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar propiedad' })
  @ApiResponse({ status: 200, type: RespuestaPropiedadDto })
  actualizarPropiedad(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarPropiedadDto,
  ): Promise<RespuestaPropiedadDto> {
    return this.propiedadesServicio.actualizarPropiedad(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar propiedad' })
  @ApiResponse({ status: 204 })
  async eliminarPropiedad(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.propiedadesServicio.eliminarPropiedad(id);
  }
}
