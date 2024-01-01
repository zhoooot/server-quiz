import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('/public')
  async getPublicQuiz(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const quizList = await this.quizService.getPublicQuiz(page, limit);

    return quizList.map((quiz) =>
      this.quizService.fromQuizToQuizReturnDto(quiz),
    );
  }

  @Get()
  async getQuizByUserId(
    @Query('auth_id') auth_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const quizList = await this.quizService.getQuizOfUser(auth_id, page, limit);

    return quizList.map((quiz) =>
      this.quizService.fromQuizToQuizReturnDto(quiz),
    );
  }

  @Get(':id')
  async getQuizById(@Param('id') quiz_id: string) {
    const quiz = await this.quizService.getQuizById(quiz_id);

    return this.quizService.fromQuizToQuizReturnDto(quiz);
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
    await this.quizService.cloneQuizById(quiz_id, auth_id);
  }
}
