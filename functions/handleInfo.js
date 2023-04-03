import * as dotenv from "dotenv";
dotenv.config();

import request from "request";

//Discord

import locals from "../localization.json";

const MAP_NAME_CH = "1031262929275863060";
const MAP_DETAILS_CH = "1031263100420235366";

const RMOD_SV_INFO_URL = "https://servers.realitymod.com/api/ServerInfo";
const SERVER_ID = "e36e256110bcb081fdf8aace80b6f40db983b5ad";

export default (client) => {
    client.handleInfo = async () => {
        setInterval(function() {
            request(RMOD_SV_INFO_URL, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    let mafiaInfo = info.servers.find((info2) => {
                        try {
                            return info2.serverId.includes(SERVER_ID);
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


                    client.channels.cache.get(MAP_NAME_CH).setName("│Map: " + mapName);
                    client.channels.cache.get(MAP_DETAILS_CH).setName("│" + gameModes + ", " + layers + " | (" + numplayers + "/100)");



                    console.log(mapName);
                }
            });
        }, 310000);
    };
};
