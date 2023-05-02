import { Socket } from "net";
import { EventEmitter } from "events";
import crypto from "crypto";

import rand from "csprng";

import logger from "../../logger.js";
import { Commands } from "./commands.js";

const log = logger("PRISM");

export enum Subject {
    Login = "login1",
    Connected = "connected",

    RAConfig = "raconfig",
    Success = "success",
    Error = "success",
    Chat = "chat",

    UpdatePlayers = "updateplayers",
    Kill = "kill",

    Invalid = "invalid",
}

enum Separator {
    Start = "\x01",
    Subject = "\x02",
    Field = "\x03",
    End = "\x04\x00",
}

export class PRISM extends EventEmitter {
    private socket: Socket;
    private buffer;
    private theCCK: string;

    commands: Commands;

    constructor() {
        super();

        this.socket = new Socket();
        this.buffer = "";
        this.theCCK = rand(160, 36);

        this.commands = new Commands(this);
    }

    connect(ip: string, port: number, username: string, password: string) {
        const connect = () => this.socket.connect(port, ip);
        const reconnect = () => {
            log("Reconnecting");
            this.socket.destroy();
            setTimeout(connect, 10000);
        };
        try {
            this.socket
                .once("connect", () => {
                    log("Connected to PRISM API");
                    this.login1(username);
                    this.on(Subject.Login, this.login2.bind(null, username, password));
                })
                .on("error", (e) => {
                    log("The PRISM connection was lost");
                    log(e);
                    log("Waiting for 10 seconds before trying again");
                    reconnect();
                })
                .on("close", () => {
                    log("The connection was closed");
                    reconnect();
                })
                .on("end", () => {
                    log("The connection was ended");
                    reconnect();
                })
                .on("data", this.handleData);
            connect();
        } catch (error) {
            console.error(error);
        }
    }

    handleData(rawData: Buffer) {
        this.buffer += rawData.toString("utf-8");
        while (this.buffer.includes(Separator.End)) {
            const length = this.buffer.indexOf(Separator.End);
            const msg = this.buffer.substring(0, length);
            this.buffer = this.buffer.substring(length + 2);
            const { subject, fields } = parseMessage(msg);
            if (subject === Subject.Chat) {
                this.handleChat(fields);
            } else {
                this.emit(subject, fields);
            }
        }
    }

    login1(username: string) {
        this.send("login1", "1", username, this.theCCK);
    }

    login2(username: string, password: string, [passHash, serverChallenge]: [string, string]) {
        const passwordhash = crypto.createHash("sha1");
        const saltedpass = crypto.createHash("sha1");
        const challengedigest = crypto.createHash("sha1");

        passwordhash.update(password);
        saltedpass.update(passHash + Separator.Start + passwordhash.digest("hex"));
        challengedigest.update(username + Separator.Field + this.theCCK + Separator.Field + serverChallenge + Separator.Field + saltedpass.digest("hex"));

        this.send("login2", challengedigest.digest("hex"));
    }

    send(subject: string, ...args: string[]) {
        this.socket.write(
            Separator.Start +
            subject +
            Separator.Subject +
            args.join(Separator.Field) +
            Separator.End
        );
    }

    sendChat(msg: string) {
        this.send("say", msg);
    }

    handleChat(fields: string[]) {
        const fieldsReady = fields.join("##^##").split("\n").map(v => v.split("##^##"));
        this.emit(Subject.Chat, fieldsReady);
    }
}


const parseMessage = (msg: string): {
    subject: Subject
    fields: string[]
} => {
    const data = msg.toString();

    const subjectStr = data.split("\x01")[1].split("\x02")[0];
    const fields = data.split("\x01")[1].split("\x02")[1].split("\x04")[0].split("\x03");

    log(subjectStr, fields);

    const subject: Subject = (() => {
        switch (subjectStr) {
            case Subject.Login.toString(): return Subject.Login;
            case Subject.Connected.toString(): return Subject.Connected;
            case Subject.RAConfig.toString(): return Subject.RAConfig;
            case Subject.Success.toString(): return Subject.Success;
            case Subject.Error.toString(): return Subject.Error;
            case Subject.Chat.toString(): return Subject.Chat;
            case Subject.Kill.toString(): return Subject.Kill;
            default: return Subject.Invalid;
        }
    })();

    return {
        subject: subject,
        fields,
    };
};
