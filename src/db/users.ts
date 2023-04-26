import db from "./index.js";

export interface User {
    discordID: string,
    hash: string,
}

export const get = (discordID: string): User | null => {
    return db.chain.get("users").find({ discordID }).value();
};

export const insert = async (user: User) => {
    db.chain.get("users").remove({ discordID: user.discordID });
    db.chain.get("users").push(user).value();
    await db.write();
};
