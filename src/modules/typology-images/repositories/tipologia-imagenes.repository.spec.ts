import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipologiaImagenEntidad } from '../entities/tipologia-imagen.entity';
import { TipologiaImagenesRepositorio } from './tipologia-imagenes.repository';

describe('TipologiaImagenesRepositorio', () => {
  let repositorio: TipologiaImagenesRepositorio;
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
    tipologiaId: 2,
    urlS3: 'https://s3/planta.jpg',
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
        TipologiaImagenesRepositorio,
        { provide: getRepositoryToken(TipologiaImagenEntidad), useValue: typeormRepo },
      ],
    }).compile();

    repositorio = modulo.get(TipologiaImagenesRepositorio);
  });

  it('debe crear imagen', async () => {
    const resultado = await repositorio.crearImagen({ urlS3: 'https://s3/planta.jpg' });
    expect(resultado.tipologiaId).toBe(2);
  });

  it('debe buscar y listar imágenes', async () => {
    expect((await repositorio.buscarImagenPorId(1))?.id).toBe(1);
    expect(await repositorio.listarImagenesPorTipologia(2)).toHaveLength(1);
  });

  it('debe actualizar, quitar portada y eliminar', async () => {
    const actualizada = await repositorio.actualizarImagen(1, { esPortada: false });
    expect(actualizada?.id).toBe(1);
    await repositorio.quitarPortadaDeTipologia(2);
    expect(typeormRepo.update).toHaveBeenCalledWith(
      { tipologiaId: 2, esPortada: true },
      { esPortada: false },
    );
    await repositorio.eliminarImagen(1);
    expect(typeormRepo.delete).toHaveBeenCalledWith(1);
  });
});
