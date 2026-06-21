/**
 * Archivo: propiedad-imagenes.controller.ts
 * Ubicación: modules/property-images/controllers
 * Tipo: Controlador REST
 * Endpoints: /api/propiedades/:propiedadId/imagenes
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
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CrearPropiedadImagenDto } from '../dto/crear-propiedad-imagen.dto';
import { ActualizarPropiedadImagenDto } from '../dto/actualizar-propiedad-imagen.dto';
import { RespuestaPropiedadImagenDto } from '../dto/respuesta-propiedad-imagen.dto';
import { PropiedadImagenesServicio } from '../services/propiedad-imagenes.service';

@ApiTags('Imágenes de propiedad')
@Controller('propiedades/:propiedadId/imagenes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropiedadImagenesControlador {
  constructor(private readonly imagenesServicio: PropiedadImagenesServicio) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Agregar imagen a una propiedad (URL o archivo S3)' })
  @ApiResponse({ status: 201, type: RespuestaPropiedadImagenDto })
  crearImagen(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
    @Body() dto: CrearPropiedadImagenDto,
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<RespuestaPropiedadImagenDto> {
    return this.imagenesServicio.crearImagen(propiedadId, dto, archivo);
  }

  @Get()
  @ApiOperation({ summary: 'Listar imágenes de una propiedad' })
  @ApiResponse({ status: 200, type: [RespuestaPropiedadImagenDto] })
  listarImagenes(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
  ): Promise<RespuestaPropiedadImagenDto[]> {
    return this.imagenesServicio.listarImagenesPorPropiedad(propiedadId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar imagen de propiedad' })
  @ApiResponse({ status: 200, type: RespuestaPropiedadImagenDto })
  actualizarImagen(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarPropiedadImagenDto,
  ): Promise<RespuestaPropiedadImagenDto> {
    return this.imagenesServicio.actualizarImagen(propiedadId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar imagen de propiedad' })
  @ApiResponse({ status: 204 })
  async eliminarImagen(
    @Param('propiedadId', ParseIntPipe) propiedadId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.imagenesServicio.eliminarImagen(propiedadId, id);
  }
}
