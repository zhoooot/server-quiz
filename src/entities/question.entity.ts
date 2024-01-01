import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Version } from './version.entity';
import { Answer } from './answer.entity';

@Entity()
@Unique({ properties: ['version', 'index'] })
export class Question {
  @ManyToOne(() => Version, {
    name: 'version_id',
    onDelete: 'cascade',
  })
  version: Version;

  @PrimaryKey({ type: 'uuid' })
  question_id: string;

  @Property()
  index: number;

  @Property({ type: 'text' })
  question: string;

  @Property()
  time: number;

  @Property()
  allow_powerups: boolean;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
