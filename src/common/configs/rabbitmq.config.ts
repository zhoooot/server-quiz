import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import 'dotenv/config';

export const rabbitMqConfig: RabbitMQConfig = {
  uri: process.env.RABBITMQ_URL,
};
