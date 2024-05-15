import { Module } from '@nestjs/common';
import { config } from './mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { QuizModule } from './quiz/quiz.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    QuizModule,
    RabbitmqModule,
  ],
})
export class AppModule {}
