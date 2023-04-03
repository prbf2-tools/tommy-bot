module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isCommand()) { //======== COMMANDS ===========
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                if (command.permissions && command.permissions.length > 0) {
                    if (!interaction.member.permissions.has(command.permissions)) return await interation.reply({ content: "You do not have permissions to use this command.", ephemeral: true })
                }

                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        } else if (interaction.isSelectMenu()) { //======== SELECT MENUS ===========
        } else if (interaction.isButton()) { //======== BUTTONS ===========
            const button = client.buttons.get(interaction.customId);
            if (!button) return await interaction.reply({ content: `There was no button code found for this button. ${interaction.user.username}` })

            try {
                await button.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this button!',
                    ephemeral: true
                });
            }
        } else if (interaction.isModalSubmit()) { //======== MODALS ===========
            const modal = client.modals.get(interaction.customId);
            if (!modal) return await interaction.reply({ content: "There was no modal code found for this modal." })

            try {
                await modal.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this modal!',
                    ephemeral: true
                });
            }
        }
    }
}
