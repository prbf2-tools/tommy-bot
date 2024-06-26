import dotenv from "dotenv";
dotenv.config();

import request from "request";
import locals from "../localization.json" assert { type: "json"};
import config from "../config.js";

//Discord


export default (client) => {
    client.handleInfo = async () => {
        setInterval(function() {
            request("https://servers.realitymod.com/api/ServerInfo", function(error, response, body) {
                try {
                    if (!error && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        let mafiaInfo = info.servers.find((info2) => {
                            try {
                                return info2.serverId.includes(config.prspySvID);
                            } catch {
                                return false;
                            }
                        });
                        var mapName = mafiaInfo.properties.mapname;
                        var numplayers = mafiaInfo.properties.numplayers;
                        var gameModes = locals.gameModes[mafiaInfo.properties.gametype].short;
                        var layers = locals.layers[mafiaInfo.properties.bf2_mapsize].short;

                        //client.channels.cache.get('1031262929275863060').setName('Players: '+numplayers+'/100')
                        //client.channels.cache.get('1031263100420235366').setName('Map: '+mapName)
                        //client.channels.cache.get(' TO CHANGE').setName(gameModes+', '+layers)   //used to be 1031263231240573028


                        client.channels.cache.get("1031262929275863060").setName("│Map: " + mapName);
                        client.channels.cache.get("1031263100420235366").setName("│" + gameModes + ", " + layers + " | (" + numplayers + "/100)");



                        console.log(mapName);
                    }
                } catch (e) {
                    console.log("Error HandleInfo: " + e);
                }
            });
        }, 310000);
    };
};
