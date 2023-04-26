import { Client } from "./client.js";
import config from "./config.js";
import handleLogs from "./handlers/logs/index.js";
import handlePrismChat from "./handlers/prism/chat.js";
import handlePrismTeamKill from "./handlers/prism/teamkill.js";
import handleDemos from "./handlers/demos/demos.js";
import db from "./db/index.js";

(async () => {
    await db.read();

    const client = new Client();

    handleLogs(client);
    handlePrismChat(client);
    handlePrismTeamKill(client);
    handleDemos(client);

    client.login(config.token);

})();
