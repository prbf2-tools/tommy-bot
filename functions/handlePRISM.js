import * as dotenv from 'dotenv'
dotenv.config()

import crypto from 'crypto'
import net from 'net';

// networking
let netClient = new net.Socket();

// hash sums
var passwordhash = crypto.createHash('sha1')
var saltedpass = crypto.createHash('sha1')
var challengedigest = crypto.createHash('sha1')

//Generate a client Challenge key.
import rand from 'csprng';
var theCCK = rand(160, 36);

var fs = require('fs');
//const { data } = require("../commands/moderation/prban");

function messageHandler(messages) {
    const data = messages.toString('utf-8')
    //console.log(data)      // <--------------------------------------------------------------- DEBUG HERE <---------------------------------------------------------------------
    subject = data.split('\1')[1].split('\2')[0]
    fields = data.split('\1')[1].split('\2')[1].split('\4')[0].split('\3')
    //dataSplit = data.split('\n')
    //console.log(fields)
    //console.log('Subject: '+subject)
    //Prism Step2
    if (subject == 'login1') {
        login()
    }
    // Success subject
    else if (subject == 'APIAdminResult') {
        var prismRes = 'Bad'
        if (data == 'APIAdminResult') {
            prismRes = 'Good'
            console.log(data)
        }
    }
    // PRISM interactive chat to Discord
    else if (subject == 'chat') {
        chat(fields)
    }
}

function login() {
    passwordhash.update(process.env.PRISM_USRPW)
    saltedpass.update(fields[0] + "\1" + passwordhash.digest('hex'))
    challengedigest.update(process.env.PRISM_USRNAME + "\3" + theCCK + "\3" + fields[1] + "\3" + saltedpass.digest('hex'))
    var login2 = '\1login2\2' + challengedigest.digest('hex') + '\4\0'
    netClient.write(login2)
}

function chat(fields) {
    fieldsReady = fields.join('##^##').split('\n').map(v => v.split('##^##'))


    //console.log(fieldsReady+'\n\n\n')


    fieldsReady.forEach(function(dataLenght) {
        //console.log(dataLenght)
        //fieldsReady = dataLenght.split('\1')[1].split('\2')[1].split('\4')[0].split('\3')

        SquadNum = ''
        Player = ''
        if (dataLenght != '') {
            const time = dataLenght[1].split('.')[0]
            const type = dataLenght[2]
            const playerRaw = dataLenght[3]
            const contentString = dataLenght[4]
            const SquadNum = dataLenght[2].split(' ')[1]

            if (playerRaw != '') {
                Player = playerRaw + ' \` **|** \` '
            }



            if (type.includes('Game')) {
                if (type.includes('(OpFor)')) {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🔳🔴 \` Game OpFor\` **|** \` ${Player}${contentString}\``
                } else if (type.includes('(BluFor)')) {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🔳🔵 \` Game BluFor\` **|** \` ${Player}${contentString}\``
                } else {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🔳 \` Game \` **|** \` ${Player}${contentString}\``
                }
            } else if (type == 'Admin Alert') {
                var formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🟥 \` Admin Alert \` **|** \` ${Player}${contentString}\``
            } else if (type == 'Response') {
                var formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🟨 \` Response \` **|** \` ${Player}${contentString}\``
            } else if (type == 'Global ') {
                var formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜ \` Global \` **|** \` ${Player}${contentString}\``
            } else if (type.includes('BluFor') == true) {
                if (type == 'BluFor') {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔵 \` BluFor \` **|** \` ${Player}${contentString}\``
                } else if (SquadNum == '*') {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔵 \` BluFor ${SquadNum} \` **|** \` ${Player}${contentString}\``
                } else {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔵🟢 \` BluFor ${SquadNum} \` **|** \` ${Player}${contentString}\``
                }
            } else if (type.includes('OpFor')) {
                if (type == 'OpFor') {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔴 \` OpFor \` **|** \` ${Player}${contentString}\``
                } else if (SquadNum == '*') {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔴 \` OpFor ${SquadNum} \` **|** \` ${Player}${contentString}\``
                } else {
                    var formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔴🟢 \` OpFor ${SquadNum} \` **|** \` ${Player}${contentString}\``
                }
            } else {
                var formatedFields = "`" + dataLenght + "`"
            }

            var tkString = fields[fields.length - 1].split(' ')

            client.channels.cache.get('1022258448508928031').send(formatedFields);
            //client.channels.cache.get('1022258448508928031').send("`"+fields+"`");
            if (tkString[5] == 'm]') {
                var tkString = fields[fields.length - 1].split(' ')
                //console.log(fields[fields.length-1].split(' '))
                adminLogPost = {
                    color: 0Xa7367b,
                    title: 'TEAMKILL',
                    description: '**Performed by: **`' + tkString[0] + ' ' + tkString[1] + '`'
                        + '\n**On player: **`' + tkString[6] + ' ' + tkString[7].replace("\n", '') + '`'
                        + '\n**With: **`' + tkString[2].slice(1) + '` : `' + tkString[4] + 'm`',
                    timestamp: new Date(),
                    footer: {
                        text: 'IN-GAME'
                    }
                }
                client.channels.cache.get('1033130972264276018').send({ content: '`' + fields[fields.length - 1].split(' ') + '`', embeds: [adminLogPost] });
            }
            else if (dataLenght[dataLenght.length - 1].includes('is victorious!') == true) {
                var ggWinner = dataLenght[dataLenght.length - 1].split(' ')
                console.log('GUNGAME WINNER::::' + ggWinner[1].slice(0, -2))
                fs.writeFile('logs/gungame_winner.txt', ggWinner[1].slice(0, -2), function(err) {
                    if (err) {
                        // append failed
                    } else {
                        // done
                    }
                })
                //gungame_winner.txt
            } else if (contentString.includes('!cookie') == true) {
                netClient.write('\1say\2!w ' + Player.split(' ')[1] + ' NOM! You have ate a cookie!\4\0')
            }
        }
    })
}


