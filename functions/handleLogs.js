
var chokidar = require('chokidar');
var pather = require("path");
const fs = require("fs");
var Tail = require('always-tail');

var geoip = require('geoip-lite');

const locals = require('../localization.json');

const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');

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
            var banLogSplit = dataBans.split(' ')
            console.log(banLogSplit)
            var banAdmin = banLogSplit[banLogSplit.length - 2]
            var banName = banLogSplit[3]+' '+banLogSplit[4]
            var banHash = banLogSplit[2]
            var banIP = banLogSplit[5]
            if (banLogSplit[banLogSplit.length - 1] === '(perm)\r'){
                var banDuration = 'Permanently'
            } else if (banLogSplit[banLogSplit.length - 1] === '(round)\r'){
                var banDuration = 'Current Round'
            } else {
                var banTimeRaw = banLogSplit[banLogSplit.length - 1].replace('(','').replace(')','')
                var banTimeHour = Number(banTimeRaw) / 3600
                var banDuration = banTimeHour + ' Hours'
            }
            var banReason = banLogSplit.splice(6, banLogSplit.length).join(' ').split('banned by')[0]

            const banSendPub = {
                color: 0x991b0d,
                title: 'Banned player: '+banName,
                description: '\n**Reason:** '+banReason
                +'\n**Duration:** '+banDuration,
                footer: {
                    text: banAdmin+' In-Game'
                },
                timestamp: new Date(),
            }
            var geoready = 'INVALID'
            var banIP = banLogSplit[5];
            var geo2 = geoip.lookup(banIP);
            if (geo2 === null) {
                var geoready = "white";
            } else {
                var geoready = geo2.country.toLowerCase();
            }
            var banIPSafe = banIP.split('.')

            const banSendAdmin = {
                color: 0x991b0d,
                title: 'BANNED',
                description: '**Name:** `'+banName
                +'`\n**By:** `'+banAdmin
                +'`\n**Reason:** '+banReason
                +'\n**Duration:** '+banDuration
                +'\n**Hash-ID:** `'+banHash
                +'`\n**IP:** `'+banIPSafe[0]+'.'+banIPSafe[1]+'.***.***` :flag_'+geoready+':',
                timestamp: new Date(),
            }

            client.channels.cache.get('995387208947204257').send({ embeds: [banSendPub] }); //742795954729517077
            client.channels.cache.get('995520998554218557').send({ embeds: [banSendAdmin] });
        });
 
 
 
 
        var filenameAdmin = 'logs/ra_adminlog.txt';
        if (!fs.existsSync(filenameAdmin)) fs.writeFileSync(filenameAdmin, "");
        tailAdmins = new Tail(filenameAdmin, '\n');
        
        tailAdmins.on("line", function(dataAdmin) {
            adminLogSplit = dataAdmin.split(' ')
                if (adminLogSplit[2].includes('SESSIONERR') == true) {
                } else if (adminLogSplit[2].includes('!HASH') == true) {
                } else if (adminLogSplit[2].includes('!TEMPBAN') == true) {
                } else if (adminLogSplit[2].includes('!BAN') == true) {
                } else if (adminLogSplit[2].includes('!MAPVOTE') == true) {
                } else {
                    //console.log(adminLogSplit)
                    if (adminLogSplit[2].includes('!REPORTP') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[12].includes("'PRISM") == true){
                            if (adminLogSplit[15] === 'on'){
                                adminLogPost  = {
                                    color: 0X89a110,
                                    title: 'REPORT PLAYER',
                                    description: '**Performed by: **`'+adminLogSplit[14].replace("'",'')
                                    +'`\n**On user: **`'+adminLogSplit[16].replace("'",'')+' '+adminLogSplit[17].replace("':",'')
                                    +'`\n**Reason: **'+adminLogReason[1],
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'PRISM'
                                    }
                                }
                            } else {
                                adminLogPost  = {
                                    color: 0X89a110,
                                    title: 'REPORT',
                                    description: '**Performed by: **`'+adminLogSplit[14].replace("':",'')
                                    +'`\n**Reason: **'+adminLogReason[1],
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'PRISM'
                                    }
                                }
                            } 
                        } else {
                            if (adminLogSplit[14] === 'on'){
                                adminLogPost  = {
                                    color: 0X89a110,
                                    title: 'REPORT PLAYER',
                                    description: '**Performed by: **`'+adminLogSplit[12].replace("'",'')+' '+adminLogSplit[13].replace("'",'')
                                    +'`\n**On user: **`'+adminLogSplit[15].replace("'",'')+' '+adminLogSplit[16].replace("':",'')
                                    +'`\n**Reason: **'+adminLogReason[1],
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'IN-GAME'
                                    }
                                }
                            } else {
                                adminLogPost  = {
                                    color: 0X89a110,
                                    title: 'REPORT',
                                    description: '**Performed by: **`'+adminLogSplit[12].replace("'",'')+' '+adminLogSplit[13].replace("':",'')
                                    +'`\n**Reason: **'+adminLogReason[1],
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'IN-GAME'
                                    }
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!REPORT') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[13].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0X89a110,
                                title: 'REPORT',
                                description: '**Performed by: **`'+adminLogSplit[15].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0X89a110,
                                title: 'REPORT',
                                description: '**Performed by: **`'+adminLogSplit[13].replace("'",'')+' '+adminLogSplit[14].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!KICK') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[15].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0XEB7434,
                                title: 'KICK',
                                description: '**Performed by: **`'+adminLogSplit[17].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[19].replace("'",'')+' '+adminLogSplit[20].replace("':",'')
                                +'`\n**Reason: **`ERROR`',
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                            adminLogPostPub = {
                                color: 0XEB7434,
                                title: 'Kicked',
                                description: '**Performed by: **`'+adminLogSplit[17].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[19].replace("'",'')+' '+adminLogSplit[20].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'You can rejoin after getting kicked.'
                                }
                            }
                        } else if (adminLogSplit[15].includes("'SERVER'") == true){
                            if (adminLogReason[1].includes("Account related to banned key:") == true) {
                                adminLogPost  = {
                                    color: 0XEB7434,
                                    title: 'KICK',
                                    description: '**Performed by: **`SERVER'
                                    +'`\n**On user: **`'+adminLogSplit[17].replace("'",'')+' '+adminLogSplit[18].replace("':",'')
                                    +'`\n**Reason: **'+adminLogReason[1],
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'THIS MESSAGE DOES NOT EXIST! IF PLAYER ASK WHY THEY GET KICKED, JUST PING MAX AND TELL HIM THAT I\'LL LOOK INTO IT!'
                                    }
                                }
                                adminLogPostPub = {
                                    color: 0XEB7434,
                                    title: 'Kicked',
                                    description: '**Performed by: **`SERVER'
                                    +'`\n**On user: **`'+adminLogSplit[17].replace("'",'')+' '+adminLogSplit[18].replace("':",'')
                                    +'`\n**Reason: **`ERROR`',
                                    timestamp: new Date(),
                                }
                            } else {
                                adminLogPost  = {
                                    color: 0XEB7434,
                                    title: 'KICK',
                                    description: '**Performed by: **`SERVER'
                                    +'`\n**On user: **`'+adminLogSplit[17].replace("'",'')+' '+adminLogSplit[18].replace("':",'')
                                    +'`\n**Reason: **'+adminLogReason[1],
                                    timestamp: new Date(),
                                }
                                adminLogPostPub = {
                                    color: 0XEB7434,
                                    title: 'Kicked',
                                    description: '**Performed by: **`SERVER'
                                    +'`\n**On user: **`'+adminLogSplit[17].replace("'",'')+' '+adminLogSplit[18].replace("':",'')
                                    +'`\n**Reason: **'+adminLogReason[1],
                                    timestamp: new Date(),
                                    footer: {
                                        text: "You can rejoin after getting kicked."
                                    }
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0XEB7434,
                                title: 'KICK',
                                description: '**Performed by: **`'+adminLogSplit[15].replace("'",'')+' '+adminLogSplit[16].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[18].replace("'",'')+' '+adminLogSplit[19].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                            adminLogPostPub = {
                                color: 0XEB7434,
                                title: 'Kicked',
                                description: '**Performed by: **`'+adminLogSplit[15].replace("'",'')+' '+adminLogSplit[16].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[18].replace("'",'')+' '+adminLogSplit[19].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'You can rejoin after getting kicked.'
                                }
                            }
                        }
                        client.channels.cache.get('995387208947204257').send({ embeds: [adminLogPostPub] }); // to change
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!WARN') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[15].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0XEBCD34,
                                title: 'WARN',
                                description: '**Performed by: **`'+adminLogSplit[17].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[19].replace("'",'')+' '+adminLogSplit[20].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0XEBCD34,
                                title: 'WARN',
                                description: '**Performed by: **`'+adminLogSplit[15].replace("'",'')+' '+adminLogSplit[16].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[18].replace("'",'')+' '+adminLogSplit[19].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!RESIGN') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[13].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0Xbba170,
                                title: 'RESIGN',
                                description: '**Performed by: **`'+adminLogSplit[15].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[17].replace("'",'')+' '+adminLogSplit[18].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0Xbba170,
                                title: 'RESIGN',
                                description: '**Performed by: **`'+adminLogSplit[13].replace("'",'')+' '+adminLogSplit[14].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[16].replace("'",'')+' '+adminLogSplit[17].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!KILL') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[15].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0Xff8bcb,
                                title: 'KILL',
                                description: '**Performed by: **`'+adminLogSplit[17].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[19].replace("'",'')+' '+adminLogSplit[20].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0Xff8bcb,
                                title: 'KILL',
                                description: '**Performed by: **`'+adminLogSplit[15].replace("'",'')+' '+adminLogSplit[16].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[18].replace("'",'')+' '+adminLogSplit[19].replace("':",'')
                                +'`\n**Reason: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!INIT') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[15].includes("'PRISM") == true){
                            //console.log(client.channels.cache.get('1033130739505565716').availableTags)
                            adminLogPost  = {
                                color: 0X3f213f,
                                title: 'INIT',
                                description: '**Performed by: **`'+adminLogSplit[17].replace("':",'')
                                +'`\nAdminhashes and -powerlevels have been reloaded',
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0X3f213f,
                                title: 'INIT',
                                description: '**Performed by: **`'+adminLogSplit[15].replace("'",'')+' '+adminLogSplit[16].replace("':",'')
                                +'`\nAdminhashes and -powerlevels have been reloaded',
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!MESSAGE') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[12].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0X2c37ca,
                                title: 'MESSAGE',
                                description: '**Performed by: **`'+adminLogSplit[14].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[16].replace("'",'')+' '+adminLogSplit[17].replace("':",'')
                                +'`\n**Message: **'+adminLogReason[1].split(' ').reverse().slice(4).reverse().join(" "),
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0X2c37ca,
                                title: 'MESSAGE',
                                description: '**Performed by: **`'+adminLogSplit[12].replace("'",'')+' '+adminLogSplit[13].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[15].replace("'",'')+' '+adminLogSplit[16].replace("':",'')
                                +'`\n**Message: **'+adminLogReason[1].split(' ').reverse().slice(3).reverse().join(" "),
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!SAY') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[16].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0X34EB6B,
                                title: 'SAY',
                                description: '**Performed by: **`'+adminLogSplit[18].replace("':",'')
                                +'`\n**Content: **'+adminLogReason[1].split(' ').reverse().slice(4).reverse().join(" "),
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0X34EB6B,
                                title: 'SAY',
                                description: '**Performed by: **`'+adminLogSplit[16].replace("'",'')+' '+adminLogSplit[17].replace("':",'')
                                +'`\n**Content: **'+adminLogReason[1].split(' ').reverse().slice(3).reverse().join(" "),
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                    } else if (adminLogSplit[2].includes('!SETNEXT') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[12].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0X10a17d,
                                title: 'SETNEXT',
                                description: '**Performed by: **`'+adminLogSplit[14].replace("':",'')
                                +'`\n**Map: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                            adminLogPostPub  = {
                                color: 0X10a17d,
                                title: 'Next Map Set',
                                description: adminLogReason[1],
                                timestamp: new Date()
                            }
                        } else {
                            adminLogPost  = {
                                color: 0X10a17d,
                                title: 'SETNEXT',
                                description: '**Performed by: **`'+adminLogSplit[12].replace("'",'')+' '+adminLogSplit[13].replace("':",'')
                                +'`\n**Map: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                            adminLogPostPub  = {
                                color: 0X10a17d,
                                title: 'Next Map Set',
                                description: adminLogReason[1],
                                timestamp: new Date()
                            }
                        }
                        client.channels.cache.get('995387208947204257').send({ embeds: [adminLogPostPub] });
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                        
                    }  else if (adminLogSplit[2].includes('MAPVOTERESULT') == true) {
                        adminMapsVotesFull = dataAdmin.split("Vote finished: ")
                        adminMapsVotesEach = adminMapsVotesFull[1].split(' | ')
                        if (adminMapsVotesEach.length === 2) {
                            adminMapsVotesEachElem1 = adminMapsVotesEach[0].split(': ')
                            adminMapsVotesEachElem2 = adminMapsVotesEach[1].split(': ')
                            if (adminLogSplit[7].includes("'PRISM") == true){
                                adminLogPost  = {
                                    color: 0X5c32a8,
                                    title: 'MAP VOTE RESULTS',
                                    description: '**Performed by: **`'+adminLogSplit[9].replace("':",'')
                                    +'`\n**'+adminMapsVotesEachElem1[0]+': **`'+adminMapsVotesEachElem1[1]
                                    +'`\n**'+adminMapsVotesEachElem2[0]+': **`'+adminMapsVotesEachElem2[1]+'`',
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'PRISM'
                                    }
                                }
                                adminLogPostPub  = {
                                    color: 0X5c32a8,
                                    title: 'Map Vote Results',
                                    description: '**'+adminMapsVotesEachElem1[0]+': **`'+adminMapsVotesEachElem1[1]
                                    +'`\n**'+adminMapsVotesEachElem2[0]+': **`'+adminMapsVotesEachElem2[1]+'`',
                                    timestamp: new Date()
                                }
                            } else {
                                adminLogPost  = {
                                    color: 0X5c32a8,
                                    title: 'MAP VOTE RESULTS',
                                    description: '**Performed by: **`'+adminLogSplit[7].replace("'",'')+' '+adminLogSplit[8].replace("':",'')
                                    +'`\n**'+adminMapsVotesEachElem1[0]+': **`'+adminMapsVotesEachElem1[1]
                                    +'`\n**'+adminMapsVotesEachElem2[0]+': **`'+adminMapsVotesEachElem2[1]+'`',
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'IN-GAME'
                                    }
                                }
                                adminLogPostPub  = {
                                    color: 0X5c32a8,
                                    title: 'Map Vote Results',
                                    description: '**'+adminMapsVotesEachElem1[0]+': **`'+adminMapsVotesEachElem1[1]
                                    +'`\n**'+adminMapsVotesEachElem2[0]+': **`'+adminMapsVotesEachElem2[1]+'`',
                                    timestamp: new Date()
                                }
                            }
                        } else {
                            adminMapsVotesEachElem1 = adminMapsVotesEach[0].split(': ')
                            adminMapsVotesEachElem2 = adminMapsVotesEach[1].split(': ')
                            adminMapsVotesEachElem3 = adminMapsVotesEach[2].split(': ')
                            if (adminLogSplit[7].includes("'PRISM") == true){
                                adminLogPost  = {
                                    color: 0X5c32a8,
                                    title: 'MAP VOTE RESULTS',
                                    description: '**Performed by: **`'+adminLogSplit[9].replace("':",'')
                                    +'`\n**'+adminMapsVotesEachElem1[0]+': **`'+adminMapsVotesEachElem1[1]
                                    +'`\n**'+adminMapsVotesEachElem2[0]+': **`'+adminMapsVotesEachElem2[1]
                                    +'`\n**'+adminMapsVotesEachElem3[0]+': **`'+adminMapsVotesEachElem3[1]+'`',
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'PRISM'
                                    }
                                }
                                adminLogPostPub  = {
                                    color: 0X5c32a8,
                                    title: 'Map Vote Results',
                                    description: '**'+adminMapsVotesEachElem1[0]+': **`'+adminMapsVotesEachElem1[1]
                                    +'`\n**'+adminMapsVotesEachElem2[0]+': **`'+adminMapsVotesEachElem2[1]
                                    +'`\n**'+adminMapsVotesEachElem3[0]+': **`'+adminMapsVotesEachElem3[1]+'`',
                                    timestamp: new Date(),
                                }
                            } else {
                                adminLogPost  = {
                                    color: 0X5c32a8,
                                    title: 'MAP VOTE RESULTS',
                                    description: '**Performed by: **`'+adminLogSplit[7].replace("'",'')+' '+adminLogSplit[8].replace("':",'')
                                    +'`\n**'+adminMapsVotesEachElem1[0]+': **`'+adminMapsVotesEachElem1[1]
                                    +'`\n**'+adminMapsVotesEachElem2[0]+': **`'+adminMapsVotesEachElem2[1]
                                    +'`\n**'+adminMapsVotesEachElem3[0]+': **`'+adminMapsVotesEachElem3[1]+'`',
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'IN-GAME'
                                    }
                                }
                                adminLogPostPub  = {
                                    color: 0X5c32a8,
                                    title: 'Map Vote Results',
                                    description: '**'+adminMapsVotesEachElem1[0]+': **`'+adminMapsVotesEachElem1[1]
                                    +'`\n**'+adminMapsVotesEachElem2[0]+': **`'+adminMapsVotesEachElem2[1]
                                    +'`\n**'+adminMapsVotesEachElem3[0]+': **`'+adminMapsVotesEachElem3[1]+'`',
                                    timestamp: new Date()
                                }
                            }
                        }
                        
                        client.channels.cache.get('995387208947204257').send({ embeds: [adminLogPostPub] });
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost] });
                        
                    } else if (adminLogSplit[2].includes('!SWITCH') == true) {
                        adminLogReason = dataAdmin.split("': ")
                        if (adminLogSplit[13].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0X3292a8,
                                title: 'SWITCH',
                                description: '**Performed by: **`'+adminLogSplit[15].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[17].replace("'",'')+' '+adminLogSplit[18].replace("':",'')
                                +'`\n**When: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0X3292a8,
                                title: 'SWITCH',
                                description: '**Performed by: **`'+adminLogSplit[13].replace("'",'')+' '+adminLogSplit[14].replace("'",'')
                                +'`\n**On user: **`'+adminLogSplit[16].replace("'",'')+' '+adminLogSplit[17].replace("':",'')
                                +'`\n**When: **'+adminLogReason[1],
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost]});
                        
                    } else if (adminLogSplit[2].includes('!RUNNEXT') == true) {
                        adminLogReason = dataAdmin.split("': ")

                        fs.writeFile('logs/gungame_winner.txt', `Admin "!runnext"`, function (err) {
                            if (err) {
                              // append failed
                            } else {
                              // done
                            }
                        })

                        if (adminLogSplit[12].includes("'PRISM") == true){
                            adminLogPost  = {
                                color: 0X085441,
                                title: 'RUNNEXT',
                                description: '**Performed by: **`'+adminLogSplit[14].replace("':",'`'),
                                timestamp: new Date(),
                                footer: {
                                    text: 'PRISM'
                                }
                            }
                        } else {
                            adminLogPost  = {
                                color: 0X085441,
                                title: 'RUNNEXT',
                                description: '**Performed by: **`'+adminLogSplit[12].replace("'",'')+' '+adminLogSplit[13].replace("'",''),
                                timestamp: new Date(),
                                footer: {
                                    text: 'IN-GAME'
                                }
                            }
                        }
                        client.channels.cache.get('995520998554218557').send({ embeds: [adminLogPost]});
                        
                    } else {
                        client.channels.cache.get('995520998554218557').send("`"+adminLogSplit+"`");
                    }
                }
            
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
                let joinLoglines = dataJoin.trim().split("\n")
                var joinLogFormat = joinLoglines[joinLoglines.length - 1].toString('utf-8')
                var joinLogSplit = joinLogFormat.split('\t')
                if (joinLogSplit[6] == '(LEGACY)') {
                    var accType = 'Legacy'
                } else if (joinLogSplit[6] == '(VAC BANNED)') {
                    var accType = 'VAC Banned'
                } else if (joinLogSplit[6] == '(LEGACY)(VAC BANNED)') {
                    var accType = 'Legacy and VAC Banned'
                } else {
                    var accType = 'Standard'
                }
                var geoready = 'INVALID'
                var ip = joinLogSplit[5];
                var geo = geoip.lookup(ip);
                if (geo === null) {
                    var geoready = "white";
                } else {
                    var geoready = geo.country.toLowerCase();
                }
        
        
        
                const joinLogPost  = {
                    color: 0X6500B3,
                    title: joinLogSplit[3],
                    description: '**Hash-ID: **`'+joinLogSplit[1]
                    +'`\n**IP: **`'+joinLogSplit[5]+'` :flag_'+geoready
                    +':\n**Account Level: **'+joinLogSplit[2]
                    +'\n**Account Type: **'+accType
                    +'\n**Creation Date: **'+joinLogSplit[4]
                    +'\n**Joined: **'+joinLogSplit[0].replace('[','').replace(']',''),
                }
                client.channels.cache.get('995521059119960144').send({ embeds: [joinLogPost] });
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
