/**
 * Archivo: proyectos.service.spec.ts
 * Ubicación: modules/projects/services
 * Tipo: Pruebas unitarias
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ProyectosServicio } from './proyectos.service';
import { ProyectosRepositorio } from '../repositories/proyectos.repository';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

describe('ProyectosServicio', () => {
  let servicio: ProyectosServicio;
  let repositorio: jest.Mocked<ProyectosRepositorio>;

  const proyectoMock = {
    id: 1,
    nombre: 'Residencial Las Palmas',
    slug: 'residencial-las-palmas',
    descripcion: 'Proyecto de prueba',
    ciudad: 'Santiago',
    direccion: 'Av. Test 123',
    estado: EstadoProyecto.BORRADOR,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectosServicio,
        {
          provide: ProyectosRepositorio,
          useValue: {
            crearProyecto: jest.fn(),
            buscarProyectoPorId: jest.fn(),
            buscarProyectoPorSlug: jest.fn(),
            listarProyectos: jest.fn(),
            actualizarProyecto: jest.fn(),
            eliminarProyecto: jest.fn(),
          },
        },
      ],
    }).compile();

    servicio = modulo.get(ProyectosServicio);
    repositorio = modulo.get(ProyectosRepositorio);
  });

  it('debe crear un proyecto', async () => {
    repositorio.buscarProyectoPorSlug.mockResolvedValue(null);
    repositorio.crearProyecto.mockResolvedValue(proyectoMock as never);

    const resultado = await servicio.crearProyecto({
      nombre: 'Residencial Las Palmas',
    });

    expect(resultado.nombre).toBe('Residencial Las Palmas');
    expect(resultado.slug).toBe('residencial-las-palmas');
  });

  it('debe lanzar error si el slug ya existe', async () => {
    repositorio.buscarProyectoPorSlug.mockResolvedValue(proyectoMock as never);

    await expect(
      servicio.crearProyecto({ nombre: 'Residencial Las Palmas', slug: 'residencial-las-palmas' }),
    ).rejects.toThrow(ExcepcionNegocio);
  });

  it('debe buscar proyecto por id', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(proyectoMock as never);
    const resultado = await servicio.buscarProyectoPorId(1);
    expect(resultado.id).toBe(1);
  });

  it('debe lanzar error si proyecto no existe', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(null);
    await expect(servicio.buscarProyectoPorId(999)).rejects.toThrow(ExcepcionNegocio);
  });

  it('debe actualizar proyecto', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(proyectoMock as never);
    repositorio.actualizarProyecto.mockResolvedValue({
      ...proyectoMock,
      nombre: 'Actualizado',
    } as never);

    const resultado = await servicio.actualizarProyecto(1, { nombre: 'Actualizado' });
    expect(resultado.nombre).toBe('Actualizado');
  });

  it('debe eliminar proyecto', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(proyectoMock as never);
    repositorio.eliminarProyecto.mockResolvedValue(undefined);

    await expect(servicio.eliminarProyecto(1)).resolves.toBeUndefined();
  });
});
