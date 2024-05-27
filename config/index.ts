// @ts-nocheck
import { readFileSync } from 'fs';
import { parse } from 'yaml'
import { Ajv } from 'ajv';
import * as schema from './config.schema.json' assert { type: "json" };

interface Discord {
    token: string;
    clientID: string;
    guildID: string;
}

interface Server {
    timezone: string;
}

interface PrismAuth {
    ip: string;
    port: number;
    username: string;
    password: string;
}

interface Prism {
    auth: PrismAuth;
    generalChannelID: string;
    teamkillChannelID: string;
}

interface Demo {
    source: string;
    destination: string;
    url: string;
}

interface Demos {
    channelID: string;
    ftp: {
        host: string;
        username: string;
        password: string;
    };
    trackerViewerUrl: string;
    bf2: Demo;
    pr: Demo;
    json: {
        source: string;
        destination: string;
    };
}

interface Log {
    path: string;
    publicChannelID: string;
    privateChannelID: string;
}

interface Logs {
    bans: Log;
    commands: Log;
    joins: {
        path: string;
        privateChannelID: string;
    };
    tickets: {
        path: string;
    }
}

interface PRSPY {
    id: string;
    mapChannelID: string;
    detailsChannelID: string;
}

interface FormConfig {
    public: {
        channelID: string;
        tags: string[];
    }
    private: {
        channelID: string;
        tags: string[];
    }
}

interface ContactAdmin {
    adminRoleID: string;
    application: FormConfig;
    appeal: FormConfig;
    report: FormConfig;
}

interface BanInfo {
    firstChannelID: string;
    secondChannelID: string;
}

interface Config {
    discord: Discord;
    server: Server;
    prism: Prism;
    demos: Demos;
    logs: Logs;
    prspy: PRSPY;
    contactadmin: ContactAdmin;
    prban: BanInfo;
    prunban: BanInfo;
}

const config: Config = parse(readFileSync('../config.yaml', 'utf8'));

const ajv = new Ajv();
ajv.addSchema(schema, 'config');

if (!ajv.validate('config', config)) {
    console.error("Invalid config file", ajv.errors);
    process.exit(1);
}

export default config;
