import { EntityManager, wrap } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/entities/quiz.entity';
import { QuizReturnDto } from './dtos/quiz.dto';

@Injectable()
export class QuizService {
  constructor(private readonly em: EntityManager) {}

  fromQuizToQuizReturnDto(quiz: Quiz): QuizReturnDto {
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

  async getPublicQuiz(page?: number, limit?: number): Promise<Quiz[]> {
    const list = await this.em.find(
      Quiz,
      {
        $not: { published: null },
      },
      {
        populate: true,
        limit,
        offset: page * limit,
      },
    );

    if (list.length === 0) {
      return [];
    }

    return list;
  }

  async deleteQuizById(quiz_id: string): Promise<void> {
    await this.em.removeAndFlush(
      await this.em.findOneOrFail(Quiz, { quiz_id }),
    );
  }

  async getQuizOfUser(
    auth_id: string,
    page?: number,
    limit?: number,
  ): Promise<Quiz[]> {
    const list = await this.em.find(
      Quiz,
      {
        auth_id,
        $not: { published: null },
      },
      {
        populate: true,
        limit,
        offset: page * limit,
      },
    );

    if (list.length === 0) {
      return [];
    }

    return list;
  }

  async getQuizById(quiz_id: string): Promise<Quiz> {
    return await this.em.findOne(
      Quiz,
      {
        quiz_id,
        $not: { published: null },
      },
      {
        populate: true,
      },
    );
  }

  async cloneQuizById(quiz_id: string, new_auth_id: string) {
    const quiz = await this.em.findOne(
      Quiz,
      { quiz_id, $not: { published: null }, published: { is_public: true } },
      {
        populate: true,
      },
    );

    if (!quiz) {
      throw new NotFoundException();
    }

    const new_quiz = wrap(quiz).toPOJO();

    new_quiz.quiz_id = undefined;
    new_quiz.auth_id = new_auth_id;
    new_quiz.created_at = new Date();
    new_quiz.num_play_times = 0;

    new_quiz.published.version_id = undefined;
    new_quiz.published.quiz = undefined;
    new_quiz.published.title = new_quiz.published.title + ' (Clone)';
    new_quiz.published.description =
      new_quiz.published.description + ' (Clone)';
    new_quiz.published.is_public = false;

    new_quiz.published.questions.forEach((question) => {
      question.question_id = undefined;
      question.version = undefined;
      question.answers.forEach((answer) => {
        answer.question = undefined;
      });
    });

    new_quiz.draft = null;

    const entity = this.em.create(Quiz, new_quiz);
    await this.em.persistAndFlush(entity);

    return entity;
  }
}
