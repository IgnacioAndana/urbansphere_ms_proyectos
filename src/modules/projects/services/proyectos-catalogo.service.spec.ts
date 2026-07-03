import { Test, TestingModule } from '@nestjs/testing';
import { ROLES } from '../../../common/constants/app.constants';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';
import { TipoProyecto } from '../../../common/enums/tipo-proyecto.enum';
import { RabbitmqProductor } from '../../../messaging/producers/rabbitmq.producer';
import { CatalogoProyectosRepositorio } from '../repositories/catalogo-proyectos.repository';
import { ProyectosRepositorio } from '../repositories/proyectos.repository';
import { ProyectosServicio } from './proyectos.service';

describe('ProyectosServicio — consultarCatalogo', () => {
  let servicio: ProyectosServicio;
  let catalogoRepositorio: jest.Mocked<CatalogoProyectosRepositorio>;

  const proyectoActivo = {
    id: 12,
    titulo: 'Edificio Vista Parque',
    slug: 'edificio-vista-parque',
    direccion: 'Av. Providencia 1234',
    comuna: 'Providencia',
    tipo: TipoProyecto.DEPARTAMENTO,
    fechaEntregaEstimada: '2027-06-30',
    latitud: -33.4489,
    longitud: -70.6693,
    descripcion: 'Proyecto residencial',
    estado: EstadoProyecto.ACTIVO,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

  const proyectoBorrador = {
    ...proyectoActivo,
    id: 5,
    titulo: 'Proyecto borrador',
    estado: EstadoProyecto.BORRADOR,
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectosServicio,
        {
          provide: ProyectosRepositorio,
          useValue: {},
        },
        {
          provide: CatalogoProyectosRepositorio,
          useValue: {
            buscarProyectosPorIds: jest.fn(),
            agregarTipologiasPorProyectos: jest.fn(),
            obtenerUrlPortadaPorProyectos: jest.fn(),
          },
        },
        {
          provide: RabbitmqProductor,
          useValue: { publicarProyectoCreado: jest.fn() },
        },
      ],
    }).compile();

    servicio = modulo.get(ProyectosServicio);
    catalogoRepositorio = modulo.get(CatalogoProyectosRepositorio);
  });

  it('ids vacío → 200 con items y omitidos vacíos', async () => {
    const resultado = await servicio.consultarCatalogo([], ROLES.USER);
    expect(resultado).toEqual({ items: [], omitidos: [] });
    expect(catalogoRepositorio.buscarProyectosPorIds).not.toHaveBeenCalled();
  });

  it('agrega tipologías y respeta orden de ids', async () => {
    catalogoRepositorio.buscarProyectosPorIds.mockResolvedValue([proyectoActivo as never]);
    catalogoRepositorio.agregarTipologiasPorProyectos.mockResolvedValue(
      new Map([
        [
          12,
          {
            precioDesdeUf: 3200,
            dormitoriosMin: 2,
            dormitoriosMax: 3,
            banosMin: 2,
            banosMax: 2,
            superficieMin: 64,
            superficieMax: 85,
          },
        ],
      ]),
    );
    catalogoRepositorio.obtenerUrlPortadaPorProyectos.mockResolvedValue(
      new Map([[12, 'https://example.com/portada.jpg']]),
    );

    const resultado = await servicio.consultarCatalogo([12], ROLES.USER);

    expect(resultado.items).toHaveLength(1);
    expect(resultado.items[0].precioDesdeUf).toBe(3200);
    expect(resultado.items[0].dormitoriosMin).toBe(2);
    expect(resultado.items[0].urlPortada).toBe('https://example.com/portada.jpg');
    expect(resultado.omitidos).toEqual([]);
  });

  it('rol user: proyecto inactivo va a omitidos', async () => {
    catalogoRepositorio.buscarProyectosPorIds.mockResolvedValue([proyectoBorrador as never]);
    catalogoRepositorio.agregarTipologiasPorProyectos.mockResolvedValue(new Map());
    catalogoRepositorio.obtenerUrlPortadaPorProyectos.mockResolvedValue(new Map());

    const resultado = await servicio.consultarCatalogo([5], ROLES.USER);

    expect(resultado.items).toEqual([]);
    expect(resultado.omitidos).toEqual([{ id: 5, motivo: 'inactivo' }]);
  });

  it('rol admin: incluye proyecto no activo en items', async () => {
    catalogoRepositorio.buscarProyectosPorIds.mockResolvedValue([proyectoBorrador as never]);
    catalogoRepositorio.agregarTipologiasPorProyectos.mockResolvedValue(new Map());
    catalogoRepositorio.obtenerUrlPortadaPorProyectos.mockResolvedValue(new Map());

    const resultado = await servicio.consultarCatalogo([5], ROLES.ADMIN);

    expect(resultado.items).toHaveLength(1);
    expect(resultado.items[0].estado).toBe(EstadoProyecto.BORRADOR);
    expect(resultado.omitidos).toEqual([]);
  });

  it('id inexistente → omitidos no_encontrado', async () => {
    catalogoRepositorio.buscarProyectosPorIds.mockResolvedValue([]);
    catalogoRepositorio.agregarTipologiasPorProyectos.mockResolvedValue(new Map());
    catalogoRepositorio.obtenerUrlPortadaPorProyectos.mockResolvedValue(new Map());

    const resultado = await servicio.consultarCatalogo([99], ROLES.USER);

    expect(resultado.items).toEqual([]);
    expect(resultado.omitidos).toEqual([{ id: 99, motivo: 'no_encontrado' }]);
  });

  it('mantiene orden de salida según ids del body', async () => {
    const proyecto34 = { ...proyectoActivo, id: 34, titulo: 'Proyecto 34' };
    catalogoRepositorio.buscarProyectosPorIds.mockResolvedValue([
      proyectoActivo as never,
      proyecto34 as never,
    ]);
    catalogoRepositorio.agregarTipologiasPorProyectos.mockResolvedValue(new Map());
    catalogoRepositorio.obtenerUrlPortadaPorProyectos.mockResolvedValue(new Map());

    const resultado = await servicio.consultarCatalogo([34, 12], ROLES.ADMIN);

    expect(resultado.items.map((i) => i.id)).toEqual([34, 12]);
  });
});
