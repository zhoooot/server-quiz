import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Version } from './version.entity';

@Entity()
export class Quiz {
  @PrimaryKey({ type: 'uuid' })
  quiz_id: string = uuidv4();

  @Property({ type: 'uuid' })
  auth_id: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  created_at: Date;

  @Property({ default: 0 })
  num_play_times: number;

  @OneToOne({ entity: () => Version, inversedBy: 'quiz', nullable: true })
  draft: Version;

  @OneToOne({ entity: () => Version, inversedBy: 'quiz', nullable: true })
  published: Version;
}
