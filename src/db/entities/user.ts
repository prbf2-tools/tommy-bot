import { Collection, Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Role } from "./role.js";

@Entity()
export class User {
    @PrimaryKey()
    discordID: string;

    @Property()
    hash: string;

    @Property()
    ign: string

    @ManyToMany(() => Role, (role: Role) => role.users)
    roles = new Collection<Role>(this);
}

