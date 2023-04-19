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
  }
}

export const logs = {
  bans: process.env.LOGS_BANS || "logs/banlist_info.log",
  commands: process.env.LOGS_CMDS || "logs/ra_adminlog.txt",
  joins: process.env.LOGS_JOIN || "logs/joinlog.log",
}

export default {
  timezone: process.env.TZ || "+2",

  channels,
}
