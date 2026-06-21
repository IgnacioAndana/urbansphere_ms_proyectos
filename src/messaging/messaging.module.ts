/**
 * Archivo: messaging.module.ts
 * Ubicación: messaging
 * Tipo: Módulo NestJS
 * Contenido: productores RabbitMQ para eventos de dominio
 */

import { Module } from '@nestjs/common';
import { RabbitmqProductor } from './producers/rabbitmq.producer';

@Module({
  providers: [RabbitmqProductor],
  exports: [RabbitmqProductor],
})
export class MessagingModule {}
