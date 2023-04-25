import dotenv from "dotenv";
dotenv.config();

import { Client } from "./client";
import config from "./config";
import handleLogs from "./handlers/logs";
import handlePrismChat from "./handlers/prism/chat";
import handlePrismTeamKill from "./handlers/prism/teamkill";

const client = new Client();

handleLogs(client);
handlePrismChat(client);
handlePrismTeamKill(client);

client.login(config.token);
