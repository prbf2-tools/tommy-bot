import db from '../../db/db'
// const { EmbedBuilder } = require("discord.js");

export default {
  data: {
    name: "adminhashid",
  },
  async execute(interaction) {
    try {
      const hashDb = db.get("hashDb");
      const user = interaction.user;
      const userId = user.id;
      const hashId = interaction.fields.getTextInputValue("hashId");
      const ingameName = interaction.fields.getTextInputValue("ingameName");
      const clanTag = interaction.fields.getTextInputValue("clanTag");
      // const timeZone = interaction.fields.getTextInputValue("timeZone");
      const hashIdExists = hashDb.find({ hashId: hashId }).value();
      const userExists = hashDb.find({ id: userId }).value();
      if (hashIdExists) {
        interaction.reply({
          content: `Hash-ID \`${hashId}\` already exists.`,
          ephemeral: true,
        });
      } else if (userExists) {
        hashDb.remove({ id: user.id }).write();
        hashDb
          .push({
            id: userId,
            hashId,
            ingameName,
            clanTag,
          })
          .write();
        interaction.reply({
          content: `Your Hash-ID has been updated to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
          ephemeral: true,
        });
      } else {
        hashDb
          .push({
            id: userId,
            hashId,
            ingameName,
            clanTag,
          })
          .write();
        interaction.reply({
          content: `Success! Your Hash-ID has been set to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
          ephemeral: true,
        });
      }
    } catch (e) {
      console.log("Error setting hash id", e);
    }
    // const embed = new EmbedBuilder()
    //   .setColor("#008be0")
    //   .setTitle(`🔹 ${interaction.user.username} Hash-ID`)
    //   .setThumbnail(interaction.user.avatarURL()).setDescription(`
    //             **Discord User:** <@${interaction.user.id}>
    //             **Hash ID: **\`${interaction.fields.getTextInputValue(
    //               "hashId"
    //             )}\`
    //             **In-game name: **\`${interaction.fields.getTextInputValue(
    //               "ingameName"
    //             )}\`
    //             **Clan Tag: **\`${interaction.fields.getTextInputValue(
    //               "clanTag"
    //             )}\`
    //             **Time Zone: **\`${interaction.fields.getTextInputValue(
    //               "timeZone"
    //             )}\`
    //         `);
    // await interaction.reply({
    //   content: `Success! Your Hash-ID has been set to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
    //   ephemeral: true,
    // });
  },
};
