import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class DraftService {
  constructor(private readonly em: EntityManager) {}
}
