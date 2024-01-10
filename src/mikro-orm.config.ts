import 'dotenv/config';
import { Options } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { Version } from './entities/version.entity';

export const config: Options = {
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  entities: [Quiz, Question, Answer, Version],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  seeder: {
    path: 'dist/seeds',
    pathTs: 'src/seeds',
  },
  pool: {
    max: 3,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 10000,
  },
  extensions: [SeedManager],
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

export default config;