module.exports = (client) => {
    client.handlePRISM = async () => {
        const hexString = '\1login1\2' + '1\3' + process.env.PRISM_USRNAME + '\3' + theCCK + '\4\0';
        const netConnect = () => { netClient.connect(process.env.PRISM_PORT, process.env.PRISM_IP) }
        try {
            netClient.once('connect', () => {
                console.log("Connected to PRISM API");
                netClient.write(hexString);
            });
            netClient.on('error', (e) => {
                console.log('The PRISM connection was lost');
                console.log(e);
                console.log('Waiting for 10 seconds before trying again')
                netClient.destroy()
                setTimeout(netConnect, 10000)
            });
            netClient.on("close", () => {
                console.log("The PRISM connection was closed")
                netClient.destroy()
                setTimeout(netConnect, 10000)
            })
            netClient.on("end", () => {
                console.log("The PRISM connection was ended")
                netClient.destroy()
                setTimeout(netConnect, 10000)
            })
            netConnect()
        } catch (error) {
            console.error(error);
        }
        var msg_buffer = "";
        netClient.on("data", function(rawData) {
            msg_buffer += rawData.toString('utf-8')
            while (msg_buffer.includes("\4\0")) {
                const length = msg_buffer.indexOf("\4\0");
                const msg = msg_buffer.substr(0, length);
                msg_buffer = msg_buffer.substr(length + 2);
                messageHandler(msg);
            }
        })
        // useful, subject can be 'say' with an args to be an in-game commands that will be executed. No way to catch the responce yet.
        module.exports.writePrism = (subject, args) => {
            netClient.write('\1' + subject + '\2' + args + '\4\0')
        }
        module.exports.writePrism2 = (subject, args) => {
            netClient.write('\1' + subject + '\2' + args + '\4\0')
        }
        //No clue why this exist?
        module.exports.writePrismSD = (subject) => {
            netClient.write('\1' + subject + '\2\4\0')
            console.log('\1' + subject + '\2\4\0')
        }
    }
}
