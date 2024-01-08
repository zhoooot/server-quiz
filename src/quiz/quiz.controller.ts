import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { QuizService } from './quiz.service';
import { Quiz } from 'src/entities/quiz.entity';
import { QuizReturnDto } from './dtos/quiz.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  private fromQuizToQuizReturnDto(quiz: Quiz): QuizReturnDto {
    if (quiz === null) {
      return null;
    }

    const { quiz_id, auth_id, created_at, num_play_times, published } = quiz;

    return {
      quiz_id,
      auth_id,
      created_at: created_at.getTime(),
      num_play_times,
      is_public: published.is_public,
      num_questions: published.questions.length,
      has_draft: quiz.draft !== null,
      title: published.title,
      image: published.image,
      description: published.description,
      questions: published.questions
        .map((question) => ({
          index: question.index,
          question: question.question,
          time_limit: question.time,
          allow_powerups: question.allow_powerups,
          image: question.image,
          answers: question.answers
            .map((answer) => ({
              index: answer.index,
              answer: answer.answer,
              is_correct: answer.is_correct,
            }))
            .sort((a, b) => a.index - b.index),
        }))
        .sort((a, b) => a.index - b.index),
    };
  }

  @Get('/public')
  async getPublicQuiz(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const quizList = await this.quizService.getPublicQuiz(page, limit);

    return quizList.map((quiz) => this.fromQuizToQuizReturnDto(quiz));
  }

  @UseGuards(JwtGuard)
  @Get()
  async getQuizByUserId(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request,
  ) {
    const { auth_id } = request.user;

    if (!isUUID(auth_id)) {
      throw new BadRequestException('Invalid auth_id');
    }

    const quizList = await this.quizService.getQuizOfUser(auth_id, page, limit);

    return quizList.map((quiz) => this.fromQuizToQuizReturnDto(quiz));
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getQuizById(@Param('id') quiz_id: string) {
    if (!isUUID(quiz_id)) {
      throw new BadRequestException('Invalid quiz_id');
    }

    const quiz = await this.quizService.getQuizById(quiz_id);
    return this.fromQuizToQuizReturnDto(quiz);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteQuizById(@Param('id') quiz_id: string) {
    if (!isUUID(quiz_id)) {
      throw new BadRequestException('Invalid quiz_id');
    }

    await this.quizService.deleteQuizById(quiz_id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/clone')
  async cloneQuizById(
    @Param('id') quiz_id: string,
    @Query('auth_id') auth_id: string,
    @Req() request,
  ) {
    if (!isUUID(quiz_id) || !isUUID(auth_id)) {
      throw new BadRequestException('Invalid quiz_id or auth_id');
    }

    const { auth_id: auth_id_from_token } = request.user;

    if (auth_id_from_token !== auth_id) {
      throw new BadRequestException('Invalid auth_id');
    }

    const quiz = await this.quizService.cloneQuizById(quiz_id, auth_id);
    return this.fromQuizToQuizReturnDto(quiz);
  }
}
