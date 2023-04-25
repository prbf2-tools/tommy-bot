import fs from "fs";
import fsPromises from "fs/promises";
import pather from "path";

import chokidar from "chokidar";
import Tail from "always-tail";

import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    HexColorString,
    TextChannel,
} from "discord.js";

import locals from "../../localization";
import { createImage } from "./image";
import { GameMode, Layer, MapName, PRJSONExt } from "./interfaces";
import { Client } from "../../client";
import { uploadFiles } from "./ftp";

const mapNames: { [key: string]: MapName } = locals.mapNames;
const gameModes: { [key: string]: GameMode } = locals.gameModes;
const layers: { [key: string]: Layer } = locals.layers;

interface Round {
    tickets: {
        team1?: string,
        team2?: string,
    }
    GGWinner?: string

    chatlog?: string
    bf2demo?: string
    json?: string
}

const newRound = (): Round => {
    return {
        tickets: {}
    };
};

let currentRound: Round = newRound();

export default async (client: Client) => {
    const ticketsLog = "logs/tickets.log";
    if (!fs.existsSync(ticketsLog)) await fsPromises.writeFile(ticketsLog, "");
    const tailTickets = new Tail(ticketsLog, "\n");

    tailTickets.on("line", function(dataTickets: string) {
        const dataTicketsSplit = dataTickets.split(" ");
        currentRound.tickets.team1 = dataTicketsSplit[7].replace(",", "");
        currentRound.tickets.team2 = dataTicketsSplit[4].replace(",", "");
        console.log(currentRound.tickets.team1 + " - " + currentRound.tickets.team2);
    });

    const ggWinnerLog = "logs/gungame_winner.txt";
    if (!fs.existsSync(ggWinnerLog)) fsPromises.writeFile(ggWinnerLog, "");
    const tailggWinner = new Tail(ggWinnerLog, "\n");

    tailggWinner.on("line", function(dataggWinner: string) {
        console.log(dataggWinner);
        currentRound.GGWinner = dataggWinner;
    });

    //chatlogPath watcherChat
    const watcherChat = chokidar.watch("logs/chatlogs", {
        ignored: ["]/^./", "demos/index.php"],
        persistent: true,
    });

    watcherChat.on("add", (path2) => {
        const chatlogPath = pather.basename(path2, ".txt");
        currentRound.chatlog = chatlogPath;
        console.log(`File ${chatlogPath}.txt has been cached`);
    });

    //demoPath watcherDemo
    const watcherDemo = chokidar.watch("logs/demos", {
        ignored: ["]/^./", "demos/index.php"],
        persistent: true,
    });
    watcherDemo.on("add", (path3) => {
        const demoPath = pather.basename(path3, ".bf2demo");
        currentRound.bf2demo = demoPath;
        console.log(`File ${demoPath}.bf2demo has been cached`);
    });

    const watcher = chokidar.watch("logs/json", {
        ignored: "/^./",
        persistent: true,
    });

    function sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    watcher.on("add", async (path) => {
        console.log(`File ${path} has been added`);
        currentRound.json = path;
        // Wait for all files to be written.
        await sleep(10000);
        processRound(client, currentRound);
        currentRound = newRound();
    });
};

