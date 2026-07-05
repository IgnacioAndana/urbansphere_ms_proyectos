import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ExcepcionNegocio } from '../../../common/exceptions/excepcion-negocio.exception';
import { S3Servicio } from './s3.service';

jest.mock('@aws-sdk/client-s3', () => {
  const sendMock = jest.fn();
  return {
    S3Client: jest.fn().mockImplementation(() => ({ send: sendMock })),
    PutObjectCommand: jest.fn().mockImplementation((input) => input),
    __sendMock: sendMock,
  };
});

const { __sendMock: sendMock } = jest.requireMock('@aws-sdk/client-s3') as {
  __sendMock: jest.Mock;
};

describe('S3Servicio', () => {
  let servicio: S3Servicio;

  const archivoMock = {
    buffer: Buffer.from('contenido-imagen'),
    originalname: 'foto.jpg',
    mimetype: 'image/jpeg',
  } as Express.Multer.File;

  beforeEach(async () => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({});

    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        S3Servicio,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                'aws.region': 'us-east-1',
                'aws.bucket': 'urbansphere-images',
                'aws.accessKeyId': 'AKIATEST',
                'aws.secretAccessKey': 'secret',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    servicio = modulo.get(S3Servicio);
  });

  it('debe construir URL pública', () => {
    expect(servicio.construirUrlPublica('proyectos/1/galeria/x.jpg')).toBe(
      'https://urbansphere-images.s3.us-east-1.amazonaws.com/proyectos/1/galeria/x.jpg',
    );
  });

  it('debe subir imagen de proyecto a S3', async () => {
    const url = await servicio.subirImagenProyecto(1, archivoMock);

    expect(sendMock).toHaveBeenCalled();
    expect(PutObjectCommand).toHaveBeenCalled();
    expect(url).toContain('proyectos/1/galeria/');
    expect(url).toContain('urbansphere-images.s3.us-east-1.amazonaws.com');
  });

  it('debe subir imagen de tipología a S3', async () => {
    const url = await servicio.subirImagenTipologia(1, 5, archivoMock);
    expect(url).toContain('proyectos/1/tipologias/5/');
  });

  it('debe rechazar archivo vacío', async () => {
    const vacio = { ...archivoMock, buffer: Buffer.alloc(0) } as Express.Multer.File;
    await expect(servicio.subirImagenProyecto(1, vacio)).rejects.toThrow(ExcepcionNegocio);
  });

  it('debe rechazar si faltan credenciales AWS', async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [
        S3Servicio,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'aws.accessKeyId') return '';
              return key === 'aws.bucket' ? 'urbansphere-images' : 'us-east-1';
            }),
          },
        },
      ],
    }).compile();

    const servicioSinCredenciales = modulo.get(S3Servicio);

    await expect(servicioSinCredenciales.subirImagenProyecto(1, archivoMock)).rejects.toThrow(
      ExcepcionNegocio,
    );
  });
});
