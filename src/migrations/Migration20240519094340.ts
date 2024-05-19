import { Migration } from '@mikro-orm/migrations';

export class Migration20240519094340 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "version" add column "image" varchar(255) null;');

    this.addSql('alter table "question" add column "image" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "version" drop column "image";');

    this.addSql('alter table "question" drop column "image";');
  }

}
