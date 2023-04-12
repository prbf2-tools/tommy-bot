
import { watchBanlist } from "./logs/bans";
import { watchCommands } from "./logs/commands";
import { watchJoin } from "./logs/join";

export default (client) => {
    client.handleLogs = async () => {
        watchBanlist(client);
        watchCommands(client);
        watchJoin(client);
    };
};
