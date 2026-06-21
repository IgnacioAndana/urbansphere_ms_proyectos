import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'urbansphere.events',
  routingKeyPropertyCreated: 'property.created',
}));
