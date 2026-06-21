/**
 * Archivo: proyectos.controller.ts
 * Ubicación: modules/projects/controllers
 * Tipo: Controlador REST
 * Endpoints: CRUD /api/proyectos
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
import { CrearProyectoDto } from '../dto/crear-proyecto.dto';
import { ActualizarProyectoDto } from '../dto/actualizar-proyecto.dto';
import { RespuestaProyectoDto } from '../dto/respuesta-proyecto.dto';
import { ProyectosServicio } from '../services/proyectos.service';

@ApiTags('Proyectos')
@Controller('proyectos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProyectosControlador {
  constructor(private readonly proyectosServicio: ProyectosServicio) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto inmobiliario' })
  @ApiResponse({ status: 201, type: RespuestaProyectoDto })
  crearProyecto(@Body() dto: CrearProyectoDto): Promise<RespuestaProyectoDto> {
    return this.proyectosServicio.crearProyecto(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los proyectos' })
  @ApiResponse({ status: 200, type: [RespuestaProyectoDto] })
  listarProyectos(): Promise<RespuestaProyectoDto[]> {
    return this.proyectosServicio.listarProyectos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  @ApiResponse({ status: 200, type: RespuestaProyectoDto })
  buscarProyectoPorId(@Param('id', ParseIntPipe) id: number): Promise<RespuestaProyectoDto> {
    return this.proyectosServicio.buscarProyectoPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar proyecto' })
  @ApiResponse({ status: 200, type: RespuestaProyectoDto })
  actualizarProyecto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarProyectoDto,
  ): Promise<RespuestaProyectoDto> {
    return this.proyectosServicio.actualizarProyecto(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar proyecto' })
  @ApiResponse({ status: 204 })
  async eliminarProyecto(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.proyectosServicio.eliminarProyecto(id);
  }
}
