import 'dotenv/config';
import { Options } from '@mikro-orm/postgresql';
import { Quiz } from './entities/quiz.entity';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export const config: Options = {
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  entities: [Quiz],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: '/dist/migrations',
    pathTs: '/src/migrations',
  },
};

export default config;
