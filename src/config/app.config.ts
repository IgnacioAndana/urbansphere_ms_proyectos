import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  httpLogging: process.env.HTTP_LOGGING !== 'false',
}));
