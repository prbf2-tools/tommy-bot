import db from "./";

export interface User {
    discordID: string,
    hash: string,
}

export const get = (discordID: string): User | null => {
    return db.chain.get("users").find({ discordID }).value()
};

export const insert = (user: User) => {
    db.chain.get("users").remove({ discordID: user.discordID });
    db.chain.get("users").push(user);
};
