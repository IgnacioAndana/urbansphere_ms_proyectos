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
import { ROLES } from '../../../common/constants/app.constants';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { UsuarioActual } from '../../../common/decorators/usuario-actual.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CargaJwt } from '../../auth/interfaces/carga-jwt.interface';
import { CrearProyectoDto } from '../dto/crear-proyecto.dto';
import { ActualizarProyectoDto } from '../dto/actualizar-proyecto.dto';
import { ConsultarCatalogoDto } from '../dto/consultar-catalogo.dto';
import { ConsultarCatalogoResponseDto } from '../dto/consultar-catalogo-response.dto';
import { RespuestaProyectoDto } from '../dto/respuesta-proyecto.dto';
import { ProyectosServicio } from '../services/proyectos.service';

@ApiTags('Proyectos')
@Controller('proyectos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProyectosControlador {
  constructor(private readonly proyectosServicio: ProyectosServicio) {}

  @Post()
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Crear proyecto inmobiliario (admin, agent)' })
  @ApiResponse({ status: 201, type: RespuestaProyectoDto })
  crearProyecto(@Body() dto: CrearProyectoDto): Promise<RespuestaProyectoDto> {
    return this.proyectosServicio.crearProyecto(dto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary:
      'Listar proyectos (público: solo activos; con JWT admin/agent: todos)',
  })
  @ApiResponse({ status: 200, type: [RespuestaProyectoDto] })
  listarProyectos(
    @UsuarioActual() usuario?: CargaJwt,
  ): Promise<RespuestaProyectoDto[]> {
    const rol = usuario?.rol ?? ROLES.USER;
    return this.proyectosServicio.listarProyectos(rol);
  }

  @Post('catalogo')
  @Public()
  @ApiOperation({
    summary:
      'Catálogo batch por IDs (público: solo activos; con JWT admin/agent: todos los estados)',
  })
  @ApiResponse({ status: 200, type: ConsultarCatalogoResponseDto })
  consultarCatalogo(
    @Body() dto: ConsultarCatalogoDto,
    @UsuarioActual() usuario?: CargaJwt,
  ): Promise<ConsultarCatalogoResponseDto> {
    const rol = usuario?.rol ?? ROLES.USER;
    return this.proyectosServicio.consultarCatalogo(dto.ids, rol);
  }

  @Get(':id')
  @Public()
  @Roles(ROLES.ADMIN, ROLES.AGENT, ROLES.USER)
  @ApiOperation({
    summary:
      'Obtener proyecto por ID (público: solo activos; con JWT admin/agent: todos)',
  })
  @ApiResponse({ status: 200, type: RespuestaProyectoDto })
  buscarProyectoPorId(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario?: CargaJwt,
  ): Promise<RespuestaProyectoDto> {
    const rol = usuario?.rol ?? ROLES.USER;
    return this.proyectosServicio.buscarProyectoPorId(id, rol);
  }

  @Patch(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Actualizar proyecto (admin, agent)' })
  @ApiResponse({ status: 200, type: RespuestaProyectoDto })
  actualizarProyecto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarProyectoDto,
  ): Promise<RespuestaProyectoDto> {
    return this.proyectosServicio.actualizarProyecto(id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Eliminar proyecto (admin, agent)' })
  @ApiResponse({ status: 204 })
  async eliminarProyecto(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.proyectosServicio.eliminarProyecto(id);
  }
}
