const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getTagsID")
        .setDescription("Echos your inpout")
        .addStringOption((option) => 
            option
                .setName("ForumID")
                .setDescription("The ID of the forum")
                .setRequired(true),
        ),
    async execute(interaction) {
        const forumID = interaction.options.getString("ForumID");
        console.log(interaction.member.guild.channels.cache.get(forumID).availableTags);
        interaction.reply({
            content: `\`\`\`json ${interaction.member.guild.channels.cache.get(forumID).availableTags}\`\`\``,
            ephemeral: true
        });
    },
};