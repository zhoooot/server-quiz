import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';

@Module({
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
