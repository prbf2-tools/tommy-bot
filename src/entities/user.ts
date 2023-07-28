import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
    @PrimaryKey()
    discordID: string;

    @Property()
    hash: string;

    @Property({
        default: false,
    })
    prismCreated: boolean
}

