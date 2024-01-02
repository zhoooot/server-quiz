import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from 'src/entities/quiz.entity';
import { QuizReturnDto } from './dtos/quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  private fromQuizToQuizReturnDto(quiz: Quiz): QuizReturnDto {
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
      description: published.description,
      questions: published.questions.map((question) => ({
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

  @Get('/public')
  async getPublicQuiz(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const quizList = await this.quizService.getPublicQuiz(page, limit);

    return quizList.map((quiz) => this.fromQuizToQuizReturnDto(quiz));
  }

  @Get()
  async getQuizByUserId(
    @Query('auth_id') auth_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const quizList = await this.quizService.getQuizOfUser(auth_id, page, limit);

    return quizList.map((quiz) => this.fromQuizToQuizReturnDto(quiz));
  }

  @Get(':id')
  async getQuizById(@Param('id') quiz_id: string) {
    const quiz = await this.quizService.getQuizById(quiz_id);

    return this.fromQuizToQuizReturnDto(quiz);
  }

  @Delete(':id')
  async deleteQuizById(@Param('id') quiz_id: string) {
    await this.quizService.deleteQuizById(quiz_id);
  }

  @Post(':id/clone')
  async cloneQuizById(
    @Param('id') quiz_id: string,
    @Query('auth_id') auth_id: string,
  ) {
    const quiz = await this.quizService.cloneQuizById(quiz_id, auth_id);
    return this.fromQuizToQuizReturnDto(quiz);
  }
}
