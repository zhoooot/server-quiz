import 'dotenv/config';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

export const rabbitMqConfig: RabbitMQConfig = {
  uri: process.env.RABBITMQ_URL,
};
