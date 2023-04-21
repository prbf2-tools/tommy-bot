import dotenv from "dotenv";
dotenv.config();

import { Client } from "./client";
import config from "./config";
import handleLogs from "./handlers/logs";

const client = new Client();

handleLogs(client);

client.login(config.token);
