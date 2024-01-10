import type { EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Quiz } from 'src/entities/quiz.entity';

export class User2Seeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const data: RequiredEntityData<Quiz>[] = [
      {
        auth_id: '893d0698-8564-4f10-9a7c-aba55dd82a69', // Updated auth_id
        num_play_times: 0,
        draft: {
          title: 'Taylor Swift Fan Quiz',
          description:
            'Test your knowledge about Taylor Swift with these fun questions!',
          is_public: true,
          questions: [
            {
              index: 0,
              question: "What is Taylor Swift's full name?",
              time: 60000,
              allow_powerups: false,
              answers: [
                { index: 0, answer: 'Taylor Alison Swift', is_correct: true },
                { index: 1, answer: 'Taylor Marie Swift', is_correct: false },
                {
                  index: 2,
                  answer: 'Taylor Elizabeth Swift',
                  is_correct: false,
                },
                { index: 3, answer: 'Taylor Nicole Swift', is_correct: false },
              ],
            },
            {
              index: 1,
              question: 'Which album features the song "Love Story"?',
              time: 30000,
              allow_powerups: false,
              answers: [
                { index: 0, answer: 'Red', is_correct: false },
                { index: 1, answer: 'Fearless', is_correct: true },
                { index: 2, answer: '1989', is_correct: false },
                { index: 3, answer: 'Speak Now', is_correct: false },
              ],
            },
            {
              index: 2,
              question:
                'In what year did Taylor Swift release her debut album?',
              time: 45000,
              allow_powerups: true,
              answers: [
                { index: 0, answer: '2006', is_correct: true },
                { index: 1, answer: '2007', is_correct: false },
                { index: 2, answer: '2008', is_correct: false },
                { index: 3, answer: '2009', is_correct: false },
              ],
            },
            {
              index: 3,
              question:
                'Which Taylor Swift album won the Album of the Year Grammy Award?',
              time: 60000,
              allow_powerups: false,
              answers: [
                { index: 0, answer: 'Fearless', is_correct: true },
                { index: 1, answer: '1989', is_correct: false },
                { index: 2, answer: 'Red', is_correct: false },
                { index: 3, answer: 'Speak Now', is_correct: false },
              ],
            },
            {
              index: 4,
              question: "What is Taylor Swift's record label?",
              time: 30000,
              allow_powerups: false,
              answers: [
                { index: 0, answer: 'Columbia Records', is_correct: false },
                {
                  index: 1,
                  answer: 'Universal Music Group',
                  is_correct: false,
                },
                { index: 2, answer: 'Big Machine Records', is_correct: true },
                { index: 3, answer: 'Atlantic Records', is_correct: false },
              ],
            },
          ],
        },
      },
      {
        auth_id: '893d0698-8564-4f10-9a7c-aba55dd82a69',
        num_play_times: 0,
        draft: {
          title: 'Cardi B Fan Quiz (Draft)',
          description: 'A draft quiz to test your knowledge about Cardi B',
          is_public: false,
          questions: [
            {
              index: 0,
              question: "What is Cardi B's birthplace?",
              time: 45000,
              allow_powerups: true,
              answers: [
                { index: 0, answer: 'Bronx, New York', is_correct: true },
                { index: 1, answer: 'Atlanta, Georgia', is_correct: false },
                { index: 2, answer: 'Miami, Florida', is_correct: false },
                {
                  index: 3,
                  answer: 'Los Angeles, California',
                  is_correct: false,
                },
              ],
            },
          ],
        },
        published: {
          title: 'Nicki Minaj Fan Quiz',
          description:
            'Test your knowledge about Nicki Minaj with this fun question!',
          is_public: true,
          questions: [
            {
              index: 0,
              question: "What is Nicki Minaj's real name?",
              time: 60000,
              allow_powerups: false,
              answers: [
                { index: 0, answer: 'Onika Tanya Maraj', is_correct: true },
                {
                  index: 1,
                  answer: 'Belcalis Marlenis Almánzar',
                  is_correct: false,
                },
                {
                  index: 2,
                  answer: 'Aubrey Drake Graham',
                  is_correct: false,
                },
                {
                  index: 3,
                  answer: 'Robyn Rihanna Fenty',
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
