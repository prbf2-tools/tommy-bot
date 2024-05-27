import fs from "fs";
import pather from "path";
import { join as joinPath } from "path";

import chokidar from "chokidar";
import Tail from "always-tail";
import { createCanvas, loadImage } from "canvas";
import ftp from "basic-ftp";

import config from "../config.js";
import locals from "../localization.json" assert { type: "json"};

import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
} from "discord.js";

const flagsDir = "assets/flags/";

export const gunGameWinnerCache = "cache/gungame_winner.txt";
const jsonFormatedCache = "cache/json_formated/";
const imagesCache = "cache/images/";

export default (client) => {
    client.handleTrackersDemos = async () => {
        var ticketsLog = config.logs.tickets.path;
        if (!fs.existsSync(ticketsLog)) fs.writeFileSync(ticketsLog, "");
        var tailTickets = new Tail(ticketsLog, "\n");

        let Team1Tickets = "E";
        let Team2Tickets = "E";

        tailTickets.on("line", function(dataTickets) {
            var dataTicketsSplit = dataTickets.split(" ");
            Team1Tickets = dataTicketsSplit[7].replace(",", "");
            Team2Tickets = dataTicketsSplit[4].replace(",", "");
            console.log(Team2Tickets + " - " + Team1Tickets);
        });

        var ggWinnerLog = gunGameWinnerCache;
        if (!fs.existsSync(ggWinnerLog)) fs.writeFileSync(ggWinnerLog, "");
        var tailggWinner = new Tail(ggWinnerLog, "\n");
        let GGWinner = "None";
        tailggWinner.on("line", function(dataggWinner) {
            console.log(dataggWinner);
            GGWinner = dataggWinner;
        });

        //chatlogPath watcherChat
        // var watcherChat = chokidar.watch(config.chatlogsDir, {
        //     ignored: ["]/^./", "demos/index.php"],
        //     persistent: true,
        // });
        // var chatlogPath = "none";
        // watcherChat.on("add", (path2) => {
        //     chatlogPath = pather.basename(path2, ".txt");
        //     console.log(`File ${chatlogPath}.txt has been cached`);
        // });

        //demoPath watcherDemo
        var watcherDemo = chokidar.watch(config.demos.bf2.source, {
            ignored: ["]/^./", "demos/index.php"],
            persistent: true,
        });
        var demoPath = "none";
        watcherDemo.on("add", (path3) => {
            demoPath = pather.basename(path3, ".bf2demo");
            console.log(`File ${demoPath}.bf2demo has been cached`);
        });

        var watcher = chokidar.watch(config.demos.json.source, {
            ignored: "/^./",
            persistent: true,
        });

        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        watcher.on("add", async (path) => {
            console.log(`File ${path} has been added`);
            await sleep(10000);
            const prjson = JSON.parse(fs.readFileSync(path, "utf8"));

            var fileName1 = pather.basename(path, ".json");

            /*fs.rename('logs/demos'+demoPath+'.bf2demo', 'logs/demos'+fileName1+'.bf2demo', () => {
        console.log("\nFile Renamed!\n");
      });*/

            var demoPathFormat = fileName1.replace("tracker", "demo");

            fs.rename(
                config.demos.bf2.source + demoPath + ".bf2demo",
                config.demos.bf2.source + demoPathFormat + ".bf2demo",
                function(err) {
                    if (err) console.log("ERROR: " + err);
                }
            );

            prjson.demoFile = demoPathFormat;
            prjson.ggwinner = GGWinner;
            prjson.truet1t = Team1Tickets;
            prjson.truet2t = Team2Tickets;

            fs.writeFile(
                jsonFormatedCache + fileName1 + ".json",
                JSON.stringify(prjson, null, 4),
                (err) => {
                    if (err) throw err;
                    console.log("New data added");
                }
            );

            const width = 400;
            const height = 120;

            var canvas = createCanvas(width, height);
            var context = canvas.getContext("2d");
            console.log(prjson.MapName);
            await loadImage(locals.mapNames[prjson.MapName].imageUrl).then(
                async (image) => {
                    context.drawImage(image, 0, 0, width, height);

                    loadImage(flagsDir + "template.png").then(async (image2) => {
                        context.drawImage(image2, 0, 0, width, height);

                        context.textAlign = "center";
                        context.font = "bold 18pt Sans";
                        context.fillStyle = "#fff";
                        context.textBaseline = "top";
                        context.fillText(locals.mapNames[prjson.MapName].name, 200, 15);

                        context.textAlign = "center";
                        context.font = "bold italic 12pt Sans";
                        context.fillStyle = "#fff";
                        context.textBaseline = "top";
                        context.fillText(
                            locals.gameModes[prjson.MapMode].name +
                            ", " +
                            locals.layers[prjson.MapLayer].name,
                            200,
                            44
                        );

                        if (prjson.MapMode == "gpm_gungame") {
                            fs.readFile(gunGameWinnerCache, "utf8", (err, data) => {
                                console.log("\x1b[36m", data, "\x1b[0m");
                                GGWinner = data;
                            });
                            console.log("Trying to read winner");
                            await sleep(3000);

                            context.textAlign = "center";
                            context.font = "bold 10pt Sans";
                            context.fillStyle = "#fff";
                            context.textBaseline = "top";
                            context.fillText("Winner:", 200, 61);

                            context.textAlign = "center";
                            context.font = "bold 16pt Sans";
                            context.fillStyle = "#fff";
                            context.textBaseline = "top";
                            context.fillText(GGWinner, 200, 75);

                            var buffer = canvas.toBuffer("image/png");
                            fs.writeFileSync(imagesCache + fileName1 + ".png", buffer);
                            console.log("\x1b[36m", "IMAGE DONE GG", "\x1b[0m");
                        } else {
                            context.textAlign = "center";
                            context.font = "bold 25pt Sans";
                            context.fillStyle = "#fff";
                            context.textBaseline = "top";
                            context.fillText(Team1Tickets, 161, 62);

                            context.textAlign = "center";
                            context.font = "bold 25pt Sans";
                            context.fillStyle = "#fff";
                            context.textBaseline = "top";
                            context.fillText(Team2Tickets, 239, 62);

                            loadImage(flagsDir + prjson.Team1Name + ".png").then(
                                (imageTeam1) => {
                                    context.drawImage(imageTeam1, 280, 70, 50, 28);

                                    loadImage(
                                        flagsDir + prjson.Team2Name + ".png"
                                    ).then((imageTeam2) => {
                                        context.drawImage(imageTeam2, 71, 70, 50, 28);

                                        if (prjson.MapMode == "gpm_insurgency") {
                                            loadImage(flagsDir + "Cache.png").then(
                                                (imageCache) => {
                                                    context.drawImage(imageCache, 249, 68, 32, 32);

                                                    var buffer = canvas.toBuffer("image/png");
                                                    fs.writeFileSync(
                                                        imagesCache + fileName1 + ".png",
                                                        buffer
                                                    );
                                                    console.log(
                                                        "\x1b[36m",
                                                        "IMAGE DONE CACHE",
                                                        "\x1b[0m"
                                                    );
                                                }
                                            );
                                        } else {
                                            var buffer = canvas.toBuffer("image/png");
                                            fs.writeFileSync(
                                                imagesCache + fileName1 + ".png",
                                                buffer
                                            );
                                            console.log("\x1b[36m", "IMAGE DONE STD", "\x1b[0m");
                                        }
                                    });
                                }
                            );
                        }
                    });
                }
            ).catch((reason) => {
                console.error(`Couldnt load image for map ${prjson.MapName}`)
            });

            let durationTimeRaw = prjson.EndTime - prjson.StartTime;
            let durationTime = durationTimeRaw / 60;

            console.log("\x1b[36m", "WAITING?", "\x1b[0m");
            await sleep(5000);

            // var trackerFile = "tracker/" + fileName1 + ".PRdemo"
            // var trackerPath =
            // "https://yossizap.github.io/realitytracker/index.html?demo=https://fcv-pr.com/" +
            // trackerFile
            var roundEmbed = new EmbedBuilder()
                .setColor(locals.gameModes[prjson.MapMode].color)
                .setTitle(locals.mapNames[prjson.MapName].name)
                .setDescription(
                    "**_" +
                    locals.gameModes[prjson.MapMode].name +
                    ", " +
                    locals.layers[prjson.MapLayer].name +
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
            const file = new AttachmentBuilder(imagesCache + fileName1 + ".png");
            //const filecl = new AttachmentBuilder('logs/chatlogs/'+chatlogPath+'.txt');
            const filetracker = new AttachmentBuilder(
                config.demos.pr.source + fileName1 + ".PRdemo"
            );
            var row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Download Battle Recorder")
                    .setStyle(ButtonStyle.Link)
                    .setURL(
                        config.demos.bf2.url + demoPathFormat + ".bf2demo"
                    ),
                new ButtonBuilder()
                    .setLabel("Download Tracker")
                    .setStyle(ButtonStyle.Link)
                    .setURL(
                        config.demos.pr.url + fileName1 + ".PRdemo"
                    ),
                new ButtonBuilder()
                    .setLabel("View Tracker")
                    .setStyle(ButtonStyle.Link)
                    .setURL(
                        config.demos.trackerViewerUrl +
                        "index.html?demo=" +
                        config.demos.pr.url +
                        fileName1 +
                        ".PRdemo"
                    )
            );
            example();
            async function example() {
                const clientFTP = new ftp.Client();
                clientFTP.ftp.verbose = true;
                try {
                    await clientFTP.access({
                        host: config.demos.ftp.host,
                        user: config.demos.ftp.user,
                        password: config.demos.ftp.password,
                    });
                    await clientFTP.uploadFrom(
                        jsonFormatedCache + fileName1 + ".json",
                        joinPath(config.demos.json.destination, fileName1) + ".json"
                    );
                    await clientFTP.uploadFrom(
                        joinPath(config.demos.pr.source, fileName1) + ".PRdemo",
                        joinPath(config.demos.pr.destination, fileName1) + ".PRdemo"
                    );
                    await clientFTP.uploadFrom(
                        joinPath(config.demos.bf2.source, demoPathFormat) + ".bf2demo",
                        joinPath(config.demos.bf2.destination, demoPathFormat) + ".bf2demo"
                    );
                    clientFTP.close();
                } catch (err) {
                    console.log(err);
                }
                clientFTP.close();
                console.log("\x1b[36m", "Ready for next round!", "\x1b[0m");
                await client.channels.cache
                    .get(config.demos.channelID)
                    .send({
                        embeds: [roundEmbed],
                        components: [row],
                        files: [file, filetracker],
                    });

                /*await client.channels.cache.get('1033130739505565716').threads.create({
          name: `__**${locals.mapNames[prjson.MapName].name}**__ -  ${locals.gameModes[prjson.MapMode].name}, ${locals.layers[prjson.MapLayer].name}`,
          message: {
            content: `<t:${prjson.StartTime}:d> <t:${prjson.StartTime}:T> **-** <t:${prjson.EndTime}:d> <t:${prjson.EndTime}:T> **│** ${locals.factions[prjson.Team2Name]} \` ${Team1Tickets} \` **-** ${locals.factions[prjson.Team1Name]} \` ${Team2Tickets} \``,
            embeds: [roundEmbed],
            components: [row],
            files: [file, filecl]
          },
          appliedTags: [locals.gameModes[prjson.MapMode].tagPriv, locals.layers[prjson.MapLayer].tagPriv]
        })*/
                fs.unlinkSync(path);
                /*var oldPathJson = 'logs/json/'+fileName1+'.json'
        var newPathJson = 'logs/json_formated/'+fileName1+'.json'

        fs.rename(oldPathJson, newPathJson, function (err) {
          if (err) throw err
          console.log('Successfully moved json!')
        })*/
                //await client.channels.cache.get('995387003409539073').send({ embeds: [roundEmbed],components: [row], files: [file] })
            }
        });
    };
};
