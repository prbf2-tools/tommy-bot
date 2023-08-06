import dotenv from "dotenv";
dotenv.config();

// This is for testing purposes
const defaultTextCh = process.env.CH_TESTING;

export const channels = {
    bans: {
        priv: defaultTextCh || process.env.CH_BANS_PRIV || "995520998554218557",
        pub: defaultTextCh || process.env.CH_BANS_PUB || "995387208947204257",
    },
    commands: {
        priv: defaultTextCh || process.env.CH_CMDS_PRIV || "995520998554218557",
        pub: defaultTextCh || process.env.CH_CMDS_PUB || "995387208947204257",
    },
    join: {
        priv: defaultTextCh || process.env.CH_JOIN_PRIV || "995521059119960144"
    },
    prism: {
        chat: defaultTextCh || process.env.CH_PRISM_CHAT || "1022258448508928031",
        teamkill: defaultTextCh || process.env.CH_PRISM_TK || "1033130972264276018",
    }
};

export const paths = {
    server: process.env.SERVER_PATH,
    raConfig: "mods/pr/python/game/realityconfig_admin.py",
    reservedSlots: "mods/pr/settings/reservedslots.txt"
}

export const logs = {
    bans: process.env.LOGS_BANS || "logs/banlist_info.log",
    commands: process.env.LOGS_CMDS || "logs/ra_adminlog.txt",
    joins: process.env.LOGS_JOIN || "logs/joinlog.log",
};

export const prism = {
    ip: process.env.PRISM_IP || "127.0.0.1",
    port: Number(process.env.PRISM_PORT || 4712),
    username: process.env.PRISM_USRNAME || "",
    password: process.env.PRISM_USRPW || "",
};

const token = process.env.TOKEN;
if (!token) {
    throw Error("Discord Bot token wasn't provided");
}
const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;
if (!clientID || !guildID) {
    throw Error("Client and Guild ID are required");
}

export default {
    timezone: process.env.TZ || "+02:00",
    channels,
    logs,
    token,
    clientID,
    guildID,
    prism,
    paths,
};
