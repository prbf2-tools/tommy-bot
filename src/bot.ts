import { MikroORM } from "@mikro-orm/core";

import { Client } from "./client.js";
import config from "./config.js";
import handleLogs from "./handlers/logs/index.js";
import { PRISM } from "./handlers/prism/index.js";
import handlePrismChat from "./handlers/prism/chat.js";
import handlePrismTeamKill from "./handlers/prism/teamkill.js";
import handleDemos from "./handlers/demos/demos.js";
import ormConfig from './mikro-orm.config.js';

(async () => {
    const prism = new PRISM();
    prism.connect(
        config.prism.ip,
        config.prism.port,
        config.prism.username,
        config.prism.password
    )

    const orm = await MikroORM.init(ormConfig)

    const client = new Client(prism, orm.em);

    handleLogs(client);
    handlePrismChat(client);
    handlePrismTeamKill(client);
    handleDemos(client);

    client.login(config.token);
})();
