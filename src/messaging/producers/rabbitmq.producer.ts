/**
 * Archivo: rabbitmq.producer.ts
 * Ubicación: messaging/producers
 * Tipo: Productor RabbitMQ
 * Contenido: publica eventos de dominio (property.created)
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Channel, ChannelModel } from 'amqplib';
import { PropiedadCreadaEvento } from '../events/propiedad-creada.event';

@Injectable()
export class RabbitmqProductor implements OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqProductor.name);
  private conexion: ChannelModel | null = null;
  private canal: Channel | null = null;

  constructor(private readonly configServicio: ConfigService) {}

  async publicarPropiedadCreada(propiedadId: number): Promise<void> {
    const evento: PropiedadCreadaEvento = {
      event: 'property.created',
      propertyId: propiedadId,
    };

    try {
      await this.asegurarCanal();
      const exchange = this.configServicio.get<string>('rabbitmq.exchange') || 'urbansphere.events';
      const routingKey =
        this.configServicio.get<string>('rabbitmq.routingKeyPropertyCreated') || 'property.created';

      await this.canal!.assertExchange(exchange, 'topic', { durable: true });
      this.canal!.publish(exchange, routingKey, Buffer.from(JSON.stringify(evento)), {
        persistent: true,
        contentType: 'application/json',
      });

      this.logger.log(`Evento publicado: property.created (propiedadId=${propiedadId})`);
    } catch (error) {
      this.logger.warn(
        `No se pudo publicar evento property.created: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  private async asegurarCanal(): Promise<void> {
    if (this.canal) {
      return;
    }

    const url = this.configServicio.get<string>('rabbitmq.url') || 'amqp://guest:guest@localhost:5672';
    this.conexion = await connect(url);
    this.canal = await this.conexion.createChannel();
  }

  async onModuleDestroy(): Promise<void> {
    await this.canal?.close();
    await this.conexion?.close();
  }
}
