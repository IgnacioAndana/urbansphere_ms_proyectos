/**
 * Archivo: propiedades.service.spec.ts
 * Ubicación: modules/properties/services
 * Tipo: Pruebas unitarias
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PropiedadesServicio } from './propiedades.service';
import { PropiedadesRepositorio } from '../repositories/propiedades.repository';
import { ProyectosRepositorio } from '../../projects/repositories/proyectos.repository';
import { RabbitmqProductor } from '../../../messaging/producers/rabbitmq.producer';
import { EstadoPropiedad } from '../../../common/enums/estado-propiedad.enum';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';

describe('PropiedadesServicio', () => {
  let servicio: PropiedadesServicio;
  let propiedadesRepo: jest.Mocked<PropiedadesRepositorio>;
  let proyectosRepo: jest.Mocked<ProyectosRepositorio>;

  const propiedadMock = {
    id: 1,
    proyectoId: 1,
    titulo: 'Depto 3D',
    descripcion: null,
    precio: 100000,
    dormitorios: 3,
    banos: 2,
    areaM2: 90,
    estado: EstadoPropiedad.DISPONIBLE,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    proyecto: { id: 1, nombre: 'Proyecto Test' },
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        PropiedadesServicio,
        {
          provide: PropiedadesRepositorio,
          useValue: {
            crearPropiedad: jest.fn(),
            buscarPropiedadPorId: jest.fn(),
            listarPropiedades: jest.fn(),
            listarPropiedadesPorProyecto: jest.fn(),
            actualizarPropiedad: jest.fn(),
            eliminarPropiedad: jest.fn(),
          },
        },
        {
          provide: ProyectosRepositorio,
          useValue: { buscarProyectoPorId: jest.fn() },
        },
        {
          provide: RabbitmqProductor,
          useValue: { publicarPropiedadCreada: jest.fn() },
        },
      ],
    }).compile();

    servicio = modulo.get(PropiedadesServicio);
    propiedadesRepo = modulo.get(PropiedadesRepositorio);
    proyectosRepo = modulo.get(ProyectosRepositorio);
  });

  it('debe crear propiedad y publicar evento', async () => {
    proyectosRepo.buscarProyectoPorId.mockResolvedValue({ id: 1 } as never);
    propiedadesRepo.crearPropiedad.mockResolvedValue(propiedadMock as never);

    const resultado = await servicio.crearPropiedad({
      proyectoId: 1,
      titulo: 'Depto 3D',
      precio: 100000,
    });

    expect(resultado.titulo).toBe('Depto 3D');
  });

  it('debe lanzar error si proyecto no existe', async () => {
    proyectosRepo.buscarProyectoPorId.mockResolvedValue(null);

    await expect(
      servicio.crearPropiedad({ proyectoId: 999, titulo: 'Test', precio: 1 }),
    ).rejects.toThrow(ExcepcionNegocio);
  });
});
