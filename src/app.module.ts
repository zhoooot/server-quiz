import { Module } from '@nestjs/common';
import { config } from './mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DraftModule } from './draft/draft.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [MikroOrmModule.forRoot(config), DraftModule, QuizModule],
})
export class AppModule {}
