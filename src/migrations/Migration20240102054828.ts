import { Migration } from '@mikro-orm/migrations';

export class Migration20240102054828 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "quiz" ("quiz_id" uuid not null, "auth_id" uuid not null, "created_at" timestamptz(0) not null, "num_play_times" int not null default 0, "draft_version_id" uuid null, "published_version_id" uuid null, constraint "quiz_pkey" primary key ("quiz_id"));',
    );
    this.addSql(
      'alter table "quiz" add constraint "quiz_draft_version_id_unique" unique ("draft_version_id");',
    );
    this.addSql(
      'alter table "quiz" add constraint "quiz_published_version_id_unique" unique ("published_version_id");',
    );

    this.addSql(
      'create table "version" ("version_id" uuid not null, "quiz_id" uuid not null, "title" text not null, "description" text null, "is_public" boolean not null default false, constraint "version_pkey" primary key ("version_id"));',
    );

    this.addSql(
      'create table "question" ("question_id" uuid not null, "version_id" uuid not null, "index" int not null, "question" text not null, "time" int not null, "allow_powerups" boolean not null, constraint "question_pkey" primary key ("question_id"));',
    );
    this.addSql(
      'alter table "question" add constraint "question_version_id_index_unique" unique ("version_id", "index");',
    );

    this.addSql(
      'create table "answer" ("question_id" uuid not null, "index" int not null, "answer" varchar(255) not null, "is_correct" boolean not null, constraint "answer_pkey" primary key ("question_id", "index"));',
    );

    this.addSql(
      'alter table "quiz" add constraint "quiz_draft_version_id_foreign" foreign key ("draft_version_id") references "version" ("version_id") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "quiz" add constraint "quiz_published_version_id_foreign" foreign key ("published_version_id") references "version" ("version_id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "version" add constraint "version_quiz_id_foreign" foreign key ("quiz_id") references "quiz" ("quiz_id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "question" add constraint "question_version_id_foreign" foreign key ("version_id") references "version" ("version_id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "answer" add constraint "answer_question_id_foreign" foreign key ("question_id") references "question" ("question_id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "version" drop constraint "version_quiz_id_foreign";',
    );

    this.addSql(
      'alter table "quiz" drop constraint "quiz_draft_version_id_foreign";',
    );

    this.addSql(
      'alter table "quiz" drop constraint "quiz_published_version_id_foreign";',
    );

    this.addSql(
      'alter table "question" drop constraint "question_version_id_foreign";',
    );

    this.addSql(
      'alter table "answer" drop constraint "answer_question_id_foreign";',
    );

    this.addSql('drop table if exists "quiz" cascade;');

    this.addSql('drop table if exists "version" cascade;');

    this.addSql('drop table if exists "question" cascade;');

    this.addSql('drop table if exists "answer" cascade;');
  }
}
