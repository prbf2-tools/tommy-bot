import { Socket } from "net";
import { EventEmitter } from "events";
import crypto from "crypto";

import rand from "csprng";

import { prism as prismConfig } from "../../config.js";

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
    private socket: Socket = new Socket();
    private buffer = "";
    private theCCK: string = rand(160, 36);

    constructor() {
        super();

        this.setupSocket();

        this.on(Subject.Login, this.login2);
    }

    setupSocket() {
        const connect = () => this.socket.connect(prismConfig.port, prismConfig.ip);
        try {
            this.socket
                .once("connect", () => {
                    console.log("Connected to PRISM API");
                    this.login1();
                })
                .on("error", (e) => {
                    console.log("The PRISM connection was lost");
                    console.log(e);
                    console.log("Waiting for 10 seconds before trying again");
                    this.socket.destroy();
                    setTimeout(connect, 10000);
                })
                .on("close", () => {
                    console.log("The PRISM connection was closed");
                    this.socket.destroy();
                    setTimeout(connect, 10000);
                })
                .on("end", () => {
                    console.log("The PRISM connection was ended");
                    this.socket.destroy();
                    setTimeout(connect, 10000);
                })
                .on("data", (rawData) => {
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
                });
            connect();
        } catch (error) {
            console.error(error);
        }
    }

    login1() {
        this.send("login1", "1", prismConfig.username, this.theCCK);
    }

    login2([passHash, serverChallenge]: [string, string]) {
        const passwordhash = crypto.createHash("sha1");
        const saltedpass = crypto.createHash("sha1");
        const challengedigest = crypto.createHash("sha1");

        passwordhash.update(prismConfig.password);
        saltedpass.update(passHash + Separator.Start + passwordhash.digest("hex"));
        challengedigest.update(prismConfig.username + Separator.Field + this.theCCK + Separator.Field + serverChallenge + Separator.Field + saltedpass.digest("hex"));

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


interface Message {
    subject: Subject
    fields: string[]
}

const parseMessage = (msg: string): Message => {
    const data = msg.toString();

    const subjectStr = data.split("\x01")[1].split("\x02")[0];
    const fields = data.split("\x01")[1].split("\x02")[1].split("\x04")[0].split("\x03");

    console.log(subjectStr, fields);

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

export default new PRISM();
