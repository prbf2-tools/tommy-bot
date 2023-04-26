import { Client as DiscordClient, GatewayIntentBits, Collection, ButtonBuilder, ButtonInteraction, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, CommandInteraction, ApplicationCommandData } from "discord.js";
import config from "./config.js";
import { registerComponents, registerEvents } from "./registry.js";

interface Component {
    data: {
        name: string
    },
}

interface ButtonComponent extends Component {
    builder(): ButtonBuilder
    execute(interaction: ButtonInteraction): Promise<void>
}

interface ModalComponent extends Component {
    builder(): ModalBuilder
    execute(interaction: ModalSubmitInteraction): Promise<void>
}

interface CommandComponent {
    data: SlashCommandBuilder
    execute(interaction: CommandInteraction): Promise<void>
}

export interface Components {
    button?: ButtonComponent
    command?: CommandComponent
    modal?: ModalComponent
}

export class Client extends DiscordClient {
    buttons: Collection<string, ButtonComponent>;
    commands: Collection<string, CommandComponent>;
    modals: Collection<string, ModalComponent>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
        });
        this.buttons = new Collection();
        this.commands = new Collection();
        this.modals = new Collection();
    }

    async loadComponents(): Promise<void> {
        await registerComponents(this, "./components");

        const commands = toApplicationCommand(this.commands);

        const guild = await this.guilds.fetch(config.guildID);
        if (!guild) {
            console.error("Couldn't fetch guild");
        }

        await guild.commands.set(commands);
    }

    async loadEvents(): Promise<void> {
        await registerEvents(this, "./events");
    }

    async login(token: string): Promise<string> {
        try {
            console.log("Logging in...");
            await super.login(token);
            console.log(`Logged in as ${this.user?.tag}`);
        } catch (e) {
            console.log(`Error logging in: ${e}`);
            process.exit(1);
        }

        try {
            console.log("Loading events...");
            await this.loadEvents();
            console.log("Loaded all events!");
        } catch (e) {
            console.log(`Error loading events: ${e}`);
        }

        try {
            console.log("Loading components...");
            await this.loadComponents();
            console.log("Loaded all components!");
        } catch (e) {
            console.log(`Error loading components: ${e}`);
        }

        return token;
    }
}

function toApplicationCommand(collection: Collection<string, CommandComponent>): ApplicationCommandData[] {
    // TODO: handle options and others
    // return collection.map(s => { return { name: s.data.name, description: s.data.description, options: s.data.options }; });
    return collection.map(s => { return { name: s.data.name, description: s.data.description }; });
}
