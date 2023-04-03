const fs = require("fs");

const Tail = require('always-tail');

const { handleBan } = require('./logs/ban');
const { handleAdminCommand } = require('./logs/admin');
const { handleJoin } = require('./logs/join');

module.exports = (client) => {
    client.handleLogs = async () => {/*
       ██        ██████     ███       ███ ███ ████     ███       ███            █████         █████       ██████  
      ██ ██      ███   ███  ██ ███   ████ ███ ██ ███   ███       ███          ███    ███    ██    ███   ███    ███
     ██  ███     ███    ███ ███ ███ █ ███ ███ ███ ███  ███       ███        ███        ███ ██            ███      
    ███   ███    ███    ███ ███  ███  ███ ███ ███  ███ ███       ███        ███        ███ ███             ███    
   ███████ ███   ███    ███ ███   ██  ███ ███ ███   ██ ███       ███        ███        ███ ███   ██████       ███ 
  ███       ███  ███   ███  ███       ███ ███ ███    ██ ██       ███          ███     ███   ███    ██   ███    ███
 ███         ███ ██████     ███       ███ ███ ███      ███       ██████████     █████        ██████       ██████  
    */
        var filenameBans = 'logs/banlist_info.log';
        if (!fs.existsSync(filenameBans)) fs.writeFileSync(filenameBans, "");
        tailBans = new Tail(filenameBans, '\n');

        tailBans.on("line", function(dataBans) {
            handleBan(dataBans, client);
        });




        var filenameAdmin = 'logs/ra_adminlog.txt';
        if (!fs.existsSync(filenameAdmin)) fs.writeFileSync(filenameAdmin, "");
        tailAdmins = new Tail(filenameAdmin, '\n');

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

        var filenameJoin = 'logs/joinlog.log';
        if (!fs.existsSync(filenameJoin)) fs.writeFileSync(filenameJoin, "");
        tailJoin = new Tail(filenameJoin, '\n');

        tailJoin.on("line", function(dataJoin) {
            handleJoin(dataJoin, client)
        });

        tailAdmins.on("error", function(error) {
            console.log('ERROR: ', error);
        });
        tailJoin.on("error", function(error) {
            console.log('ERROR: ', error);
        });

        tailAdmins.watch();
        tailJoin.watch();

    };
}
