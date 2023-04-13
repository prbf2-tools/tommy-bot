
import { watchBanlist } from "./logs/bans.js";
import { watchCommands } from "./logs/commands.js";
import { watchJoin } from "./logs/join.js";

export default (client) => {
    client.handleLogs = async () => {
        watchBanlist(client);
        watchCommands(client);
        watchJoin(client);
    };
};
