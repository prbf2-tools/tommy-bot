import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
    @PrimaryKey()
    discordID: string;

    @Property()
    hash: string;

    @Property()
    ign: string

    @Property({
        default: false,
    })
    prismCreated: boolean
}

