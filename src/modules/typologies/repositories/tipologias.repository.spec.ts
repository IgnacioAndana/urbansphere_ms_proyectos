import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipologiaEntidad } from '../entities/tipologia.entity';
import { TipologiasRepositorio } from './tipologias.repository';

describe('TipologiasRepositorio', () => {
  let repositorio: TipologiasRepositorio;
  let typeormRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const tipologiaMock = {
    id: 1,
    proyectoId: 1,
    codigoTipologia: '2D2B',
    dormitorios: 2,
    banos: 2,
    superficieM2: 64,
    valorEnUf: 3200,
  };

  beforeEach(async () => {
    typeormRepo = {
      create: jest.fn().mockReturnValue(tipologiaMock),
      save: jest.fn().mockResolvedValue(tipologiaMock),
      findOne: jest.fn().mockResolvedValue(tipologiaMock),
      find: jest.fn().mockResolvedValue([tipologiaMock]),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        TipologiasRepositorio,
        { provide: getRepositoryToken(TipologiaEntidad), useValue: typeormRepo },
      ],
    }).compile();

    repositorio = modulo.get(TipologiasRepositorio);
  });

  it('debe crear tipología', async () => {
    const resultado = await repositorio.crearTipologia({ codigoTipologia: '2D2B' });
    expect(resultado.id).toBe(1);
  });

  it('debe buscar por id y por proyecto/código', async () => {
    expect((await repositorio.buscarPorId(1))?.id).toBe(1);
    expect((await repositorio.buscarPorProyectoYCodigo(1, '2D2B'))?.codigoTipologia).toBe('2D2B');
  });

  it('debe listar por proyecto', async () => {
    expect(await repositorio.listarPorProyecto(1)).toHaveLength(1);
  });

  it('debe actualizar y eliminar tipología', async () => {
    const actualizada = await repositorio.actualizarTipologia(1, { valorEnUf: 3500 });
    expect(actualizada?.id).toBe(1);
    await repositorio.eliminarTipologia(1);
    expect(typeormRepo.delete).toHaveBeenCalledWith(1);
  });
});
