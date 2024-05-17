import type { EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Quiz } from 'src/entities/quiz.entity';

export class User1Seeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const data: RequiredEntityData<Quiz>[] = [
      
      {
        quiz_id: 'f1b3b3b1-0b3b-4b3b-8b3b-0b3b3b3b3b3b',
        auth_id: '7070afde-f8b5-487e-a288-f2be9d162b0b',
        created_at: new Date(),
        published: {
          title: 'Software Engineering Basics',
          description:
            'A quiz to test your knowledge of fundamental software engineering concepts',
          questions: [
            {
              index: 0,
              question:
                'What is the primary purpose of version control systems in software development?',
              time: 60000,
              answers: [
                { index: 0, answer: 'Code optimization', is_correct: false },
                { index: 1, answer: 'Code documentation', is_correct: false },
                { index: 2, answer: 'Code collaboration', is_correct: true },
                { index: 3, answer: 'Code compilation', is_correct: false },
              ],
            },
            {
              index: 1,
              question:
                'Which programming language is commonly used for developing mobile applications for iOS devices?',
              time: 30000,
              answers: [
                { index: 0, answer: 'Java', is_correct: false },
                { index: 1, answer: 'Swift', is_correct: true },
                { index: 2, answer: 'Python', is_correct: false },
                { index: 3, answer: 'Kotlin', is_correct: false },
              ],
            },
            {
              index: 2,
              question:
                'What does the term "API" stand for in the context of software development?',
              time: 45000,
              answers: [
                {
                  index: 0,
                  answer: 'Application Programming Interface',
                  is_correct: true,
                },
                {
                  index: 1,
                  answer: 'Advanced Programming Interface',
                  is_correct: false,
                },
                {
                  index: 2,
                  answer: 'Automated Programming Interface',
                  is_correct: false,
                },
                {
                  index: 3,
                  answer: 'Application Process Interface',
                  is_correct: false,
                },
              ],
            },
            {
              index: 3,
              question:
                'In object-oriented programming, what is the concept of bundling data and methods within a single unit called?',
              time: 60000,
              answers: [
                { index: 0, answer: 'Abstraction', is_correct: false },
                { index: 1, answer: 'Encapsulation', is_correct: true },
                { index: 2, answer: 'Polymorphism', is_correct: false },
                { index: 3, answer: 'Inheritance', is_correct: false },
              ],
            },
            {
              index: 4,
              question:
                'What is the purpose of the "Model-View-Controller (MVC)" architectural pattern in software development?',
              time: 30000,
              answers: [
                {
                  index: 0,
                  answer: 'User interface design',
                  is_correct: false,
                },
                { index: 1, answer: 'Database management', is_correct: false },
                {
                  index: 2,
                  answer: 'Code organization and separation of concerns',
                  is_correct: true,
                },
                {
                  index: 3,
                  answer: 'Network communication',
                  is_correct: false,
                },
              ],
            },
          ],
        },
        
      },
    ];

    data.forEach((element) => {
      em.persist(element);
    });

    await em.flush();
  }
}
