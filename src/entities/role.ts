import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

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
}
