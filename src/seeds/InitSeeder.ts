import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Quiz } from '../entities/quiz.entity';

export class InitSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const quiz = em.create(Quiz, {
      auth_id: '896ba0ed-da7c-48b6-b079-38df0aacae72',
      num_play_times: 0,
      published: {
        title: 'Final Quiz 1',
        description: 'This is the final quiz',
        is_public: false,
        questions: [
          {
            index: 0,
            question: 'What is the capital of the United States?',
            time: 60000,
            allow_powerups: false,
            answers: [
              {
                index: 0,
                answer: 'New York',
                is_correct: false,
              },
              {
                index: 1,
                answer: 'Washington, D.C.',
                is_correct: true,
              },
              {
                index: 2,
                answer: 'Los Angeles',
                is_correct: false,
              },
              {
                index: 3,
                answer: 'Chicago',
                is_correct: false,
              },
            ],
          },
          {
            index: 1,
            question: 'What is the capital of Canada?',
            time: 60000,
            allow_powerups: false,
          },
        ],
      },
      draft: {
        title: 'Quiz 1',
        description: 'This is the first quiz',
        is_public: true,
        questions: [
          {
            question: 'What is the capital of the United States?',
            index: 0,
            time: 30000,
            allow_powerups: true,
            answers: [
              {
                index: 0,
                answer: 'New York',
                is_correct: false,
              },
              {
                index: 1,
                answer: 'Washington, D.C.',
                is_correct: true,
              },
              {
                index: 2,
                answer: 'Los Angeles',
                is_correct: false,
              },
              {
                index: 3,
                answer: 'Chicago',
                is_correct: false,
              },
            ],
          },
          {
            index: 1,
            question: 'What is the capital of Canada?',
            time: 30000,
            allow_powerups: true,
            answers: [
              {
                index: 0,
                answer: 'Toronto',
                is_correct: false,
              },
              {
                index: 1,
                answer: 'Ottawa',
                is_correct: true,
              },
              {
                index: 2,
                answer: 'Montreal',
                is_correct: false,
              },
              {
                index: 3,
                answer: 'Vancouver',
                is_correct: false,
              },
            ],
          },
        ],
      },
    });

    em.persist(quiz);
  }
}
