import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Question } from './question.entity';

@Entity()
export class Answer {
  @ManyToOne(() => Question, {
    primary: true,
    name: 'question_id',
    onDelete: 'cascade',
  })
  question: Question;

  @PrimaryKey()
  index: number;

  @Property()
  answer: string;

  @Property()
  is_correct: boolean;
}
