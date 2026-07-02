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
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROLES } from '../../../common/constants/app.constants';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CrearTipologiaImagenDto } from '../dto/crear-tipologia-imagen.dto';
import { ActualizarTipologiaImagenDto } from '../dto/actualizar-tipologia-imagen.dto';
import { RespuestaTipologiaImagenDto } from '../dto/respuesta-tipologia-imagen.dto';
import { TipologiaImagenesServicio } from '../services/tipologia-imagenes.service';

@ApiTags('Imágenes de tipología')
@Controller('proyectos/:proyectoId/tipologias/:tipologiaId/imagenes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TipologiaImagenesControlador {
  constructor(private readonly imagenesServicio: TipologiaImagenesServicio) {}

  @Post()
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @UseInterceptors(FileInterceptor('archivo'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Agregar imagen a tipología (URL o archivo S3)' })
  @ApiResponse({ status: 201, type: RespuestaTipologiaImagenDto })
  crearImagen(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('tipologiaId', ParseIntPipe) tipologiaId: number,
    @Body() dto: CrearTipologiaImagenDto,
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<RespuestaTipologiaImagenDto> {
    return this.imagenesServicio.crearImagen(proyectoId, tipologiaId, dto, archivo);
  }

  @Get()
  @Roles(ROLES.ADMIN, ROLES.AGENT, ROLES.USER)
  @ApiOperation({ summary: 'Listar imágenes de una tipología' })
  @ApiResponse({ status: 200, type: [RespuestaTipologiaImagenDto] })
  listarImagenes(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('tipologiaId', ParseIntPipe) tipologiaId: number,
  ): Promise<RespuestaTipologiaImagenDto[]> {
    return this.imagenesServicio.listarImagenes(proyectoId, tipologiaId);
  }

  @Patch(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @UseInterceptors(FileInterceptor('archivo'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Actualizar imagen de tipología (metadatos o reemplazar archivo)' })
  @ApiResponse({ status: 200, type: RespuestaTipologiaImagenDto })
  actualizarImagen(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('tipologiaId', ParseIntPipe) tipologiaId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarTipologiaImagenDto,
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<RespuestaTipologiaImagenDto> {
    return this.imagenesServicio.actualizarImagen(proyectoId, tipologiaId, id, dto, archivo);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN, ROLES.AGENT)
  @ApiOperation({ summary: 'Eliminar imagen de tipología' })
  @ApiResponse({ status: 204 })
  async eliminarImagen(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('tipologiaId', ParseIntPipe) tipologiaId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.imagenesServicio.eliminarImagen(proyectoId, tipologiaId, id);
  }
}
