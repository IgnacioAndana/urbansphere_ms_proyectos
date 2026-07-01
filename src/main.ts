import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('UrbanSphere - MS Proyectos')
    .setDescription(
      'Microservicio de catálogo comercial: proyectos inmobiliarios e imágenes (S3). Roles: admin/agent CRUD, user consulta activos.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documento);

  const puerto = process.env.PORT || 3002;
  await app.listen(puerto);
  console.log(`MS Proyectos en http://localhost:${puerto}`);
  console.log(`Swagger: http://localhost:${puerto}/api/docs`);
}

bootstrap();
