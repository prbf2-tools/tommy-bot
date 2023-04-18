import { EmbedBuilder } from "discord.js";

export interface Embeds {
    priv?: EmbedBuilder;
    pub?: EmbedBuilder;
}

export enum UserType {
    Player,
    Prism,
    Server,
}

export class User {
    typ: UserType;
    name: string;
    tag?: string;

    toString(): string {
        if (this.tag) {
            return this.tag + " " + this.name;
        }

        return this.name;
    }
}

export class UserDetailed extends User {
    ip: string;
    hash: string;
}
