/**
 * Archivo: proyectos.e2e-spec.ts
 * Ubicación: test
 * Tipo: Pruebas end-to-end
 * Contenido: crear, obtener y actualizar proyecto (requiere JWT de MS Users)
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Proyectos (e2e)', () => {
  let app: INestApplication;
  let tokenAcceso: string;
  let proyectoId: number;

  beforeAll(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modulo.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    tokenAcceso = process.env.E2E_JWT_TOKEN || '';
  });

  afterAll(async () => {
    await app.close();
  });

  const authHeader = () =>
    tokenAcceso ? { Authorization: `Bearer ${tokenAcceso}` } : {};

  it('POST /proyectos — crear proyecto (JWT)', async () => {
    if (!tokenAcceso) {
      console.warn('E2E_JWT_TOKEN no definido — omitiendo prueba autenticada');
      return;
    }

    const respuesta = await request(app.getHttpServer())
      .post('/proyectos')
      .set(authHeader())
      .send({
        titulo: `Proyecto E2E ${Date.now()}`,
        direccion: 'Av. Test 123',
        comuna: 'Santiago',
        tipo: 'departamento',
        estado: 'borrador',
      })
      .expect(201);

    expect(respuesta.body.titulo).toBeDefined();
    expect(respuesta.body.slug).toBeDefined();
    proyectoId = respuesta.body.id;
  });

  it('GET /proyectos/:id — obtener proyecto (JWT)', async () => {
    if (!tokenAcceso || !proyectoId) return;

    const respuesta = await request(app.getHttpServer())
      .get(`/proyectos/${proyectoId}`)
      .set(authHeader())
      .expect(200);

    expect(respuesta.body.id).toBe(proyectoId);
  });

  it('PATCH /proyectos/:id — actualizar proyecto (JWT)', async () => {
    if (!tokenAcceso || !proyectoId) return;

    const respuesta = await request(app.getHttpServer())
      .patch(`/proyectos/${proyectoId}`)
      .set(authHeader())
      .send({ estado: 'activo' })
      .expect(200);

    expect(respuesta.body.estado).toBe('activo');
  });

  it('GET /proyectos — público sin JWT retorna 200', () => {
    return request(app.getHttpServer()).get('/proyectos').expect(200);
  });
});
