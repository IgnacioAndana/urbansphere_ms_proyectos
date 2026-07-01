/**
 * Archivo: proyectos.service.spec.ts
 * Ubicación: modules/projects/services
 * Tipo: Pruebas unitarias
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosServicio } from './proyectos.service';
import { ProyectosRepositorio } from '../repositories/proyectos.repository';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';
import { ROLES } from '../../../common/constants/app.constants';
import { RabbitmqProductor } from '../../../messaging/producers/rabbitmq.producer';

describe('ProyectosServicio', () => {
  let servicio: ProyectosServicio;
  let repositorio: jest.Mocked<ProyectosRepositorio>;

  const proyectoMock = {
    id: 1,
    titulo: 'Edificio Vista Parque',
    slug: 'edificio-vista-parque',
    direccion: 'Av. Providencia 1234, Providencia, Santiago',
    precio: 250000000,
    latitud: -33.4489,
    longitud: -70.6693,
    descripcion: 'Proyecto de prueba',
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
        {
          provide: RabbitmqProductor,
          useValue: { publicarProyectoCreado: jest.fn() },
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
      titulo: 'Edificio Vista Parque',
      direccion: 'Av. Providencia 1234, Providencia, Santiago',
      precio: 250000000,
    });

    expect(resultado.titulo).toBe('Edificio Vista Parque');
    expect(resultado.slug).toBe('edificio-vista-parque');
  });

  it('debe lanzar error si el slug ya existe', async () => {
    repositorio.buscarProyectoPorSlug.mockResolvedValue(proyectoMock as never);

    await expect(
      servicio.crearProyecto({
        titulo: 'Edificio Vista Parque',
        direccion: 'Av. Providencia 1234',
        precio: 250000000,
        slug: 'edificio-vista-parque',
      }),
    ).rejects.toThrow(ExcepcionNegocio);
  });

  it('debe buscar proyecto por id', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(proyectoMock as never);
    const resultado = await servicio.buscarProyectoPorId(1, ROLES.ADMIN);
    expect(resultado.id).toBe(1);
  });

  it('debe ocultar borradores a usuarios normales', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(proyectoMock as never);
    await expect(servicio.buscarProyectoPorId(1, ROLES.USER)).rejects.toThrow(
      ExcepcionNegocio,
    );
  });

  it('debe lanzar error si proyecto no existe', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(null);
    await expect(servicio.buscarProyectoPorId(999, ROLES.ADMIN)).rejects.toThrow(
      ExcepcionNegocio,
    );
  });

  it('debe listar solo activos para user', async () => {
    repositorio.listarProyectos.mockResolvedValue([proyectoMock as never]);
    await servicio.listarProyectos(ROLES.USER);
    expect(repositorio.listarProyectos).toHaveBeenCalledWith(true);
  });

  it('debe actualizar proyecto', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(proyectoMock as never);
    repositorio.actualizarProyecto.mockResolvedValue({
      ...proyectoMock,
      titulo: 'Actualizado',
    } as never);

    const resultado = await servicio.actualizarProyecto(1, { titulo: 'Actualizado' });
    expect(resultado.titulo).toBe('Actualizado');
  });

  it('debe eliminar proyecto', async () => {
    repositorio.buscarProyectoPorId.mockResolvedValue(proyectoMock as never);
    repositorio.eliminarProyecto.mockResolvedValue(undefined);

    await expect(servicio.eliminarProyecto(1)).resolves.toBeUndefined();
  });
});
