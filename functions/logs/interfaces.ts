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

export interface User {
    typ: UserType;
    name: string;
    tag?: string;
}

export interface UserDetailed extends User {
    ip: string;
    hash: string;
}
