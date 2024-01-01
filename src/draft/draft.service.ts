import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Quiz } from 'src/entities/quiz.entity';
import { QuizDto } from './dtos/quiz.dto';
import { Version } from 'src/entities/version.entity';
import { Question } from 'src/entities/question.entity';
import { Answer } from 'src/entities/answer.entity';

@Injectable()
export class DraftService {
  constructor(private readonly em: EntityManager) {}

  async getDraft(quiz_id: string) {
    return await this.em.findOne(
      Quiz,
      {
        quiz_id,
        $not: { draft: null },
      },
      {
        populate: true,
      },
    );
  }

  async createDraft(dto: QuizDto) {
    const quiz = new Quiz();

    if (dto.quiz_id !== undefined) {
      quiz.quiz_id = dto.quiz_id;
    }

    quiz.auth_id = dto.auth_id;
    quiz.num_play_times = dto.num_play_times;

    const draft = new Version();
    draft.title = dto.title;
    draft.description = dto.description;
    draft.is_public = dto.is_public;
    draft.quiz = quiz;
    quiz.draft = draft;

    draft.questions.set(
      dto.questions.map((question) => {
        const q = new Question();

        q.index = question.index;
        q.question = question.question;
        q.time = question.time_limit;
        q.allow_powerups = question.allow_powerups;
        q.version = draft;

        q.answers.set(
          question.answers.map((answer) => {
            const a = new Answer();

            a.index = answer.index;
            a.answer = answer.answer;
            a.is_correct = answer.is_correct;
            a.question = q;

            return a;
          }),
        );

        return q;
      }),
    );

    await this.em.persistAndFlush(quiz);
    return quiz;
  }

  async updateDraft(dto: QuizDto) {
    const quiz = await this.em.findOne(
      Quiz,
      { quiz_id: dto.quiz_id },
      { populate: true },
    );

    if (quiz === null) {
      throw new HttpException('Quiz not found', HttpStatus.BAD_REQUEST);
    }

    quiz.draft = quiz.draft ?? new Version();

    const draft = quiz.draft;
    draft.title = dto.title;
    draft.description = dto.description;
    draft.is_public = dto.is_public;
    draft.quiz = quiz;

    await this.em.nativeDelete(Question, { version: draft });

    draft.questions.set(
      dto.questions.map((question) => {
        const q = new Question();

        q.index = question.index;
        q.question = question.question;
        q.time = question.time_limit;
        q.allow_powerups = question.allow_powerups;
        q.version = draft;

        q.answers.set(
          question.answers.map((answer) => {
            const a = new Answer();

            a.index = answer.index;
            a.answer = answer.answer;
            a.is_correct = answer.is_correct;
            a.question = q;

            return a;
          }),
        );

        return q;
      }),
    );

    await this.em.persistAndFlush(quiz);
    return quiz;
  }

  async deleteDraft(quiz_id: string) {
    const quiz = await this.em.findOneOrFail(
      Quiz,
      { quiz_id },
      { populate: true },
    );

    if (quiz.draft === null) {
      return;
    }

    this.em.remove(quiz.draft);

    quiz.draft = null;

    if (quiz.published === null) {
      this.em.remove(quiz);
    }

    await this.em.flush();
  }

  async publishDraft(quiz_id: string) {
    const quiz = await this.em.findOneOrFail(
      Quiz,
      { quiz_id },
      { populate: true },
    );

    if (quiz.draft === null) {
      return;
    }

    if (quiz.published !== null) {
      await this.em.nativeDelete(Version, {
        version_id: quiz.published.version_id,
      });
    }

    quiz.published = quiz.draft;
    quiz.draft = null;

    await this.em.persistAndFlush(quiz);
  }
}
