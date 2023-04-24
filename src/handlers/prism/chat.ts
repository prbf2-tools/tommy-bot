import fs from "fs/promises";

import { EmbedBuilder, TextChannel } from "discord.js";

import { Client } from "../../client";
import PRISM, { Subject } from "./prism";

export default (client: Client) => {
    PRISM.on(Subject.Chat, handlePRISMChat.bind(null, client));
};

function handlePRISMChat(client: Client, fields: string[]) {
    const fieldsReady = fields.join("##^##").split("\n").map(v => v.split("##^##"));


    //console.log(fieldsReady+'\n\n\n')


    fieldsReady.forEach(function(data) {
        //console.log(dataLenght)
        //fieldsReady = dataLenght.split('\1')[1].split('\2')[1].split('\4')[0].split('\3')

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


            let tkString = fields[fields.length - 1].split(" ");

            (client.channels.cache.get("1022258448508928031") as TextChannel).send(formatedFields);
            //client.channels.cache.get('1022258448508928031').send("`"+fields+"`");
            if (tkString[5] == "m]") {
                tkString = fields[fields.length - 1].split(" ");
                //console.log(fields[fields.length-1].split(' '))
                const adminLogPost = new EmbedBuilder()
                    .setColor(0Xa7367b)
                    .setTitle("TEAMKILL")
                    .setDescription(
                        "**Performed by: **`" + tkString[0] + " " + tkString[1] + "`"
                        + "\n**On player: **`" + tkString[6] + " " + tkString[7].replace("\n", "") + "`"
                        + "\n**With: **`" + tkString[2].slice(1) + "` : `" + tkString[4] + "m`",
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "IN-GAME"
                    });
                (client.channels.cache.get("1033130972264276018") as TextChannel).send({ content: "`" + fields[fields.length - 1].split(" ") + "`", embeds: [adminLogPost] });
            }
            else if (data[data.length - 1].includes("is victorious!") == true) {
                const ggWinner = data[data.length - 1].split(" ");
                console.log("GUNGAME WINNER::::" + ggWinner[1].slice(0, -2));
                fs.writeFile("logs/gungame_winner.txt", ggWinner[1].slice(0, -2));
                //gungame_winner.txt
            } else if (contentString.includes("!cookie") == true) {
                PRISM.sendChat("!w " + Player.split(" ")[1] + " NOM! You have ate a cookie!");
            }
        }
    });
}
