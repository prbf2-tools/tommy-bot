import fs from "fs";
import { Colors, EmbedBuilder } from "discord.js";
import { UserType } from "../interfaces.js";
import { fullName } from "../utils.js";
class CommandHandler {
    blueprint;
    constructor(blueprint) {
        this.blueprint = blueprint;
    }
    prepareEmbed(data) {
        const embed = new EmbedBuilder()
            .setColor(this.blueprint.color)
            .setTitle(data.command)
            .setDescription(this.prepDescription(data))
            .setTimestamp(data.date);
        if (data.issuer.typ === UserType.Prism) {
            embed.setFooter({
                text: "PRISM"
            });
        }
        else if (data.issuer.typ === UserType.Player) {
            embed.setFooter({
                text: "IN-GAME"
            });
        }
        return embed;
    }
    handle(data) {
        return {
            priv: this.prepareEmbed(data),
        };
    }
    prepDescription(data) {
        const description = [
            `**Performed by: **\`${fullName(data.issuer)}\``,
        ];
        let header = "Reason";
        if (this.blueprint.header === null) {
            header = null;
        }
        else if (this.blueprint.header) {
            header = this.blueprint.header;
        }
        let body = data.body || "";
        if (this.blueprint.body === null) {
            body = null;
        }
        else if (this.blueprint.body) {
            body = this.blueprint.body;
        }
        else if (this.blueprint.extractContent) {
            body = this.extractContent(body);
        }
        if (body !== null) {
            if (header !== null) {
                description.push(`**${header} : **\`${body}\``);
            }
            else {
                description.push(body);
            }
        }
        if (data.receiver !== undefined) {
            description.splice(1, 0, `**On user: ** \`${fullName(data.receiver)}\``);
        }
        return description.join("\n");
    }
    extractContent(body) {
        const index = body.lastIndexOf(" - ");
        return body.slice(0, index);
    }
}
class Report extends CommandHandler {
    handle(data) {
        const priv = this.prepareEmbed(data);
        if (data.receiver !== undefined) {
            priv.setTitle("REPORT PLAYER");
        }
        else {
            priv.setTitle("REPORT");
        }
        return { priv };
    }
}
class Kick extends CommandHandler {
    handle(data) {
        const priv = this.prepareEmbed(data);
        const pub = this.prepareEmbed(data)
            .setTitle("Kicked")
            .setFooter({
            text: "You can rejoin after getting kicked."
        });
        if (data.issuer.typ === UserType.Server &&
            data.body?.includes("Account related to banned key:")) {
            priv.setFooter({
                text: "THIS MESSAGE DOES NOT EXIST! IF PLAYER ASK WHY THEY GET KICKED, JUST PING MAX AND TELL HIM THAT I'LL LOOK INTO IT!"
            });
            data.body = "ERROR";
            pub.setDescription(this.prepDescription(data));
        }
        return { priv, pub };
    }
}
class SetNext extends CommandHandler {
    handle(data) {
        const priv = this.prepareEmbed(data);
        const pub = this.prepareEmbed(data)
            .setFooter(null);
        return { priv, pub };
    }
}
class RunNext extends CommandHandler {
    handle(data) {
        fs.writeFile("logs/gungame_winner.txt", "Admin \"!runnext\"", function (err) {
            if (err) {
                // append failed
            }
            else {
                // done
            }
        });
        return {
            priv: this.prepareEmbed(data)
        };
    }
}
class MapvoteResult extends CommandHandler {
    handle(data) {
        if (!data.body) {
            return {};
        }
        const i = data.body.indexOf(":");
        const adminMapsVotesEach = data.body.slice(i).split(" | ");
        const votesDescription = [];
        adminMapsVotesEach.forEach(option => {
            const split = option.split(": ");
            votesDescription.push(`** ${split[0]}: **\`${split[1]}\``);
        });
        data.body = votesDescription.join("\n");
        const priv = this.prepareEmbed(data)
            .setTitle("MAP VOTE RESULTS");
        const pub = this.prepareEmbed(data)
            .setTitle("Map Vote Results")
            .setFooter(null);
        return { priv, pub };
    }
}
const reportColor = 0X89a110;
const handledCommands = {
    REPORT: {
        color: reportColor,
        func: Report,
    },
    REPORTP: {
        color: reportColor,
        func: Report,
    },
    KICK: {
        color: Colors.DarkOrange,
        func: Kick,
    },
    WARN: {
        color: Colors.Yellow,
    },
    RESIGN: {
        color: Colors.DarkGold,
    },
    KILL: {
        color: Colors.LuminousVividPink,
    },
    INIT: {
        color: Colors.DarkPurple,
        header: null,
        body: "Adminhashes and -powerlevels have been reloaded",
    },
    MESSAGE: {
        color: Colors.DarkBlue,
        header: "Message",
        extractContent: true,
    },
    SAY: {
        color: Colors.Green,
        header: "Content",
        extractContent: true,
    },
    SETNEXT: {
        color: Colors.DarkGreen,
        header: "Map",
        func: SetNext,
    },
    SWITCH: {
        color: 0X3292a8,
        header: "When",
    },
    RUNNEXT: {
        color: 0X085441,
        header: null,
        body: null,
        func: RunNext,
    },
    MAPVOTERESULT: {
        color: Colors.Purple,
        header: null,
        func: MapvoteResult,
    },
};
export const prepareEmbeds = (command) => {
    if (command.command in handledCommands) {
        const commandBlueprint = handledCommands[command.command];
        if (commandBlueprint.func) {
            const handler = new commandBlueprint.func(commandBlueprint);
            return handler.handle(command);
        }
        else {
            const handler = new CommandHandler(commandBlueprint);
            return handler.handle(command);
        }
    }
    return {};
};
