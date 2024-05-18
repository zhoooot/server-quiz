import { EntityManager, wrap } from '@mikro-orm/core';
import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { Quiz } from 'src/entities/quiz.entity';
import { GoogleGenerativeAI } from '@google/generative-ai';
export { QuizFromGemini } from './quiz.adapter';
import { QuizAdapter } from './quiz.adapter';
import { QuizDto } from 'src/draft/dtos/quiz.dto';
import { Version } from 'src/entities/version.entity';
import { Question } from 'src/entities/question.entity';
import { Answer } from 'src/entities/answer.entity';
import { v4 as uuidv4 } from 'uuid';
const genAI = new GoogleGenerativeAI('AIzaSyDHkLRg2W5hCNKDxZbjeNIfh7aCNFxus_I');

@Injectable()
export class QuizService {
  constructor(private readonly em: EntityManager) {}

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

  async getQuizById(quiz_id: string, auth_id: string): Promise<Quiz> {
    const quiz = await this.em.findOne(
      Quiz,
      {
        quiz_id,
      },
      {
        populate: true,
      },
    );
    console.log(quiz);
    if (!quiz) {
      throw new NotFoundException();
    }
    if (quiz.auth_id !== auth_id) {
      throw new NotFoundException();
    }

    return quiz;
  }

  async cloneQuizById(quiz_id: string, new_auth_id: string) {
    const quiz = await this.em.findOne(
      Quiz,
      { quiz_id, $not: { published: null } },
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

    new_quiz.published.version_id = undefined;
    new_quiz.published.quiz = undefined;
    new_quiz.published.title = new_quiz.published.title + ' (Clone)';
    new_quiz.published.description =
      new_quiz.published.description + ' (Clone)';

    new_quiz.published.questions.forEach((question) => {
      question.question_id = undefined;
      question.version = undefined;
      question.answers.forEach((answer) => {
        answer.question = undefined;
      });
    });

    const entity = this.em.create(Quiz, new_quiz);
    await this.em.persistAndFlush(entity);

    return entity;
  }

  async generateQuizByGemini(auth_id: string, theme: string, num_quiz: number) {
    console.log(theme);
    const prompt = `Create a quiz about ${theme} with ${num_quiz} questions. Please write out these questions so that they strictly follow the following convention of JSON.  
    {
    "auth_id": ${auth_id};
    "title": string;
    "description": string;
    "num_questions": number;
    "questions": {
      "index": number;
      "question": string;
      "time_limit": number;
      "question_type": number;
      "answers": {
        "index": number;
        "answer": string;
        "is_correct": (true | false);
      }[];
    }[];}

Warning:
Semantics: Each answer should be true, or false. There must be one and only one correct answer.
The 'answer' should not have the prefix.
The 'index' should be in form of (0, 1, 2, 3).
The 'question_type' should be 0 or 1, 0 has four answers, 1 has two answers (true/false question).
If the question is a true/false question, the 'answers' should only have two elements, else the 'answers' should have four elements.
    `;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    // console.log(response.text());
    const text = response
      .text()
      .replace(/```json\s+/, '')
      .replace(/\s+```/, '')
      .replace(/```JSON\s+/, '')
      .replace(/\s+```/, '')
      .replace(/```\s+/, '');

    const quiz = await new QuizAdapter(text);
    const entity = quiz.adaptToQuizEntity();

    // console.log('entity created');
    // const quizEntity = this.em.create(Quiz, entity);
    // await this.em.persistAndFlush(quizEntity);

    // console.log('entity completed');

    return entity;
  }
  async createQuiz(auth_id: string, dto: QuizDto) {
    const quiz = new Quiz();
    if (dto.quiz_id !== undefined) {
      quiz.quiz_id = dto.quiz_id;
    }
    quiz.auth_id = auth_id;
    quiz.created_at = new Date();
    const version = new Version();
    version.version_id = uuidv4();
    version.title = dto.title;
    version.description = dto.description;
    version.version_id = quiz.quiz_id;
    quiz.published = version;
    quiz.published.title = dto.title;
    quiz.published.description = dto.description;
    quiz.published.version_id = version.version_id;
    version.quiz = quiz;
    for (let question of dto.questions) {
      const newQuestion = new Question();
      newQuestion.version = version;
      newQuestion.question_id = newQuestion.question_id;
      newQuestion.question = question.question;
      newQuestion.time = question.time_limit;
      newQuestion.index = question.index;
      for (let answer of question.answers) {
        const newAnswer = new Answer();
        newAnswer.question = newQuestion;
        newAnswer.answer = answer.answer;
        newAnswer.is_correct = answer.is_correct;
        newAnswer.index = answer.index;
        newQuestion.answers.add(newAnswer);
      }
      version.questions.add(newQuestion);
    }
    quiz.published.questions = version.questions;
    const entity = this.em.create(Quiz, quiz);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async updateQuiz(dto: QuizDto) {
    const quiz = await this.em.findOneOrFail(Quiz, { quiz_id: dto.quiz_id });
    if (quiz === null) {
      throw new NotFoundException();
    }
    const version = new Version();
    version.quiz = quiz;
    version.title = dto.title;
    version.description = dto.description;
    version.version_id = uuidv4();
    quiz.quiz_id = dto.quiz_id;
    quiz.auth_id = dto.auth_id;
    quiz.created_at = new Date();
    quiz.published = version;
    quiz.published.title = dto.title;
    quiz.published.description = dto.description;
    quiz.published.version_id = version.version_id;

    for (let question of dto.questions) {
      const newQuestion = new Question();
      newQuestion.version = version;
      newQuestion.question_id = uuidv4();
      newQuestion.index = question.index;
      newQuestion.question = question.question;
      newQuestion.time = question.time_limit;
      for (let answer of question.answers) {
        const newAnswer = new Answer();
        newAnswer.question = newQuestion;
        newAnswer.index = answer.index;
        newAnswer.answer = answer.answer;
        newAnswer.is_correct = answer.is_correct;
        newQuestion.answers.add(newAnswer);
      }
      version.questions.add(newQuestion);
    }
    quiz.published.questions = version.questions;
    await this.em.persistAndFlush(quiz);
    return quiz;
  }
}
