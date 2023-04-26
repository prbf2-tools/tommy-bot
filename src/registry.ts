import * as fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

import { Client, Components } from "./client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerComponents(client: Client, ...dirs: string[]): Promise<void> {
    for (const dir of dirs) {
        const files = await fs.readdir(path.join(__dirname, dir));

        for (const file of files) {
            const stat = await fs.lstat(path.join(__dirname, dir, file));

            if (stat.isDirectory())
                await registerComponents(client, path.join(dir, file));
            else if (file.endsWith(".js")) {
                try {
                    const components: Components = (await import(path.join(__dirname, dir, file))).default;

                    if (components.button) {
                        const button = components.button;
                        client.buttons.set(button.data.name, button);
                    }
                    if (components.command) {
                        const command = components.command;
                        client.commands.set(command.data.name, command);
                    }
                    if (components.modal) {
                        const modal = components.modal;
                        client.modals.set(modal.data.name, modal);
                    }
                } catch (e) {
                    console.error(`Error loading components: ${e}`);
                }
            }
        }
    }
}

export async function registerEvents(client: Client, ...dirs: string[]): Promise<void> {
    for (const dir of dirs) {
        const files = await fs.readdir(path.join(__dirname, dir));

        for (const file of files) {
            const stat = await fs.lstat(path.join(__dirname, dir, file));

            if (stat.isDirectory())
                await registerEvents(client, path.join(dir, file));
            else if (file.endsWith(".js")) {
                const eventName = file.substring(0, file.indexOf(".js"));
                try {
                    const eventModule = (await import(path.join(__dirname, dir, file))).default;
                    client.on(eventName, eventModule.bind(null, client));
                } catch (e) {
                    console.log(`Error loading events: ${e}`);
                }
            }
        }
    }
}
