import { Test, TestingModule } from '@nestjs/testing';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { S3Servicio } from '../../storage/services/s3.service';
import { ProyectosRepositorio } from '../../projects/repositories/proyectos.repository';
import { ProyectoImagenesRepositorio } from '../repositories/proyecto-imagenes.repository';
import { ProyectoImagenesServicio } from './proyecto-imagenes.service';

describe('ProyectoImagenesServicio', () => {
  let servicio: ProyectoImagenesServicio;
  let imagenesRepo: jest.Mocked<ProyectoImagenesRepositorio>;
  let s3Servicio: jest.Mocked<S3Servicio>;

  const imagenMock = {
    id: 1,
    proyectoId: 1,
    urlS3: 'https://example.com/img.jpg',
    etiqueta: 'galeria',
    esPortada: false,
    orden: 0,
    creadoEn: new Date(),
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoImagenesServicio,
        {
          provide: ProyectoImagenesRepositorio,
          useValue: {
            crearImagen: jest.fn(),
            listarImagenesPorProyecto: jest.fn(),
            buscarImagenPorId: jest.fn(),
            actualizarImagen: jest.fn(),
            eliminarImagen: jest.fn(),
            quitarPortadaDeProyecto: jest.fn(),
          },
        },
        {
          provide: ProyectosRepositorio,
          useValue: { buscarProyectoPorId: jest.fn().mockResolvedValue({ id: 1 }) },
        },
        {
          provide: S3Servicio,
          useValue: {
            subirImagenProyecto: jest.fn(),
          },
        },
      ],
    }).compile();

    servicio = modulo.get(ProyectoImagenesServicio);
    imagenesRepo = modulo.get(ProyectoImagenesRepositorio);
    s3Servicio = modulo.get(S3Servicio);
  });

  it('debe crear imagen con urlS3', async () => {
    imagenesRepo.crearImagen.mockResolvedValue(imagenMock as never);

    const resultado = await servicio.crearImagen(1, {
      urlS3: 'https://example.com/img.jpg',
      etiqueta: 'galeria',
    });

    expect(resultado.urlS3).toBe('https://example.com/img.jpg');
  });

  it('debe crear imagen subiendo archivo a S3', async () => {
    s3Servicio.subirImagenProyecto.mockResolvedValue('https://s3.example.com/nueva.jpg');
    imagenesRepo.crearImagen.mockResolvedValue({
      ...imagenMock,
      urlS3: 'https://s3.example.com/nueva.jpg',
    } as never);

    const archivo = {
      buffer: Buffer.from('test'),
      originalname: 'foto.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const resultado = await servicio.crearImagen(1, { etiqueta: 'galeria' }, archivo);
    expect(s3Servicio.subirImagenProyecto).toHaveBeenCalled();
    expect(resultado.urlS3).toContain('s3.example.com');
  });

  it('debe fallar si no hay urlS3 ni archivo', async () => {
    await expect(servicio.crearImagen(1, {})).rejects.toThrow(ExcepcionNegocio);
  });

  it('debe listar imágenes vacías', async () => {
    imagenesRepo.listarImagenesPorProyecto.mockResolvedValue([]);
    const resultado = await servicio.listarImagenesPorProyecto(1);
    expect(resultado).toEqual([]);
  });

  it('debe quitar portada anterior al marcar esPortada', async () => {
    imagenesRepo.crearImagen.mockResolvedValue({ ...imagenMock, esPortada: true } as never);

    await servicio.crearImagen(1, { urlS3: 'https://example.com/p.jpg', esPortada: true });

    expect(imagenesRepo.quitarPortadaDeProyecto).toHaveBeenCalledWith(1);
  });

  it('debe actualizar imagen existente', async () => {
    imagenesRepo.buscarImagenPorId.mockResolvedValue(imagenMock as never);
    imagenesRepo.actualizarImagen.mockResolvedValue({ ...imagenMock, etiqueta: 'portada' } as never);

    const resultado = await servicio.actualizarImagen(1, 1, { etiqueta: 'portada' });
    expect(resultado.etiqueta).toBe('portada');
  });

  it('debe eliminar imagen del proyecto', async () => {
    imagenesRepo.buscarImagenPorId.mockResolvedValue(imagenMock as never);
    imagenesRepo.eliminarImagen.mockResolvedValue(undefined);

    await servicio.eliminarImagen(1, 1);
    expect(imagenesRepo.eliminarImagen).toHaveBeenCalledWith(1);
  });
});
