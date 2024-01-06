import { Module } from '@nestjs/common';
import { config } from './mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DraftModule } from './draft/draft.module';
import { QuizModule } from './quiz/quiz.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    DraftModule,
    QuizModule,
    RabbitmqModule,
  ],
})
export class AppModule {}
