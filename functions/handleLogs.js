import fs from "fs";
import Tail from "always-tail";
import { handleBan } from "./logs/ban";
import { handleAdminCommand } from "./logs/admin";
import { handleJoin } from "./logs/join";

export default (client) => {
    client.handleLogs = async () => {/*
       ██        ██████     ███       ███ ███ ████     ███       ███            █████         █████       ██████  
      ██ ██      ███   ███  ██ ███   ████ ███ ██ ███   ███       ███          ███    ███    ██    ███   ███    ███
     ██  ███     ███    ███ ███ ███ █ ███ ███ ███ ███  ███       ███        ███        ███ ██            ███      
    ███   ███    ███    ███ ███  ███  ███ ███ ███  ███ ███       ███        ███        ███ ███             ███    
   ███████ ███   ███    ███ ███   ██  ███ ███ ███   ██ ███       ███        ███        ███ ███   ██████       ███ 
  ███       ███  ███   ███  ███       ███ ███ ███    ██ ██       ███          ███     ███   ███    ██   ███    ███
 ███         ███ ██████     ███       ███ ███ ███      ███       ██████████     █████        ██████       ██████  
    */
        var filenameBans = "logs/banlist_info.log";
        if (!fs.existsSync(filenameBans)) fs.writeFileSync(filenameBans, "");
        let tailBans = new Tail(filenameBans, "\n");

        tailBans.on("line", function(dataBans) {
            handleBan(dataBans, client);
        });




        var filenameAdmin = "logs/ra_adminlog.txt";
        if (!fs.existsSync(filenameAdmin)) fs.writeFileSync(filenameAdmin, "");
        let tailAdmins = new Tail(filenameAdmin, "\n");

        tailAdmins.on("line", function(dataAdmin) {
            handleAdminCommand(dataAdmin, client);
        });
        /*███      ██████     ███ ████     ███       ███            █████         █████       ██████  
          ███    ███    ███   ███ ██ ███   ███       ███          ███    ███    ██    ███   ███    ███
          ███  ███        ███ ███ ███ ███  ███       ███        ███        ███ ██            ███      
          ███  ███        ███ ███ ███  ███ ███       ███        ███        ███ ███             ███    
          ███  ███        ███ ███ ███   ██ ███       ███        ███        ███ ███   ██████       ███ 
     ██   ███    ███    ███   ███ ███    ██ ██       ███          ███    ███    ███    ██   ███    ███
      █████        ██████     ███ ███      ███       ██████████     █████        ██████       ██████  */

        var filenameJoin = "logs/joinlog.log";
        if (!fs.existsSync(filenameJoin)) fs.writeFileSync(filenameJoin, "");
        let tailJoin = new Tail(filenameJoin, "\n");

        tailJoin.on("line", function(dataJoin) {
            handleJoin(dataJoin, client);
        });

        tailAdmins.on("error", function(error) {
            console.log("ERROR: ", error);
        });
        tailJoin.on("error", function(error) {
            console.log("ERROR: ", error);
        });

        tailAdmins.watch();
        tailJoin.watch();

    };
};
