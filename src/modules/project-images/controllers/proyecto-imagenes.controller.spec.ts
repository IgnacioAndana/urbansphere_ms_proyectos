import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoImagenesControlador } from './proyecto-imagenes.controller';
import { ProyectoImagenesServicio } from '../services/proyecto-imagenes.service';

describe('ProyectoImagenesControlador', () => {
  let controlador: ProyectoImagenesControlador;
  let servicio: jest.Mocked<ProyectoImagenesServicio>;

  const imagenMock = {
    id: 1,
    proyectoId: 1,
    urlS3: 'https://s3/img.jpg',
    etiqueta: null,
    esPortada: false,
    orden: 0,
    creadoEn: new Date(),
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      controllers: [ProyectoImagenesControlador],
      providers: [
        {
          provide: ProyectoImagenesServicio,
          useValue: {
            crearImagen: jest.fn(),
            listarImagenesPorProyecto: jest.fn(),
            actualizarImagen: jest.fn(),
            eliminarImagen: jest.fn(),
          },
        },
      ],
    }).compile();

    controlador = modulo.get(ProyectoImagenesControlador);
    servicio = modulo.get(ProyectoImagenesServicio);
  });

  it('debe crear imagen con archivo', async () => {
    servicio.crearImagen.mockResolvedValue(imagenMock);
    const archivo = { buffer: Buffer.from('x') } as Express.Multer.File;
    const resultado = await controlador.crearImagen(1, { etiqueta: 'galeria' }, archivo);
    expect(servicio.crearImagen).toHaveBeenCalledWith(1, { etiqueta: 'galeria' }, archivo);
    expect(resultado.urlS3).toContain('s3');
  });

  it('debe listar imágenes', async () => {
    servicio.listarImagenesPorProyecto.mockResolvedValue([imagenMock]);
    expect(await controlador.listarImagenes(1)).toHaveLength(1);
  });

  it('debe eliminar imagen', async () => {
    servicio.eliminarImagen.mockResolvedValue(undefined);
    await controlador.eliminarImagen(1, 1);
    expect(servicio.eliminarImagen).toHaveBeenCalledWith(1, 1);
  });
});
