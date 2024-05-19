import dotenv from "dotenv";
dotenv.config();

export const discord = {
    token: process.env.DISCORD_TOKEN,
    clientID: process.env.DISCORD_CLIENT_ID,
    guildID: process.env.DISCORD_GUILD_ID,
};

// For testing purposes
const testTextCh = process.env.CH_TEST;

export const channels = {
    bans: {
        priv: testTextCh || process.env.CH_BANS_PRIV,
        pub: testTextCh || process.env.CH_BANS_PUB,
    },
    commands: {
        priv: testTextCh || process.env.CH_CMDS_PRIV,
        pub: testTextCh || process.env.CH_CMDS_PUB,
    },
    join: {
        priv: testTextCh || process.env.CH_JOIN_PRIV,
    }
};

const serverDir = process.env.SV_DIR;

export const logs = {
    bans: process.env.LOGS_BANS || `${serverDir}/banlist_info.log`,
    commands: process.env.LOGS_COMMANDS || `${serverDir}/ra_adminlog.txt`,
    joins: process.env.LOGS_JOINS || `${serverDir}/joinlog.log`,
    tickets: process.env.LOGS_TICKETS || `${serverDir}/tickets.log`,
    chatlogs: process.env.LOGS_CHATLOGS || `${serverDir}/admin/logs/`,
};

export const demos = {
    bf2: process.env.DEMOS_BF2_DIR || `${serverDir}/mods/pr/demos/`,
    pr: process.env.DEMOS_PR_DIR || `${serverDir}/demos/`,
}

export const prism = {
    ip: process.env.PRISM_IP,
    port: process.env.PRISM_PORT || 4712,
    user: process.env.PRISM_USER,
    pass: process.env.PRISM_PASS,
}

export default {
    timezone: process.env.TZ || "+02:00",
    serverDir: serverDir,
    prspySvID: process.env.PRSPY_SV_ID,
    // bf2DemosDir: process.env.BF2_DEMOS_DIR || `${serverDir}/mods/pr / demos / `,
    // prDemosDir: process.env.PR_DEMOS_DIR || `${serverDir} /demos/`,
    // chatlogsDir: process.env.CHATLOGS_DIR || `${serverDir} /admin/logs / `,
    jsonDir: process.env.JSON_DIR || `${serverDir} /json/`,
    channels,
    logs,
};
