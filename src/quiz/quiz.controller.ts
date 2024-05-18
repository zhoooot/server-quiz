import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Put,
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
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { QuizDto } from 'src/draft/dtos/quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  private fromQuizToQuizReturnDto(quiz: Quiz): QuizReturnDto {
    if (quiz === null) {
      return null;
    }

    const { quiz_id, auth_id, created_at, published } = quiz;

    return {
      quiz_id,
      auth_id,
      created_at: created_at.getTime(),
      
      num_questions: published.questions.length,
      title: published.title,
      description: published.description,
      questions: published.questions
        .map((question) => ({
          index: question.index,
          question: question.question,
          time_limit: question.time,
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
    console.log('request all user quiz');
    // console.log(request);
    const { auth_id } = request.user;
    //const auth_id = '7070afde-f8b5-487e-a288-f2be9d162b0b';

    if (!isUUID(auth_id)) {
      throw new BadRequestException('Invalid auth_id');
    }

    const quizList = await this.quizService.getQuizOfUser(auth_id, page, limit);

    return quizList.map((quiz) => this.fromQuizToQuizReturnDto(quiz));
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getQuizById(@Param('id') quiz_id: string, @Req() request) {
    
    if (!isUUID(quiz_id)) {
      throw new BadRequestException('Invalid quiz_id');
    }
    console.log(request.user);
    const {auth_id} = request.user;
    //const auth_id  = '7070afde-f8b5-487e-a288-f2be9d162b0b';
    console.log(quiz_id);

    const quiz = await this.quizService.getQuizById(quiz_id, auth_id);
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
  async cloneQuizById(@Param('id') quiz_id: string, @Req() request) {
    if (!isUUID(quiz_id)) {
      throw new BadRequestException('Invalid quiz_id');
    }
    // const auth_id = '7070afde-f8b5-487e-a288-f2be9d162b0b';
    const { auth_id } = request.user;

    const quiz = await this.quizService.cloneQuizById(quiz_id, auth_id);
    return this.fromQuizToQuizReturnDto(quiz);
  }

  @UseGuards(JwtGuard)
  @Post(':id/start')
  async startQuizById(@Param('id') quiz_id: string, @Req() request) {
    if (!isUUID(quiz_id)) {
      throw new BadRequestException('Invalid quiz_id');
    }
    //const auth_id = '7070afde-f8b5-487e-a288-f2be9d162b0b';
    const { auth_id } = request.user;

    const quiz = await this.quizService.getQuizById(quiz_id, auth_id);

    const rawDto = this.fromQuizToQuizReturnDto(quiz);

    if (quiz === null) {
      throw new BadRequestException('Quiz not found');
    }

    const resource = await this.amqpConnection.request({
      exchange: 'game',
      routingKey: 'game.create',
      payload: { rawDto },
      timeout: 10000,
    });
    return resource;
  }

  @UseGuards(JwtGuard)
  @Post('/gemini')
  async generateQuizByGemini(
    @Query('theme') theme: string,
    @Query('num') num_quiz: number,
    @Req() request,
  ) {
    console.log(theme);

    const {auth_id} = request.user;
    //const auth_id = '7070afde-f8b5-487e-a288-f2be9d162b0b';
    const quiz = await this.quizService.generateQuizByGemini(
      auth_id,
      theme,
      num_quiz,
    );

    return this.fromQuizToQuizReturnDto(quiz);
  }

  @UseGuards(JwtGuard)
  @Post('/create')
  async createQuiz(@Body() dto: QuizDto, @Req() request) {
    const { auth_id } = request.user;
    //const auth_id = '7070afde-f8b5-487e-a288-f2be9d162b0b';
    const quiz = await this.quizService.createQuiz(auth_id, dto);
   return this.fromQuizToQuizReturnDto(quiz);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async updateQuiz(@Param('id') quiz_id: string, @Body() dto: QuizDto) {
    console.log("Updating quiz" + quiz_id);
    if (!isUUID(quiz_id)) {
      throw new BadRequestException('Invalid quiz_id');
    }

    const quiz = await this.quizService.updateQuiz(dto);
    return this.fromQuizToQuizReturnDto(quiz);
  }
}
