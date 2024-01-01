import {
  HttpException,
  Controller,
  Get,
  Param,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { DraftService } from './draft.service';
import { QuizDto } from './dtos/quiz.dto';

@Controller('draft')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Get(':quiz_id')
  async getQuiz(@Param('quiz_id') quiz_id: string): Promise<QuizDto> {
    const quiz = await this.draftService.getDraft(quiz_id);

    if (quiz === null) {
      throw new HttpException('Quiz not found', HttpStatus.BAD_REQUEST);
    }

    return {
      quiz_id: quiz.quiz_id,
      auth_id: quiz.auth_id,
      title: quiz.draft.title,
      description: quiz.draft.description,
      num_play_times: quiz.num_play_times,
      is_public: quiz.draft.is_public,
      created_at: quiz.created_at.toISOString(),
      questions: quiz.draft.questions.map((question) => ({
        index: question.index,
        question: question.question,
        time_limit: question.time,
        allow_powerups: question.allow_powerups,
        answers: question.answers.map((answer) => ({
          index: answer.index,
          answer: answer.answer,
          is_correct: answer.is_correct,
        })),
      })),
    };
  }

  @Post()
  async updateQuiz(@Body() dto: QuizDto): Promise<{
    quiz_id: string;
  }> {
    if (dto.quiz_id === undefined) {
      const quiz = await this.draftService.createDraft(dto);
      return { quiz_id: quiz.quiz_id };
    }

    const quiz = await this.draftService.updateDraft(dto);
    return { quiz_id: quiz.quiz_id };
  }
}
