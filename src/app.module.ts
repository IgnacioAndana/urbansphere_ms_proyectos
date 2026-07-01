import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import rabbitmqConfig from './config/rabbitmq.config';
import awsConfig from './config/aws.config';
import appConfig from './config/app.config';
import { FiltroExcepcionesHttp } from './common/filters/filtro-excepciones-http.filter';
import { FormatearFechasInterceptor } from './common/interceptors/formatear-fechas.interceptor';
import { LoggingHttpInterceptor } from './common/interceptors/logging-http.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectImagesModule } from './modules/project-images/project-images.module';
import { MessagingModule } from './messaging/messaging.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, rabbitmqConfig, awsConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configServicio: ConfigService) => ({
        ...configServicio.get('database'),
      }),
    }),
    AuthModule,
    MessagingModule,
    StorageModule,
    ProjectsModule,
    ProjectImagesModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: FiltroExcepcionesHttp },
    { provide: APP_INTERCEPTOR, useClass: FormatearFechasInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingHttpInterceptor },
  ],
})
export class AppModule {}
