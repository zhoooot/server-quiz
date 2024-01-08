import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { rabbitMqConfig } from 'src/common/configs/rabbitmq.config';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      ...rabbitMqConfig,
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
