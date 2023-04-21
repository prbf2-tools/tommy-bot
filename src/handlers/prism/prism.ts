import { Socket } from "net";
import { EventEmitter } from "events";
import crypto from "crypto";

import rand from "csprng";

import { prism as prismConfig } from "../../config";

export enum Events {
    MessageLogin = "login1",
    MessageChat = "chat",
}

class PRISM extends EventEmitter {
    MSG_START = "\x01";
    MSG_SUBJECT = "\x02";
    MSG_FIELD = "\x03";
    MSG_END = "\x04\x00";

    private socket: Socket = new Socket();
    private buffer = "";
    private theCCK: string = rand(160, 36);

    constructor() {
        super();

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
                    setTimeout(this.connect, 10000);
                })
                .on("close", () => {
                    console.log("The PRISM connection was closed");
                    this.socket.destroy();
                    setTimeout(this.connect, 10000);
                })
                .on("end", () => {
                    console.log("The PRISM connection was ended");
                    this.socket.destroy();
                    setTimeout(this.connect, 10000);
                })
                .on("data", (rawData) => {
                    this.buffer += rawData.toString("utf-8");
                    while (this.buffer.includes(this.MSG_END)) {
                        const length = this.buffer.indexOf(this.MSG_END);
                        const msg = this.buffer.substr(0, length);
                        this.buffer = this.buffer.substr(length + 2);
                        const { subject, fields } = parseMessage(msg);
                        this.emit(subject, fields);
                    }
                });
            this.connect();
        } catch (error) {
            console.error(error);
        }

        this.on(Events.MessageLogin, this.login2);
    }

    connect() {
        this.socket.connect(prismConfig.port, prismConfig.ip);
    }

    login1() {
        this.send("login1", "1", prismConfig.username, this.theCCK);
    }

    login2([passHash, serverChallenge]: [string, string]) {
        const passwordhash = crypto.createHash("sha1");
        const saltedpass = crypto.createHash("sha1");
        const challengedigest = crypto.createHash("sha1");

        passwordhash.update(prismConfig.password);
        saltedpass.update(passHash + this.MSG_START + passwordhash.digest("hex"));
        challengedigest.update(prismConfig.username + this.MSG_FIELD + this.theCCK + this.MSG_FIELD + serverChallenge + this.MSG_FIELD + saltedpass.digest("hex"));

        this.send("login2", challengedigest.digest("hex"));
    }

    send(subject: string, ...args: string[]) {
        this.socket.write(
            this.MSG_START +
            subject +
            this.MSG_SUBJECT +
            args.join(this.MSG_FIELD) +
            this.MSG_END
        );
    }

    sendChat(msg: string) {
        this.send("say", msg);
    }
}


interface Message {
    subject: Events
    fields: string[]
}

const parseMessage = (msg: string): Message => {
    const data = msg.toString();

    const subject = data.split("\x01")[1].split("\x02")[0];
    const fields = data.split("\x01")[1].split("\x02")[1].split("\x04")[0].split("\x03");

    return {
        subject: Events[subject as keyof typeof Events],
        fields,
    };
};

export default new PRISM();
