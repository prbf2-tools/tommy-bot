import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";

import { GameMode, Layer, MapName, PRJSONExt } from "./interfaces";

const width = 400;
const height = 120;


const imagesDir = "assets/images/";
const flagsDir = imagesDir + "flags/";

export const createImage = async (prjson: PRJSONExt, mapName: MapName, mapLayer: Layer, mapGameMode: GameMode): Promise<Buffer> => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    const backgroundImg = await loadImage(mapName.imageUrl);
    context.drawImage(backgroundImg, 0, 0, width, height);

    const templateImg = await loadImage(imagesDir + "template.png");
    context.drawImage(templateImg, 0, 0, width, height);

    context.textAlign = "center";
    context.font = "bold 18pt Sans";
    context.fillStyle = "#fff";
    context.textBaseline = "top";
    context.fillText(mapName.name, 200, 15);

    context.textAlign = "center";
    context.font = "bold italic 12pt Sans";
    context.fillStyle = "#fff";
    context.textBaseline = "top";
    context.fillText(
        mapGameMode.name +
        ", " +
        mapLayer.name,
        200,
        44
    );

    if (prjson.MapMode == "gpm_gungame") {
        // fs.readFile("logs/gungame_winner.txt", "utf8", (err, data) => {
        //     console.log("\x1b[36m", data, "\x1b[0m");
        //     GGWinner = data;
        // });
        // console.log("Trying to read winner");
        // await sleep(3000);

        writeGGWinner(context, prjson.ggwinner);

        console.log("\x1b[36m", "IMAGE DONE GG", "\x1b[0m");
    } else {
        context.textAlign = "center";
        context.font = "bold 25pt Sans";
        context.fillStyle = "#fff";
        context.textBaseline = "top";
        context.fillText(prjson.truet1t, 161, 62);

        context.textAlign = "center";
        context.font = "bold 25pt Sans";
        context.fillStyle = "#fff";
        context.textBaseline = "top";
        context.fillText(prjson.truet2t, 239, 62);

        const flag1Img = await loadImage(flagsDir + prjson.Team1Name + ".png");
        context.drawImage(flag1Img, 280, 70, 50, 28);

        const flag2Img = await loadImage(flagsDir + prjson.Team2Name + ".png");
        context.drawImage(flag2Img, 71, 70, 50, 28);

        if (prjson.MapMode == "gpm_insurgency") {
            const imageCache = await loadImage(imagesDir + "Cache.png");
            context.drawImage(imageCache, 249, 68, 32, 32);

            console.log(
                "\x1b[36m",
                "IMAGE DONE CACHE",
                "\x1b[0m"
            );
        }
        console.log("\x1b[36m", "IMAGE DONE STD", "\x1b[0m");
    }

    return canvas.toBuffer("image/png");
};

const writeGGWinner = async (context: CanvasRenderingContext2D, winner: string) => {
    context.textAlign = "center";
    context.font = "bold 10pt Sans";
    context.fillStyle = "#fff";
    context.textBaseline = "top";
    context.fillText("Winner:", 200, 61);

    context.textAlign = "center";
    context.font = "bold 16pt Sans";
    context.fillStyle = "#fff";
    context.textBaseline = "top";
    context.fillText(winner, 200, 75);
};
