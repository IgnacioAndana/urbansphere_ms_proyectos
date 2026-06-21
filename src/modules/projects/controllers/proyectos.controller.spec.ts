/**
 * Archivo: proyectos.controller.spec.ts
 * Ubicación: modules/projects/controllers
 * Tipo: Pruebas unitarias
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosControlador } from './proyectos.controller';
import { ProyectosServicio } from '../services/proyectos.service';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

describe('ProyectosControlador', () => {
  let controlador: ProyectosControlador;
  let servicio: jest.Mocked<ProyectosServicio>;

  const respuestaMock = {
    id: 1,
    nombre: 'Residencial Las Palmas',
    slug: 'residencial-las-palmas',
    descripcion: null,
    ciudad: 'Santiago',
    direccion: null,
    estado: EstadoProyecto.BORRADOR,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

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
    const resultado = await controlador.crearProyecto({ nombre: 'Residencial Las Palmas' });
    expect(resultado.id).toBe(1);
  });

  it('debe listar proyectos', async () => {
    servicio.listarProyectos.mockResolvedValue([respuestaMock]);
    const resultado = await controlador.listarProyectos();
    expect(resultado).toHaveLength(1);
  });

  it('debe buscar proyecto por id', async () => {
    servicio.buscarProyectoPorId.mockResolvedValue(respuestaMock);
    const resultado = await controlador.buscarProyectoPorId(1);
    expect(resultado.nombre).toBe('Residencial Las Palmas');
  });
});
