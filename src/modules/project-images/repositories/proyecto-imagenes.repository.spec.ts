import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectoImagenEntidad } from '../entities/proyecto-imagen.entity';
import { ProyectoImagenesRepositorio } from './proyecto-imagenes.repository';

describe('ProyectoImagenesRepositorio', () => {
  let repositorio: ProyectoImagenesRepositorio;
  let typeormRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const imagenMock = {
    id: 1,
    proyectoId: 1,
    urlS3: 'https://s3/img.jpg',
    esPortada: true,
    orden: 0,
  };

  beforeEach(async () => {
    typeormRepo = {
      create: jest.fn().mockReturnValue(imagenMock),
      save: jest.fn().mockResolvedValue(imagenMock),
      findOne: jest.fn().mockResolvedValue(imagenMock),
      find: jest.fn().mockResolvedValue([imagenMock]),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoImagenesRepositorio,
        { provide: getRepositoryToken(ProyectoImagenEntidad), useValue: typeormRepo },
      ],
    }).compile();

    repositorio = modulo.get(ProyectoImagenesRepositorio);
  });

  it('debe crear imagen', async () => {
    const resultado = await repositorio.crearImagen({ urlS3: 'https://s3/img.jpg' });
    expect(resultado.urlS3).toContain('s3');
  });

  it('debe buscar y listar imágenes', async () => {
    expect((await repositorio.buscarImagenPorId(1))?.id).toBe(1);
    expect(await repositorio.listarImagenesPorProyecto(1)).toHaveLength(1);
  });

  it('debe actualizar, quitar portada y eliminar', async () => {
    const actualizada = await repositorio.actualizarImagen(1, { esPortada: false });
    expect(actualizada?.id).toBe(1);
    await repositorio.quitarPortadaDeProyecto(1);
    expect(typeormRepo.update).toHaveBeenCalledWith(
      { proyectoId: 1, esPortada: true },
      { esPortada: false },
    );
    await repositorio.eliminarImagen(1);
    expect(typeormRepo.delete).toHaveBeenCalledWith(1);
  });
});
