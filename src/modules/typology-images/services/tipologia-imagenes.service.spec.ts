import { Test, TestingModule } from '@nestjs/testing';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { S3Servicio } from '../../storage/services/s3.service';
import { TipologiasServicio } from '../../typologies/services/tipologias.service';
import { TipologiaImagenesRepositorio } from '../repositories/tipologia-imagenes.repository';
import { TipologiaImagenesServicio } from './tipologia-imagenes.service';

describe('TipologiaImagenesServicio', () => {
  let servicio: TipologiaImagenesServicio;
  let imagenesRepo: jest.Mocked<TipologiaImagenesRepositorio>;
  let tipologiasServicio: jest.Mocked<TipologiasServicio>;
  let s3Servicio: jest.Mocked<S3Servicio>;

  const imagenMock = {
    id: 1,
    tipologiaId: 2,
    urlS3: 'https://example.com/planta.jpg',
    esPortada: true,
    orden: 0,
    creadoEn: new Date(),
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        TipologiaImagenesServicio,
        {
          provide: TipologiaImagenesRepositorio,
          useValue: {
            crearImagen: jest.fn(),
            listarImagenesPorTipologia: jest.fn(),
            buscarImagenPorId: jest.fn(),
            actualizarImagen: jest.fn(),
            eliminarImagen: jest.fn(),
            quitarPortadaDeTipologia: jest.fn(),
          },
        },
        {
          provide: TipologiasServicio,
          useValue: { obtenerTipologiaDeProyecto: jest.fn().mockResolvedValue({ id: 2 }) },
        },
        {
          provide: S3Servicio,
          useValue: { subirImagenTipologia: jest.fn() },
        },
      ],
    }).compile();

    servicio = modulo.get(TipologiaImagenesServicio);
    imagenesRepo = modulo.get(TipologiaImagenesRepositorio);
    tipologiasServicio = modulo.get(TipologiasServicio);
    s3Servicio = modulo.get(S3Servicio);
  });

  it('debe crear imagen de tipología', async () => {
    imagenesRepo.crearImagen.mockResolvedValue(imagenMock as never);

    const resultado = await servicio.crearImagen(1, 2, {
      urlS3: 'https://example.com/planta.jpg',
      esPortada: true,
    });

    expect(resultado.esPortada).toBe(true);
    expect(imagenesRepo.quitarPortadaDeTipologia).toHaveBeenCalledWith(2);
  });

  it('debe listar imágenes de tipología', async () => {
    imagenesRepo.listarImagenesPorTipologia.mockResolvedValue([imagenMock as never]);

    const resultado = await servicio.listarImagenes(1, 2);
    expect(resultado).toHaveLength(1);
    expect(tipologiasServicio.obtenerTipologiaDeProyecto).toHaveBeenCalledWith(1, 2);
  });

  it('debe rechazar imagen de otra tipología', async () => {
    imagenesRepo.buscarImagenPorId.mockResolvedValue({
      ...imagenMock,
      tipologiaId: '99' as unknown as number,
    } as never);

    await expect(servicio.eliminarImagen(1, 2, 1)).rejects.toThrow(ExcepcionNegocio);
  });

  it('debe actualizar imagen con nuevo archivo S3', async () => {
    imagenesRepo.buscarImagenPorId.mockResolvedValue(imagenMock as never);
    s3Servicio.subirImagenTipologia.mockResolvedValue('https://s3/nueva.jpg');
    imagenesRepo.actualizarImagen.mockResolvedValue({
      ...imagenMock,
      urlS3: 'https://s3/nueva.jpg',
    } as never);

    const archivo = { buffer: Buffer.from('x'), mimetype: 'image/jpeg' } as Express.Multer.File;
    const resultado = await servicio.actualizarImagen(1, 2, 1, {}, archivo);

    expect(resultado.urlS3).toBe('https://s3/nueva.jpg');
  });
});
