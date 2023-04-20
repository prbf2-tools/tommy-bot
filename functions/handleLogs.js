import { watchBanlist, watchCommands, watchJoin } from "./logs/index.js";

export default (client) => {
    client.handleLogs = async () => {
        watchBanlist(client);
        watchCommands(client);
        watchJoin(client);
    };
};
