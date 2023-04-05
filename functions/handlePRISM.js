import dotenv from "dotenv"
dotenv.config()

import net from "net"
import crypto from "crypto"
import fs from "fs"

import rand from "csprng"

let netClient = new net.Socket()

// hash sums
var passwordhash = crypto.createHash("sha1")
var saltedpass = crypto.createHash("sha1")
var challengedigest = crypto.createHash("sha1")

//Generate a client Challenge key.
var theCCK = rand(160, 36)

//const { data } = require("../commands/moderation/prban");

//Prism Step1


export default (client) => {
    client.handlePRISM = async () => {
        const hexString = "\x01login1\x02" + "1\x03" + process.env.PRISM_USRNAME + "\x03" + theCCK + "\x04\x00"
        const netConnect = () => { netClient.connect(process.env.PRISM_PORT, process.env.PRISM_IP) }
        try {
            netClient.once("connect", () => {
                console.log("Connected to PRISM API")
                netClient.write(hexString)
            })
            netClient.on("error", (e) => {
                console.log("The PRISM connection was lost")
                console.log(e)
                console.log("Waiting for 10 seconds before trying again")
                netClient.destroy()
                setTimeout(netConnect, 10000)
            })
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
            console.error(error)
        }
        function messageHandler(messages) {
            const data = messages.toString("utf-8")
            //console.log(data)      // <--------------------------------------------------------------- DEBUG HERE <---------------------------------------------------------------------
            const subject = data.split("\x01")[1].split("\x02")[0]
            const fields = data.split("\x01")[1].split("\x02")[1].split("\x04")[0].split("\x03")
            //dataSplit = data.split('\n')
            //console.log(fields)
            //console.log('Subject: '+subject)
            //Prism Step2
            if (subject == "login1") {
                passwordhash.update(process.env.PRISM_USRPW)
                saltedpass.update(fields[0] + "\x01" + passwordhash.digest("hex"))
                challengedigest.update(process.env.PRISM_USRNAME + "\x03" + theCCK + "\x03" + fields[1] + "\x03" + saltedpass.digest("hex"))
                writeToClient(netClient, "login2", challengedigest.digest("hex"))
            }
            // Success subject
            else if (subject == "APIAdminResult") {
                if (data == "APIAdminResult") {
                    console.log(data)
                }
            }
            // PRISM interactive chat to Discord
            else if (subject == "chat") {
                const fieldsReady = fields.join("##^##").split("\n").map(v => v.split("##^##"))


                //console.log(fieldsReady+'\n\n\n')


                fieldsReady.forEach(function(dataLenght) {
                    //console.log(dataLenght)
                    //fieldsReady = dataLenght.split('\1')[1].split('\2')[1].split('\4')[0].split('\3')

                    let SquadNum = ""
                    let Player = ""
                    if (dataLenght != "") {
                        const time = dataLenght[1].split(".")[0]
                        const type = dataLenght[2]
                        const playerRaw = dataLenght[3]
                        const contentString = dataLenght[4]
                        SquadNum = dataLenght[2].split(" ")[1]

                        if (playerRaw != "") {
                            Player = playerRaw + " ` **|** ` "
                        }



                        let formatedFields = ""
                        if (type.includes("Game")) {
                            if (type.includes("(OpFor)")) {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🔳🔴 \` Game OpFor\` **|** \` ${Player}${contentString}\``
                            } else if (type.includes("(BluFor)")) {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🔳🔵 \` Game BluFor\` **|** \` ${Player}${contentString}\``
                            } else {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🔳 \` Game \` **|** \` ${Player}${contentString}\``
                            }
                        } else if (type == "Admin Alert") {
                            formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🟥 \` Admin Alert \` **|** \` ${Player}${contentString}\``
                        } else if (type == "Response") {
                            formatedFields = `<t:${time}:d> <t:${time}:T> **|** 🟨 \` Response \` **|** \` ${Player}${contentString}\``
                        } else if (type == "Global ") {
                            formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜ \` Global \` **|** \` ${Player}${contentString}\``
                        } else if (type.includes("BluFor") == true) {
                            if (type == "BluFor") {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔵 \` BluFor \` **|** \` ${Player}${contentString}\``
                            } else if (SquadNum == "*") {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔵 \` BluFor ${SquadNum} \` **|** \` ${Player}${contentString}\``
                            } else {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔵🟢 \` BluFor ${SquadNum} \` **|** \` ${Player}${contentString}\``
                            }
                        } else if (type.includes("OpFor")) {
                            if (type == "OpFor") {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔴 \` OpFor \` **|** \` ${Player}${contentString}\``
                            } else if (SquadNum == "*") {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔴 \` OpFor ${SquadNum} \` **|** \` ${Player}${contentString}\``
                            } else {
                                formatedFields = `<t:${time}:d> <t:${time}:T> **|** ⬜🔴🟢 \` OpFor ${SquadNum} \` **|** \` ${Player}${contentString}\``
                            }
                        } else {
                            formatedFields = "`" + dataLenght + "`"
                        }


                        var tkString = fields[fields.length - 1].split(" ")

                        client.channels.cache.get("1022258448508928031").send(formatedFields)
                        //client.channels.cache.get('1022258448508928031').send("`"+fields+"`");
                        if (tkString[5] == "m]") {
                            tkString = fields[fields.length - 1].split(" ")
                            //console.log(fields[fields.length-1].split(' '))
                            const adminLogPost = {
                                color: 0Xa7367b,
                                title: "TEAMKILL",
                                description: "**Performed by: **`" + tkString[0] + " " + tkString[1] + "`"
                                    + "\n**On player: **`" + tkString[6] + " " + tkString[7].replace("\n", "") + "`"
                                    + "\n**With: **`" + tkString[2].slice(1) + "` : `" + tkString[4] + "m`",
                                timestamp: new Date(),
                                footer: {
                                    text: "IN-GAME"
                                }
                            }
                            client.channels.cache.get("1033130972264276018").send({ content: "`" + fields[fields.length - 1].split(" ") + "`", embeds: [adminLogPost] })





                        }
                        else if (dataLenght[dataLenght.length - 1].includes("is victorious!") == true) {
                            var ggWinner = dataLenght[dataLenght.length - 1].split(" ")
                            console.log("GUNGAME WINNER::::" + ggWinner[1].slice(0, -2))
                            fs.writeFile("logs/gungame_winner.txt", ggWinner[1].slice(0, -2), function(err) {
                                if (err) {
                                    // append failed
                                } else {
                                    // done
                                }
                            })
                            //gungame_winner.txt
                        } else if (contentString.includes("!cookie") == true) {
                            writeToClient(netClient, "say", "!w " + Player.split(" ")[1] + " NOM! You have ate a cookie!")
                        }
                    }
                })
            }
        }
        var msg_buffer = ""
        netClient.on("data", function(rawData) {
            msg_buffer += rawData.toString("utf-8")
            while (msg_buffer.includes("\x04\x00")) {
                const length = msg_buffer.indexOf("\x04\x00")
                const msg = msg_buffer.substr(0, length)
                msg_buffer = msg_buffer.substr(length + 2)
                messageHandler(msg)
            }
        })
        // useful, subject can be 'say' with an args to be an in-game commands that will be executed. No way to catch the responce yet.
    }
}
export const writePrism = (subject, args) => {
    writeToClient(netClient, subject, args)
}

export const writePrism2 = (subject, args) => {
    writeToClient(netClient, subject, args)
}

export const writePrismSD = (subject) => {
    writeToClient(netClient, subject, "")
    console.log("\x01" + subject + "\x02\x04\x00")
}

function writeToClient(client, subject, args) {
    client.write("\x01" + subject + "\x02" + args + "\x04\x00")
}
