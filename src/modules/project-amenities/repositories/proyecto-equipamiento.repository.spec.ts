import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectoEquipamientoEntidad } from '../entities/proyecto-equipamiento.entity';
import { ProyectoEquipamientoRepositorio } from './proyecto-equipamiento.repository';

describe('ProyectoEquipamientoRepositorio', () => {
  let repositorio: ProyectoEquipamientoRepositorio;
  let typeormRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
  };

  const equipamientoMock = {
    id: 1,
    proyectoId: 1,
    gimnasio: true,
    piscina: false,
  };

  beforeEach(async () => {
    typeormRepo = {
      create: jest.fn().mockReturnValue(equipamientoMock),
      save: jest.fn().mockResolvedValue(equipamientoMock),
      findOne: jest.fn().mockResolvedValue(equipamientoMock),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoEquipamientoRepositorio,
        { provide: getRepositoryToken(ProyectoEquipamientoEntidad), useValue: typeormRepo },
      ],
    }).compile();

    repositorio = modulo.get(ProyectoEquipamientoRepositorio);
  });

  it('debe buscar equipamiento por proyecto', async () => {
    expect((await repositorio.buscarPorProyecto(1))?.gimnasio).toBe(true);
  });

  it('debe crear equipamiento', async () => {
    const resultado = await repositorio.crearEquipamiento({ proyectoId: 1, gimnasio: true });
    expect(resultado.proyectoId).toBe(1);
  });

  it('debe actualizar equipamiento', async () => {
    const resultado = await repositorio.actualizarEquipamiento(1, { piscina: true });
    expect(resultado?.id).toBe(1);
    expect(typeormRepo.update).toHaveBeenCalledWith(1, { piscina: true });
  });
});
