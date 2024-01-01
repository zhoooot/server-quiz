import { Module } from '@nestjs/common';
import { DraftService } from './draft.service';
import { DraftController } from './draft.controller';

@Module({
  providers: [DraftService],
  controllers: [DraftController],
})
export class DraftModule {}
