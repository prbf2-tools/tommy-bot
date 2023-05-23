import { Migration } from '@mikro-orm/migrations';

export class Migration20230523163752 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `role` (`discord_id` text not null, `level` text null, `reserved_slot` integer not null default false, primary key (`discord_id`));');

    this.addSql('create table `user` (`discord_id` text not null, `hash` text not null, primary key (`discord_id`));');
  }

}
