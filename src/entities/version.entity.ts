import {
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Quiz } from './quiz.entity';
import { v4 as uuidv4 } from 'uuid';
import { Question } from './question.entity';

@Entity()
export class Version {
  @OneToOne({ entity: () => Quiz, name: 'quiz_id', onDelete: 'cascade' })
  quiz: Quiz;

  @PrimaryKey({ type: 'uuid' })
  version_id: string = uuidv4();

  @Property({ type: 'text' })
  title: string;

  @Property({ type: 'text', nullable: true })
  description: string;

  @Property({ default: false })
  is_public: boolean;

  @OneToMany({ entity: () => Question, mappedBy: 'version' })
  questions: Question[];
}
