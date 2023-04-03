const { db } = require("../../db/db.js");
// const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "adminhashid",
  },
  async execute(interaction) {
    const hashDb = db.get("hashDb");
    const user = interaction.user;
    const hashId = interaction.fields.getTextInputValue("hashId");
    const ingameName = interaction.fields.getTextInputValue("ingameName");
    // const clanTag = interaction.fields.getTextInputValue("clanTag");
    // const timeZone = interaction.fields.getTextInputValue("timeZone");
    const hashIdExists = hashDb.find((hash) => hash.hashId === hashId);
    const userExists = hashDb.find((hash) => hash.id === user.id);
    if (hashIdExists) {
      interaction.reply({
        content: `Hash-ID \`${hashId}\` already exists.`,
        ephemeral: true,
      });
    } else if (userExists) {
      hashDb.remove({ id: user.id }).write();
      hashDb.push({
        id: user.id,
        hashId,
        ingameName,
        clanTag,
      });
      interaction.reply({
        content: `Your Hash-ID has been updated to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
        ephemeral: true,
      });
    } else {
      hashDb.push({
        id: user.id,
        hashId,
        ingameName,
        clanTag,
      });
      interaction.reply({
        content: `Success! Your Hash-ID has been set to \`${hashId}\`. It might take up to 5 minutes for the changes to take effect.`,
        ephemeral: true,
      });
    }
    return db.write();
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
