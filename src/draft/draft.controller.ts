import {
  HttpException,
  Controller,
  Get,
  Param,
  HttpStatus,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { DraftService } from './draft.service';
import { QuizDto, quizDto } from './dtos/quiz.dto';
import { ZodGuard } from 'src/common/guards/zod.guard';
import { Quiz } from 'src/entities/quiz.entity';

@Controller('draft')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  private formatDraft(quiz: Quiz): QuizDto {
    return {
      quiz_id: quiz.quiz_id,
      auth_id: quiz.auth_id,
      title: quiz.draft.title,
      description: quiz.draft.description,
      num_play_times: quiz.num_play_times,
      is_public: quiz.draft.is_public,
      created_at: quiz.created_at.getTime(),
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

  @Get(':quiz_id')
  async getQuiz(@Param('quiz_id') quiz_id: string): Promise<QuizDto> {
    if (!isUUID(quiz_id)) {
      throw new HttpException('Invalid quiz id', HttpStatus.BAD_REQUEST);
    }

    const quiz = await this.draftService.getDraft(quiz_id);

    if (quiz === null) {
      throw new HttpException('Draft not found', HttpStatus.NOT_FOUND);
    }

    return this.formatDraft(quiz);
  }

  @UseGuards(new ZodGuard(quizDto))
  @Put()
  async updateDraft(@Body() dto: QuizDto): Promise<{
    quiz_id: string;
  }> {
    if (dto.quiz_id === undefined) {
      const quiz = await this.draftService.createDraft(dto);
      return { quiz_id: quiz.quiz_id };
    }

    const quiz = await this.draftService.updateDraft(dto);
    return { quiz_id: quiz.quiz_id };
  }

  @Delete(':quiz_id')
  async deleteQuiz(@Param('quiz_id') quiz_id: string): Promise<void> {
    if (!isUUID(quiz_id)) {
      throw new HttpException('Invalid quiz id', HttpStatus.BAD_REQUEST);
    }

    await this.draftService.deleteDraft(quiz_id);
  }

  @Post(':quiz_id/publish')
  async publishQuiz(@Param('quiz_id') quiz_id: string): Promise<void> {
    if (!isUUID(quiz_id)) {
      throw new HttpException('Invalid quiz id', HttpStatus.BAD_REQUEST);
    }

    await this.draftService.publishDraft(quiz_id);
  }
}
