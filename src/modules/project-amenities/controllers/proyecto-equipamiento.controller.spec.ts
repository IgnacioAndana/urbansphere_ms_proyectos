import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoEquipamientoControlador } from './proyecto-equipamiento.controller';
import { ProyectoEquipamientoServicio } from '../services/proyecto-equipamiento.service';

describe('ProyectoEquipamientoControlador', () => {
  let controlador: ProyectoEquipamientoControlador;
  let servicio: jest.Mocked<ProyectoEquipamientoServicio>;

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
      controllers: [ProyectoEquipamientoControlador],
      providers: [
        {
          provide: ProyectoEquipamientoServicio,
          useValue: {
            obtenerEquipamiento: jest.fn(),
            actualizarEquipamiento: jest.fn(),
          },
        },
      ],
    }).compile();

    controlador = modulo.get(ProyectoEquipamientoControlador);
    servicio = modulo.get(ProyectoEquipamientoServicio);
  });

  it('debe obtener equipamiento', async () => {
    servicio.obtenerEquipamiento.mockResolvedValue(equipamientoMock);
    const resultado = await controlador.obtenerEquipamiento(1);
    expect(resultado.piscina).toBe(true);
  });

  it('debe actualizar equipamiento', async () => {
    servicio.actualizarEquipamiento.mockResolvedValue({ ...equipamientoMock, piscina: false });
    const resultado = await controlador.actualizarEquipamiento(1, { piscina: false });
    expect(resultado.piscina).toBe(false);
  });
});
