import { Collection, Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.js";

@Entity()
export class Role {
    @PrimaryKey()
    discordID: string;

    @Property({
        nullable: true,
    })
    level: number | null;

    @Property({
        default: false,
    })
    reservedSlot: boolean;
    @Property({
        default: false,
    })
    prism: boolean;

    @ManyToMany()
    users = new Collection<User>(this)
}
