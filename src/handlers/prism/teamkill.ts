import { EmbedBuilder, TextChannel } from "discord.js";

import { Client } from "../../client";
import PRISM, { Subject } from "./prism";
import { channels } from "../../config";

export default (client: Client) => {
    PRISM.on(Subject.Chat, handlePRISMTeamKill.bind(null, client));
};

const handlePRISMTeamKill = (client: Client, messages: string[][]) => {
    messages.forEach(msg => {
        const tkString = msg[msg.length - 1].split(" ");

        if (tkString[5] == "m]") {
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
            (client.channels.cache.get(channels.prism.teamkill) as TextChannel).send({ content: "`" + msg[msg.length - 1].split(" ") + "`", embeds: [adminLogPost] });
        }
    });
};
