/**
 * Archivo: proyectos.repository.spec.ts
 * Ubicación: modules/projects/repositories
 * Tipo: Pruebas unitarias
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectosRepositorio } from './proyectos.repository';
import { ProyectoEntidad } from '../entities/proyecto.entity';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

describe('ProyectosRepositorio', () => {
  let repositorio: ProyectosRepositorio;
  let typeormRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const proyectoMock = {
    id: 1,
    nombre: 'Test',
    slug: 'test',
    estado: EstadoProyecto.BORRADOR,
  };

  beforeEach(async () => {
    typeormRepo = {
      create: jest.fn().mockReturnValue(proyectoMock),
      save: jest.fn().mockResolvedValue(proyectoMock),
      findOne: jest.fn().mockResolvedValue(proyectoMock),
      find: jest.fn().mockResolvedValue([proyectoMock]),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectosRepositorio,
        { provide: getRepositoryToken(ProyectoEntidad), useValue: typeormRepo },
      ],
    }).compile();

    repositorio = modulo.get(ProyectosRepositorio);
  });

  it('debe crear proyecto', async () => {
    const resultado = await repositorio.crearProyecto({ nombre: 'Test', slug: 'test' });
    expect(resultado.id).toBe(1);
    expect(typeormRepo.save).toHaveBeenCalled();
  });

  it('debe buscar proyecto por id', async () => {
    const resultado = await repositorio.buscarProyectoPorId(1);
    expect(resultado?.id).toBe(1);
  });

  it('debe listar proyectos', async () => {
    const resultado = await repositorio.listarProyectos();
    expect(resultado).toHaveLength(1);
  });
});
