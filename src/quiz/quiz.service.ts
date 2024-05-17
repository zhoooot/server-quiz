import { EntityManager, wrap } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from 'src/entities/quiz.entity';
import { GoogleGenerativeAI } from '@google/generative-ai';
export { QuizFromGemini } from './quiz.adapter';
import { QuizAdapter } from './quiz.adapter';
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
      { quiz_id, $not: { published: null }},
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
    auth_id: ${auth_id};
    title: string;
    description?: string;
    num_questions: number;
    questions: {
      index: number;
      question: string;
      time_limit: number;
      question_type: number;
      answers: {
        index: number;
        answer: string;
        is_correct: boolean;
      }[];
    }[];}
    The 'answer' should not have the prefix.
The 'index' should be in form of (0, 1, 2, 3).
'question_type' should be 0 or 1, 0 has four answers, 1 has two answers (true/false question).
If the question is a true/false question, the 'answers' should only have two elements, else 
the 'answers' should have four elements.
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const result = await model.generateContent(prompt);
    const response = await result.response;
  console.log(response.text());
    const text= response.text().replace(/```json\s+/, '').replace(/\s+```/, '').replace(/```JSON\s+/, '').replace(/\s+```/, '').replace(/```\s+/, '');

    const quiz = await new QuizAdapter(text);
    const entity=quiz.adaptToQuizEntity();
   

    console.log('entity completed');
    
    return entity;
  }
}
