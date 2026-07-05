import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosRepositorio } from '../../projects/repositories/proyectos.repository';
import { ProyectoEquipamientoRepositorio } from '../repositories/proyecto-equipamiento.repository';
import { ProyectoEquipamientoServicio } from './proyecto-equipamiento.service';

describe('ProyectoEquipamientoServicio', () => {
  let servicio: ProyectoEquipamientoServicio;
  let equipamientoRepo: jest.Mocked<ProyectoEquipamientoRepositorio>;

  const equipamientoMock = {
    id: 1,
    proyectoId: 1,
    gimnasio: true,
    quincho: false,
    areasVerdes: true,
    bicicletero: false,
    piscina: true,
    juegosInfantiles: false,
    gourmetLounge: false,
    coworkingRoom: true,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoEquipamientoServicio,
        {
          provide: ProyectoEquipamientoRepositorio,
          useValue: {
            buscarPorProyecto: jest.fn(),
            crearEquipamiento: jest.fn(),
            actualizarEquipamiento: jest.fn(),
          },
        },
        {
          provide: ProyectosRepositorio,
          useValue: { buscarProyectoPorId: jest.fn().mockResolvedValue({ id: 1 }) },
        },
      ],
    }).compile();

    servicio = modulo.get(ProyectoEquipamientoServicio);
    equipamientoRepo = modulo.get(ProyectoEquipamientoRepositorio);
  });

  it('debe devolver equipamiento vacío si no existe registro', async () => {
    equipamientoRepo.buscarPorProyecto.mockResolvedValue(null);

    const resultado = await servicio.obtenerEquipamiento(1);

    expect(resultado.proyectoId).toBe(1);
    expect(resultado.gimnasio).toBe(false);
    expect(resultado.id).toBe(0);
  });

  it('debe actualizar flags existentes', async () => {
    equipamientoRepo.buscarPorProyecto.mockResolvedValue(equipamientoMock as never);
    equipamientoRepo.actualizarEquipamiento.mockResolvedValue({
      ...equipamientoMock,
      piscina: false,
    } as never);

    const resultado = await servicio.actualizarEquipamiento(1, { piscina: false });

    expect(resultado.piscina).toBe(false);
  });

  it('debe crear equipamiento si no existe al actualizar', async () => {
    equipamientoRepo.buscarPorProyecto.mockResolvedValue(null);
    equipamientoRepo.crearEquipamiento.mockResolvedValue(equipamientoMock as never);

    const resultado = await servicio.actualizarEquipamiento(1, { gimnasio: true });

    expect(equipamientoRepo.crearEquipamiento).toHaveBeenCalled();
    expect(resultado.gimnasio).toBe(true);
  });
});
