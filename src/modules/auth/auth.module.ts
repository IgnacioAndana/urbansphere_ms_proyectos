/**
 * Archivo: auth.module.ts
 * Ubicación: modules/auth
 * Tipo: Módulo NestJS
 * Contenido: validación JWT (tokens emitidos por MS Users)
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from '../../config/jwt.config';
import { AutenticacionServicio } from './services/autenticacion.service';
import { UsuariosRepositorio } from './repositories/usuarios.repository';
import { UsuarioEntidad } from './entities/usuario.entity';
import { EstrategiaJwt } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      inject: [ConfigService],
      useFactory: (configServicio: ConfigService) => ({
        secret: configServicio.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configServicio.get<string>('jwt.accessExpiresIn'),
        },
      }),
    }),
    TypeOrmModule.forFeature([UsuarioEntidad]),
  ],
  providers: [AutenticacionServicio, UsuariosRepositorio, EstrategiaJwt],
  exports: [AutenticacionServicio, PassportModule, JwtModule],
})
export class AuthModule {}
