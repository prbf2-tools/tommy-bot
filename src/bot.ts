import dotenv from "dotenv";
dotenv.config();

import { Client } from "./client";
import config from "./config";
import handleLogs from "./handlers/logs";
import handlePrismChat from "./handlers/prism/chat";
import handlePrismTeamKill from "./handlers/prism/teamkill";
import handleDemos from "./handlers/demos/demos";

const client = new Client();

handleLogs(client);
handlePrismChat(client);
handlePrismTeamKill(client);
handleDemos(client);

client.login(config.token);
