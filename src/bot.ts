import dotenv from "dotenv";
dotenv.config();

import { Client } from "./client";
import config from "./config";

const client = new Client();

client.login(config.token);
