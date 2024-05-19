import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
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
  question_id: string = uuidv4();

  @Property()
  index: number;

  @Property({ type: 'text' })
  question: string;

  @Property({ nullable: true })
  image?: string;

  @Property()
  time: number;



  @OneToMany(() => Answer, (answer) => answer.question)
  answers = new Collection<Answer>(this);

  
}
