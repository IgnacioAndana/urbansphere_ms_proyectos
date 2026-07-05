import { Test, TestingModule } from '@nestjs/testing';
import { TipologiasControlador } from './tipologias.controller';
import { TipologiasServicio } from '../services/tipologias.service';

describe('TipologiasControlador', () => {
  let controlador: TipologiasControlador;
  let servicio: jest.Mocked<TipologiasServicio>;

  const respuestaMock = {
    id: 1,
    proyectoId: 1,
    codigoTipologia: '2D2B',
    dormitorios: 2,
    banos: 2,
    superficieM2: 64,
    valorEnUf: 3200,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  };

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      controllers: [TipologiasControlador],
      providers: [
        {
          provide: TipologiasServicio,
          useValue: {
            crearTipologia: jest.fn(),
            listarPorProyecto: jest.fn(),
            buscarPorId: jest.fn(),
            actualizarTipologia: jest.fn(),
            eliminarTipologia: jest.fn(),
          },
        },
      ],
    }).compile();

    controlador = modulo.get(TipologiasControlador);
    servicio = modulo.get(TipologiasServicio);
  });

  it('debe delegar creación al servicio', async () => {
    servicio.crearTipologia.mockResolvedValue(respuestaMock);
    const resultado = await controlador.crearTipologia(1, {
      codigoTipologia: '2D2B',
      dormitorios: 2,
      banos: 2,
      superficieM2: 64,
      valorEnUf: 3200,
    });
    expect(resultado.codigoTipologia).toBe('2D2B');
  });

  it('debe listar tipologías', async () => {
    servicio.listarPorProyecto.mockResolvedValue([respuestaMock]);
    expect(await controlador.listarTipologias(1)).toHaveLength(1);
  });

  it('debe buscar tipología por id', async () => {
    servicio.buscarPorId.mockResolvedValue(respuestaMock);
    expect((await controlador.buscarTipologia(1, 1)).id).toBe(1);
  });

  it('debe actualizar tipología', async () => {
    servicio.actualizarTipologia.mockResolvedValue({ ...respuestaMock, valorEnUf: 3500 });
    const resultado = await controlador.actualizarTipologia(1, 1, { valorEnUf: 3500 });
    expect(resultado.valorEnUf).toBe(3500);
  });

  it('debe eliminar tipología', async () => {
    servicio.eliminarTipologia.mockResolvedValue(undefined);
    await controlador.eliminarTipologia(1, 1);
    expect(servicio.eliminarTipologia).toHaveBeenCalledWith(1, 1);
  });
});
