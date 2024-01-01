import { Module } from '@nestjs/common';
import { config } from './mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DraftModule } from './draft/draft.module';

@Module({
  imports: [MikroOrmModule.forRoot(config), DraftModule],
})
export class AppModule {}