const processRound = async (client: Client, round: Round) => {
    const jsonFile = await fsPromises.readFile(round.json!, "utf8");
    const prjson: PRJSONExt = JSON.parse(jsonFile);

    const mapGameMode = gameModes[prjson.MapMode];
    const mapLayer = layers[prjson.MapLayer];
    const mapName = mapNames[prjson.MapName];

    const fileName1 = pather.basename(round.json!, ".json");

    const demoPathFormat = fileName1.replace("tracker", "demo");

    await fsPromises.rename(
        "logs/demos/" + round.bf2demo! + ".bf2demo",
        "logs/demos/" + demoPathFormat + ".bf2demo",
    );

    prjson.demoFile = demoPathFormat;
    prjson.ggwinner = round.GGWinner;
    prjson.truet1t = round.tickets.team1;
    prjson.truet2t = round.tickets.team2;

    await fsPromises.writeFile(
        "logs/json_formated/" + fileName1 + ".json",
        JSON.stringify(prjson, null, 4),
    );

    const previewBuffer = await createImage(prjson, mapName, mapLayer, mapGameMode);

    await fsPromises.writeFile(
        "logs/images/" + fileName1 + ".png",
        previewBuffer
    );

    const durationTimeRaw = prjson.EndTime - prjson.StartTime;
    const durationTime = durationTimeRaw / 60;

    const roundEmbed = new EmbedBuilder()
        .setColor(mapGameMode.color as HexColorString)
        .setTitle(mapName.name)
        .setDescription(
            "**_" +
            mapGameMode.name +
            ", " +
            mapLayer.name +
            "_**\n\nDuration: " +
            Math.round(durationTime) +
            " minutes\nStarted: <t:" +
            prjson.StartTime +
            ":R> | <t:" +
            prjson.StartTime +
            ":F>\nEnded: <t:" +
            prjson.EndTime +
            ":R> | <t:" +
            prjson.EndTime +
            ":F>\n"
        )
        .setImage("attachment://" + fileName1 + ".png")
        .setTimestamp(prjson.EndTime * 1000);
    const file = new AttachmentBuilder("logs/images/" + fileName1 + ".png");
    //const filecl = new AttachmentBuilder('logs/chatlogs/'+chatlogPath+'.txt');
    const filetracker = new AttachmentBuilder(
        "logs/trackers/" + fileName1 + ".PRdemo"
    );
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel("Download Battle Recorder")
            .setStyle(ButtonStyle.Link)
            .setURL(
                "https://www.prmafia.online/br/demos/" + demoPathFormat + ".bf2demo"
            ),
        new ButtonBuilder()
            .setLabel("Download Tracker")
            .setStyle(ButtonStyle.Link)
            .setURL(
                "https://www.prmafia.online/br/trackers/" + fileName1 + ".PRdemo"
            ),
        new ButtonBuilder()
            .setLabel("View Tracker")
            .setStyle(ButtonStyle.Link)
            .setURL(
                "https://www.prmafia.online/br/realitytracker_master/index.html?demo=../trackers/" +
                fileName1 +
                ".PRdemo"
            )
    );

    await uploadFiles([
        "logs/json_formated/" + fileName1 + ".json",
        "br/json_formated/" + fileName1 + ".json",
    ], [
        "logs/trackers/" + fileName1 + ".PRdemo",
        "br/trackers/" + fileName1 + ".PRdemo",
    ], [
        "logs/demos/" + demoPathFormat + ".bf2demo",
        "br/demos/" + demoPathFormat + ".bf2demo",
    ]);

    console.log("\x1b[36m", "Ready for next round!", "\x1b[0m");
    await (client.channels.cache
        .get("995387003409539073") as TextChannel)
        .send({
            embeds: [roundEmbed],
            components: [row],
            files: [file, filetracker],
        });

    // await client.channels.cache.get('1033130739505565716').threads.create({
    //     name: `__**${locals.mapNames[prjson.MapName].name}**__ -  ${locals.gameModes[prjson.MapMode].name}, ${locals.layers[prjson.MapLayer].name}`,
    //     message: {
    //         content: `<t:${prjson.StartTime}:d> <t:${prjson.StartTime}:T> **-** <t:${prjson.EndTime}:d> <t:${prjson.EndTime}:T> **│** ${locals.factions[prjson.Team2Name]} \` ${Team1Tickets} \` **-** ${locals.factions[prjson.Team1Name]} \` ${Team2Tickets} \``,
    //         embeds: [roundEmbed],
    //         components: [row],
    //         files: [file, filecl]
    //     },
    //     appliedTags: [locals.gameModes[prjson.MapMode].tagPriv, locals.layers[prjson.MapLayer].tagPriv]
    // })
    await fsPromises.unlink(round.json!);
    // const oldPathJson = 'logs/json/' + fileName1 + '.json'
    // const newPathJson = 'logs/json_formated/' + fileName1 + '.json'
    //
    // fs.rename(oldPathJson, newPathJson, function(err) {
    //     if (err) throw err
    //     console.log('Successfully moved json!')
    // })
    //await client.channels.cache.get('995387003409539073').send({ embeds: [roundEmbed],components: [row], files: [file] })
};
