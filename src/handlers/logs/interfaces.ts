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

export const dateFormat = "YYYY-MM-DD";
export const dateTimeFormat = dateFormat + " " + "HH:mm:ss";

export enum DiscordTimeFormat {
    Date = "d",
    LongDate = "D",
    Time = "t",
    LongTime = "T",
    DateTime = "f",
    LongDateTime = "F",
    Relative = "R",
}
