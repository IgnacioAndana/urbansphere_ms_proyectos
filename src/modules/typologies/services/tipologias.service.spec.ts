import { Test, TestingModule } from '@nestjs/testing';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { ProyectosRepositorio } from '../../projects/repositories/proyectos.repository';
import { TipologiasRepositorio } from '../repositories/tipologias.repository';
import { TipologiasServicio } from './tipologias.service';

describe('TipologiasServicio', () => {
  let servicio: TipologiasServicio;
  let tipologiasRepo: jest.Mocked<TipologiasRepositorio>;
  let proyectosRepo: jest.Mocked<ProyectosRepositorio>;

  const tipologiaMock = {
    id: 1,
    proyectoId: 1,
    codigoTipologia: '2D2B-64',
    dormitorios: 2,
    banos: 2,
    superficieM2: 64,
    valorEnUf: 3200,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        TipologiasServicio,
        {
          provide: TipologiasRepositorio,
          useValue: {
            crearTipologia: jest.fn(),
            buscarPorId: jest.fn(),
            buscarPorProyectoYCodigo: jest.fn(),
            listarPorProyecto: jest.fn(),
            actualizarTipologia: jest.fn(),
            eliminarTipologia: jest.fn(),
          },
        },
        {
          provide: ProyectosRepositorio,
          useValue: { buscarProyectoPorId: jest.fn() },
        },
      ],
    }).compile();

    servicio = modulo.get(TipologiasServicio);
    tipologiasRepo = modulo.get(TipologiasRepositorio);
    proyectosRepo = modulo.get(ProyectosRepositorio);
  });

  it('debe crear tipología', async () => {
    proyectosRepo.buscarProyectoPorId.mockResolvedValue({ id: 1 } as never);
    tipologiasRepo.buscarPorProyectoYCodigo.mockResolvedValue(null);
    tipologiasRepo.crearTipologia.mockResolvedValue(tipologiaMock as never);

    const resultado = await servicio.crearTipologia(1, {
      codigoTipologia: '2D2B-64',
      dormitorios: 2,
      banos: 2,
      superficieM2: 64,
      valorEnUf: 3200,
    });

    expect(resultado.codigoTipologia).toBe('2D2B-64');
  });

  it('debe rechazar tipología si proyectoId no coincide (bigint string)', async () => {
    tipologiasRepo.buscarPorId.mockResolvedValue({
      ...tipologiaMock,
      proyectoId: '2' as unknown as number,
    } as never);

    await expect(servicio.obtenerTipologiaDeProyecto(1, 1)).rejects.toThrow(ExcepcionNegocio);
  });

  it('debe encontrar tipología cuando proyectoId coincide como string', async () => {
    tipologiasRepo.buscarPorId.mockResolvedValue({
      ...tipologiaMock,
      proyectoId: '1' as unknown as number,
    } as never);

    const resultado = await servicio.obtenerTipologiaDeProyecto(1, 1);
    expect(resultado.id).toBe(1);
  });

  it('debe listar tipologías por proyecto', async () => {
    proyectosRepo.buscarProyectoPorId.mockResolvedValue({ id: 1 } as never);
    tipologiasRepo.listarPorProyecto.mockResolvedValue([tipologiaMock as never]);

    const resultado = await servicio.listarPorProyecto(1);
    expect(resultado).toHaveLength(1);
  });

  it('debe actualizar tipología', async () => {
    tipologiasRepo.buscarPorId.mockResolvedValue(tipologiaMock as never);
    tipologiasRepo.actualizarTipologia.mockResolvedValue({
      ...tipologiaMock,
      valorEnUf: 3500,
    } as never);

    const resultado = await servicio.actualizarTipologia(1, 1, { valorEnUf: 3500 });
    expect(resultado.valorEnUf).toBe(3500);
  });

  it('debe eliminar tipología', async () => {
    tipologiasRepo.buscarPorId.mockResolvedValue(tipologiaMock as never);
    tipologiasRepo.eliminarTipologia.mockResolvedValue(undefined);

    await servicio.eliminarTipologia(1, 1);
    expect(tipologiasRepo.eliminarTipologia).toHaveBeenCalledWith(1);
  });

  it('debe rechazar código duplicado al crear', async () => {
    proyectosRepo.buscarProyectoPorId.mockResolvedValue({ id: 1 } as never);
    tipologiasRepo.buscarPorProyectoYCodigo.mockResolvedValue({ id: 99 } as never);

    await expect(
      servicio.crearTipologia(1, {
        codigoTipologia: '2D2B-64',
        dormitorios: 2,
        banos: 2,
        superficieM2: 64,
        valorEnUf: 3200,
      }),
    ).rejects.toThrow(ExcepcionNegocio);
  });
});
