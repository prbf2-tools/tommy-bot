import { Interaction } from "discord.js";
import { Client } from "../client.js";

export default async (client: Client, interaction: Interaction): Promise<void> => {
    if (interaction.isCommand()) { //======== COMMANDS ===========
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            // if (command.permissions && command.permissions.length > 0) {
            //     if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ content: "You do not have permissions to use this command.", ephemeral: true });
            // }

            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            const msg = {
                content: "There was an error while executing this command!",
                ephemeral: true
            };
            if (!interaction.deferred && !interaction.replied) await interaction.reply(msg);
            else await interaction.followUp(msg);
        }
    } else if (interaction.isStringSelectMenu()) { //======== SELECT MENUS ===========
    } else if (interaction.isButton()) { //======== BUTTONS ===========
        const button = client.buttons.get(interaction.customId);
        if (!button) {
            await interaction.reply({ content: `There was no button code found for this button. ${interaction.user.username}` });
            return;
        }

        try {
            await button.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this button!",
                ephemeral: true
            });
        }
    } else if (interaction.isModalSubmit()) { //======== MODALS ===========
        const modal = client.modals.get(interaction.customId);
        if (!modal) {
            await interaction.reply({ content: "There was no modal code found for this modal." });
            return;
        }

        try {
            await modal.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this modal!",
                ephemeral: true
            });
        }
    }
};
