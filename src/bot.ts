import dotenv from "dotenv";
dotenv.config();

import { Client } from "./client";
import config from "./config";
import handleLogs from "./handlers/logs";
import handlePrismChat from "./handlers/prism/chat";

const client = new Client();

handleLogs(client);
handlePrismChat(client);

client.login(config.token);
