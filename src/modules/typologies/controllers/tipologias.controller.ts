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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../../common/constants/app.constants';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CrearTipologiaDto } from '../dto/crear-tipologia.dto';
import { ActualizarTipologiaDto } from '../dto/actualizar-tipologia.dto';
import { RespuestaTipologiaDto } from '../dto/respuesta-tipologia.dto';
import { TipologiasServicio } from '../services/tipologias.service';

@ApiTags('Tipologías')
@Controller('proyectos/:proyectoId/tipologias')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TipologiasControlador {
  constructor(private readonly tipologiasServicio: TipologiasServicio) {}

  @Post()
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Crear tipología (admin, agent)' })
  @ApiResponse({ status: 201, type: RespuestaTipologiaDto })
  crearTipologia(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Body() dto: CrearTipologiaDto,
  ): Promise<RespuestaTipologiaDto> {
    return this.tipologiasServicio.crearTipologia(proyectoId, dto);
  }

  @Get()
  @Roles(ROLES.ADMIN, ROLES.AGENT, ROLES.USER)
  @ApiOperation({ summary: 'Listar tipologías de un proyecto' })
  @ApiResponse({ status: 200, type: [RespuestaTipologiaDto] })
  listarTipologias(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
  ): Promise<RespuestaTipologiaDto[]> {
    return this.tipologiasServicio.listarPorProyecto(proyectoId);
  }

  @Get(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT, ROLES.USER)
  @ApiOperation({ summary: 'Obtener tipología por ID' })
  @ApiResponse({ status: 200, type: RespuestaTipologiaDto })
  buscarTipologia(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RespuestaTipologiaDto> {
    return this.tipologiasServicio.buscarPorId(proyectoId, id);
  }

  @Patch(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Actualizar tipología (admin, agent)' })
  @ApiResponse({ status: 200, type: RespuestaTipologiaDto })
  actualizarTipologia(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarTipologiaDto,
  ): Promise<RespuestaTipologiaDto> {
    return this.tipologiasServicio.actualizarTipologia(proyectoId, id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Eliminar tipología (admin, agent)' })
  @ApiResponse({ status: 204 })
  async eliminarTipologia(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.tipologiasServicio.eliminarTipologia(proyectoId, id);
  }
}
