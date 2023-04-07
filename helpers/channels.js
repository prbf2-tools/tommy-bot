import { ChannelType } from "discord.js"
import db from "../db/db.js"

export const registerChannel = (key) => {
  const channels = db.get("channels")
  const channel = channels.find({ key: key }).value()
  if (channel === undefined) {
    setChannel(key, 0)
  }

  return () => {
    return getChannel(key)
  }
}

export const getChannel = (key) => {
  const channels = db.get("channels")
  return channels.find({ key: key }).value()
}

export const setChannel = (key, id) => {
  const channels = db.get("channels")
  const channel = channels.find({ key: key }).value()
  if (channel !== undefined) {
    channels.remove(channel).write()
  }
  channels.push({ key: key, id: id }).write()
}

export async function createChannels(client) {
  const payload = {
    name: "Tommy's Category",
    type: ChannelType.GuildCategory,
  }
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID)
    const channels = await guild.channels.fetch()
    const category = channels.find((c) => c.name === payload.name && c.type === payload.type)
    if (category === undefined) {
      category = await guild.channels.create({
        name: "Tommy's Category",
        type: ChannelType.GuildCategory,
      })
    }
    const localChannels = db.get("channels")
    localChannels.value().forEach(async (channel) => {
      if (channel.id === 0) {
        const newChannel = await guild.channels.create({
          name: channel.key,
          parent: category.id,
          type: ChannelType.GuildText,
        })
        setChannel(key, newChannel.id)
      }
    })
  } catch (e) {
    console.log(e)
  }
}
