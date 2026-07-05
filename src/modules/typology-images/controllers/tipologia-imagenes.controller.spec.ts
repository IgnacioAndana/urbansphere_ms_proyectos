import { Test, TestingModule } from '@nestjs/testing';
import { TipologiaImagenesControlador } from './tipologia-imagenes.controller';
import { TipologiaImagenesServicio } from '../services/tipologia-imagenes.service';

describe('TipologiaImagenesControlador', () => {
  let controlador: TipologiaImagenesControlador;
  let servicio: jest.Mocked<TipologiaImagenesServicio>;

  const imagenMock = {
    id: 1,
    tipologiaId: 2,
    urlS3: 'https://s3/planta.jpg',
    esPortada: true,
    orden: 0,
    creadoEn: new Date(),
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      controllers: [TipologiaImagenesControlador],
      providers: [
        {
          provide: TipologiaImagenesServicio,
          useValue: {
            crearImagen: jest.fn(),
            listarImagenes: jest.fn(),
            actualizarImagen: jest.fn(),
            eliminarImagen: jest.fn(),
          },
        },
      ],
    }).compile();

    controlador = modulo.get(TipologiaImagenesControlador);
    servicio = modulo.get(TipologiaImagenesServicio);
  });

  it('debe crear imagen de tipología', async () => {
    servicio.crearImagen.mockResolvedValue(imagenMock);
    const resultado = await controlador.crearImagen(1, 2, { urlS3: 'https://s3/planta.jpg' });
    expect(resultado.esPortada).toBe(true);
  });

  it('debe listar imágenes', async () => {
    servicio.listarImagenes.mockResolvedValue([imagenMock]);
    expect(await controlador.listarImagenes(1, 2)).toHaveLength(1);
  });

  it('debe eliminar imagen', async () => {
    servicio.eliminarImagen.mockResolvedValue(undefined);
    await controlador.eliminarImagen(1, 2, 1);
    expect(servicio.eliminarImagen).toHaveBeenCalledWith(1, 2, 1);
  });
});
