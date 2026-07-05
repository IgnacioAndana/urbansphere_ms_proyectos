/**
 * Archivo: proyecto-imagenes.controller.ts
 * Ubicación: modules/project-images/controllers
 * Tipo: Controlador REST
 * Endpoints: /proyectos/:proyectoId/imagenes
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ROLES } from '../../../common/constants/app.constants';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CrearProyectoImagenDto } from '../dto/crear-proyecto-imagen.dto';
import { ActualizarProyectoImagenDto } from '../dto/actualizar-proyecto-imagen.dto';
import { RespuestaProyectoImagenDto } from '../dto/respuesta-proyecto-imagen.dto';
import { ProyectoImagenesServicio } from '../services/proyecto-imagenes.service';

@ApiTags('Imágenes de proyecto')
@Controller('proyectos/:proyectoId/imagenes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProyectoImagenesControlador {
  constructor(private readonly imagenesServicio: ProyectoImagenesServicio) {}

  @Post()
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @UseInterceptors(FileInterceptor('archivo'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Agregar imagen al proyecto (URL o archivo S3)' })
  @ApiResponse({ status: 201, type: RespuestaProyectoImagenDto })
  crearImagen(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Body() dto: CrearProyectoImagenDto,
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<RespuestaProyectoImagenDto> {
    return this.imagenesServicio.crearImagen(proyectoId, dto, archivo);
  }

  @Get()
  @Public()
  @Roles(ROLES.ADMIN, ROLES.AGENT, ROLES.USER)
  @ApiOperation({ summary: 'Listar imágenes de un proyecto (público)' })
  @ApiResponse({ status: 200, type: [RespuestaProyectoImagenDto] })
  listarImagenes(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
  ): Promise<RespuestaProyectoImagenDto[]> {
    return this.imagenesServicio.listarImagenesPorProyecto(proyectoId);
  }

  @Patch(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @UseInterceptors(FileInterceptor('archivo'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Actualizar imagen de proyecto (metadatos o reemplazar archivo)' })
  @ApiResponse({ status: 200, type: RespuestaProyectoImagenDto })
  actualizarImagen(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarProyectoImagenDto,
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<RespuestaProyectoImagenDto> {
    return this.imagenesServicio.actualizarImagen(proyectoId, id, dto, archivo);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Eliminar imagen de proyecto' })
  @ApiResponse({ status: 204 })
  async eliminarImagen(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.imagenesServicio.eliminarImagen(proyectoId, id);
  }
}
