import fs from "fs/promises";

import { Client } from "../../client";
import PRISM, { Subject } from "./prism";
import { channels } from "../../config";
import { TextChannel } from "discord.js";

export default (client: Client) => {
    PRISM.on(Subject.Chat, handlePRISMChat.bind(null, client));
};

const handlePRISMChat = (client: Client, fields: string[][]) => {
    fields.forEach(function(data) {
        if (data.length !== 5) {
            return;
        }

        let SquadNum = "";
        let Player = "";
        if (data) {
            const time = data[1].split(".")[0];
            const type = data[2];
            const playerRaw = data[3];
            const contentString = data[4];
            SquadNum = data[2].split(" ")[1];

            if (playerRaw != "") {
                Player = playerRaw + " ` **|** ` ";
            }

            const formater = (icons: string, str: string) => {
                return `<t:${time}:d> <t:${time}:T> **|** ${icons} \` ${str} \` **|** \` ${Player}${contentString}\``;
            };

            let formatedFields = "";
            if (type.includes("Game")) {
                if (type.includes("(OpFor)")) {
                    formatedFields = formater("🔳🔴", "Game OpFor");
                } else if (type.includes("(BluFor)")) {
                    formatedFields = formater("🔳🔵", "Game BluFor");
                } else {
                    formatedFields = formater("🔳", "Game");
                }
            } else if (type == "Admin Alert") {
                formatedFields = formater("🟥", "Admin Alert");
            } else if (type == "Response") {
                formatedFields = formater("🟨", "Response");
            } else if (type == "Global ") {
                formatedFields = formater("⬜", "Global");
            } else if (type.includes("BluFor") == true) {
                if (type == "BluFor") {
                    formatedFields = formater("⬜🔵", "BluFor");
                } else if (SquadNum == "*") {
                    formatedFields = formater("⬜🔵", `BluFor ${SquadNum}`);
                } else {
                    formatedFields = formater("⬜🔵🟢", `BluFor ${SquadNum}`);
                }
            } else if (type.includes("OpFor")) {
                if (type == "OpFor") {
                    formatedFields = formater("⬜🔴", "OpFor");
                } else if (SquadNum == "*") {
                    formatedFields = formater("⬜🔴", `OpFor ${SquadNum}`);
                } else {
                    formatedFields = formater("⬜🔴🟢", `OpFor ${SquadNum}`);
                }
            } else {
                formatedFields = "`" + data + "`";
            }


            (client.channels.cache.get(channels.prism.chat) as TextChannel).send(formatedFields);
        }

        if (data[data.length - 1].includes("is victorious!")) {
            const ggWinner = data[data.length - 1].split(" ");
            console.log("GUNGAME WINNER::::" + ggWinner[1].slice(0, -2));
            fs.writeFile("logs/gungame_winner.txt", ggWinner[1].slice(0, -2));
            //gungame_winner.txt
        }
    });
};
