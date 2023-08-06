import { EmbedBuilder } from "discord.js";

const NEW_LINE = "\x0A"


export enum Subject {
    // passwordHash, serverChallenge
    Login1 = "login1",

    // welcomeString
    Connected = "connected",

    ServerDetails = "serverdetails",
    UpdateServerDetails = "updateserverdetails",

    GameplayDetails = "gameplaydetails",
    RAConfig = "raconfig",
    Maplist = "maplist",

    Success = "success",
    Error = "error",
    CriticalError = "errorcritical",

    APIAdminResult = "APIAdminResult",

    GetUsers = "getusers",

    ListPlayers = "listplayers",
    UpdatePlayers = "updateplayers",
    PlayerLeave = "playerleave",

    Chat = "chat",
    Kill = "kill",

    Invalid = "invalid",
}

export function findSubject(subject: string): Subject {
    switch (subject) {
        case Subject.Login1.toString(): return Subject.Login1;
        case Subject.Connected.toString(): return Subject.Connected;
        case Subject.ServerDetails.toString(): return Subject.ServerDetails;
        case Subject.UpdateServerDetails.toString(): return Subject.UpdateServerDetails;
        case Subject.GameplayDetails.toString(): return Subject.GameplayDetails;
        case Subject.RAConfig.toString(): return Subject.RAConfig;
        case Subject.Maplist.toString(): return Subject.Maplist;
        case Subject.Success.toString(): return Subject.Success;
        case Subject.Error.toString(): return Subject.Error;
        case Subject.CriticalError.toString(): return Subject.CriticalError;
        case Subject.APIAdminResult.toString(): return Subject.APIAdminResult;
        case Subject.GetUsers.toString(): return Subject.GetUsers;
        case Subject.ListPlayers.toString(): return Subject.ListPlayers;
        case Subject.UpdatePlayers.toString(): return Subject.UpdatePlayers;
        case Subject.PlayerLeave.toString(): return Subject.PlayerLeave;
        case Subject.Chat.toString(): return Subject.Chat;
        case Subject.Kill.toString(): return Subject.Kill;
        default: return Subject.Invalid;
    }
}

export enum ErrorCode {
    Unauthenticated = 3000,
    IncorectUsernameOrPassword = 3001,
    InssuficientPermissions = 3002,
    AccountExists = 3003,
    OwnAccont = 3004,
    SuperUserLastAccount = 3005,
    DeletedUser = 3006,
    ServerVersion = 3007,
}

export interface Error {
    code: ErrorCode,
    content: string,
}

export function processError(fields: string[]): Error {
    return {
        code: Number(fields[0]),
        content: fields[1],
    }
}

export function errorToEmbed(error: Error): EmbedBuilder {
    const embed = new EmbedBuilder()

    return embed;
}

export interface Login1 {
    passwordHash: string,
    serverChallenge: string,
}

export function processLogin1(fields: string[]): Login1 {
    return {
        passwordHash: fields[0],
        serverChallenge: fields[1],
    }
}

export interface User {
    name: string,
    level: number,
}

export function processGetUsers(fields: string[]): User[] {
    return fields
        .join("##^##")
        .split(NEW_LINE)
        .map(v => v.split("##^##"))
        .map(v => { return { name: v[0], level: Number(v[1]) } });
}

export function customProcessor(subject: Subject): any {
    switch (subject) {
        case Subject.Error: return processError;
        case Subject.Login1: return processLogin1;
        case Subject.GetUsers: return processGetUsers;
        default: return (fields: string[]) => fields
    }
}
