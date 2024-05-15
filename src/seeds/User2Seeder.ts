import type { EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Quiz } from 'src/entities/quiz.entity';

export class User2Seeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const data: RequiredEntityData<Quiz>[] = [
      
      {
        auth_id: '893d0698-8564-4f10-9a7c-aba55dd82a69',
       
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
