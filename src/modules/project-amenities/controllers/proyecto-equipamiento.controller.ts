import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../../common/constants/app.constants';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ActualizarProyectoEquipamientoDto } from '../dto/actualizar-proyecto-equipamiento.dto';
import { RespuestaProyectoEquipamientoDto } from '../dto/respuesta-proyecto-equipamiento.dto';
import { ProyectoEquipamientoServicio } from '../services/proyecto-equipamiento.service';

@ApiTags('Equipamiento de proyecto')
@Controller('proyectos/:proyectoId/equipamiento')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProyectoEquipamientoControlador {
  constructor(private readonly equipamientoServicio: ProyectoEquipamientoServicio) {}

  @Get()
  @Public()
  @Roles(ROLES.ADMIN, ROLES.AGENT, ROLES.USER)
  @ApiOperation({ summary: 'Obtener equipamiento del proyecto (público)' })
  @ApiResponse({ status: 200, type: RespuestaProyectoEquipamientoDto })
  obtenerEquipamiento(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
  ): Promise<RespuestaProyectoEquipamientoDto> {
    return this.equipamientoServicio.obtenerEquipamiento(proyectoId);
  }

  @Put()
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Actualizar equipamiento del proyecto (admin, agent)' })
  @ApiResponse({ status: 200, type: RespuestaProyectoEquipamientoDto })
  actualizarEquipamiento(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Body() dto: ActualizarProyectoEquipamientoDto,
  ): Promise<RespuestaProyectoEquipamientoDto> {
    return this.equipamientoServicio.actualizarEquipamiento(proyectoId, dto);
  }
}
