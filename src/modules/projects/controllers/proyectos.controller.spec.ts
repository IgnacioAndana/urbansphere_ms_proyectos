/**
 * Archivo: proyectos.controller.spec.ts
 * Ubicación: modules/projects/controllers
 * Tipo: Pruebas unitarias
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosControlador } from './proyectos.controller';
import { ProyectosServicio } from '../services/proyectos.service';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';
import { ROLES } from '../../../common/constants/app.constants';

describe('ProyectosControlador', () => {
  let controlador: ProyectosControlador;
  let servicio: jest.Mocked<ProyectosServicio>;

  const respuestaMock = {
    id: 1,
    titulo: 'Edificio Vista Parque',
    slug: 'edificio-vista-parque',
    direccion: 'Av. Providencia 1234, Providencia, Santiago',
    precio: 250000000,
    latitud: -33.4489,
    longitud: -70.6693,
    descripcion: null,
    estado: EstadoProyecto.BORRADOR,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

  const usuarioAdmin = { sub: 1, uuid: 'uuid-test', email: 'admin@test.com', rol: ROLES.ADMIN };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      controllers: [ProyectosControlador],
      providers: [
        {
          provide: ProyectosServicio,
          useValue: {
            crearProyecto: jest.fn(),
            buscarProyectoPorId: jest.fn(),
            listarProyectos: jest.fn(),
            actualizarProyecto: jest.fn(),
            eliminarProyecto: jest.fn(),
          },
        },
      ],
    }).compile();

    controlador = modulo.get(ProyectosControlador);
    servicio = modulo.get(ProyectosServicio);
  });

  it('debe crear proyecto', async () => {
    servicio.crearProyecto.mockResolvedValue(respuestaMock);
    const resultado = await controlador.crearProyecto({
      titulo: 'Edificio Vista Parque',
      direccion: 'Av. Providencia 1234',
      precio: 250000000,
    });
    expect(resultado.id).toBe(1);
  });

  it('debe listar proyectos', async () => {
    servicio.listarProyectos.mockResolvedValue([respuestaMock]);
    const resultado = await controlador.listarProyectos(usuarioAdmin);
    expect(resultado).toHaveLength(1);
    expect(servicio.listarProyectos).toHaveBeenCalledWith(ROLES.ADMIN);
  });

  it('debe buscar proyecto por id', async () => {
    servicio.buscarProyectoPorId.mockResolvedValue(respuestaMock);
    const resultado = await controlador.buscarProyectoPorId(1, usuarioAdmin);
    expect(resultado.titulo).toBe('Edificio Vista Parque');
  });
});
