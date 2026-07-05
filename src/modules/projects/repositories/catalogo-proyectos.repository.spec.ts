import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectoImagenEntidad } from '../../project-images/entities/proyecto-imagen.entity';
import { TipologiaEntidad } from '../../typologies/entities/tipologia.entity';
import { ProyectoEntidad } from '../entities/proyecto.entity';
import { CatalogoProyectosRepositorio } from './catalogo-proyectos.repository';

describe('CatalogoProyectosRepositorio', () => {
  let repositorio: CatalogoProyectosRepositorio;
  let proyectosRepo: { find: jest.Mock };
  let tipologiasRepo: { createQueryBuilder: jest.Mock };
  let imagenesRepo: { find: jest.Mock };

  beforeEach(async () => {
    proyectosRepo = { find: jest.fn() };
    imagenesRepo = { find: jest.fn() };

    const queryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };
    tipologiasRepo = { createQueryBuilder: jest.fn().mockReturnValue(queryBuilder) };

    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogoProyectosRepositorio,
        { provide: getRepositoryToken(ProyectoEntidad), useValue: proyectosRepo },
        { provide: getRepositoryToken(TipologiaEntidad), useValue: tipologiasRepo },
        { provide: getRepositoryToken(ProyectoImagenEntidad), useValue: imagenesRepo },
      ],
    }).compile();

    repositorio = modulo.get(CatalogoProyectosRepositorio);
  });

  it('debe retornar vacío si no hay ids', async () => {
    expect(await repositorio.buscarProyectosPorIds([])).toEqual([]);
    expect(await repositorio.agregarTipologiasPorProyectos([])).toEqual(new Map());
    expect(await repositorio.obtenerUrlPortadaPorProyectos([])).toEqual(new Map());
  });

  it('debe agregar agregación de tipologías por proyecto', async () => {
    const qb = tipologiasRepo.createQueryBuilder();
    qb.getRawMany.mockResolvedValue([
      {
        proyectoId: '1',
        precioDesdeUf: '3200',
        dormitoriosMin: '2',
        dormitoriosMax: '3',
        banosMin: '1',
        banosMax: '2',
        superficieMin: '45',
        superficieMax: '72',
      },
    ]);

    const mapa = await repositorio.agregarTipologiasPorProyectos([1]);

    expect(mapa.get(1)).toEqual({
      precioDesdeUf: 3200,
      dormitoriosMin: 2,
      dormitoriosMax: 3,
      banosMin: 1,
      banosMax: 2,
      superficieMin: 45,
      superficieMax: 72,
    });
  });

  it('debe elegir primera portada por proyecto', async () => {
    imagenesRepo.find.mockResolvedValue([
      { proyectoId: 1, urlS3: 'https://s3/a.jpg', esPortada: false },
      { proyectoId: 1, urlS3: 'https://s3/portada.jpg', esPortada: true },
      { proyectoId: 2, urlS3: 'https://s3/b.jpg', esPortada: false },
    ]);

    const portadas = await repositorio.obtenerUrlPortadaPorProyectos([1, 2]);

    expect(portadas.get(1)).toBe('https://s3/a.jpg');
    expect(portadas.get(2)).toBe('https://s3/b.jpg');
  });
});
