import { Migration } from '@mikro-orm/migrations';

export class Migration20230728134619 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `role` add column `prism` integer not null default false;');

    this.addSql('alter table `user` add column `prism_created` integer not null default false;');
  }

}
