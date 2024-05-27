import request from "request";

import config from "../config.js";
import locals from "../localization.json" assert { type: "json"};

export default (client) => {
    client.handleInfo = async () => {
        setInterval(function() {
            request("https://servers.realitymod.com/api/ServerInfo", function(error, response, body) {
                try {
                    if (!error && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        let mafiaInfo = info.servers.find((info2) => {
                            try {
                                return info2.serverId.includes(config.prspy.id);
                            } catch {
                                return false;
                            }
                        });
                        var mapName = mafiaInfo.properties.mapname;
                        var numplayers = mafiaInfo.properties.numplayers;
                        var gameModes = locals.gameModes[mafiaInfo.properties.gametype].short;
                        var layers = locals.layers[mafiaInfo.properties.bf2_mapsize].short;

                        client.channels.cache.get(config.prspy.mapChannelID).setName("│Map: " + mapName);
                        client.channels.cache.get(config.prspy.detailsChannelID).setName("│" + gameModes + ", " + layers + " | (" + numplayers + "/100)");
                    }
                } catch (e) {
                    console.log("Error HandleInfo: " + e);
                }
            });
        }, 310000);
    };
};
