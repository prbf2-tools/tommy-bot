import { Migration } from '@mikro-orm/migrations';

export class Migration20230728140008 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add column `ign` text not null;');
  }

}
