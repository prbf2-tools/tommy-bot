export default (client) => {
    client.handleEvents = async (eventFiles) => {
        for (const file of eventFiles) {
            const { default: e } = await import(`../events/${file}`);
            if (e.once) {
                client.once(e.name, (...args) => e.execute(...args, client));
            } else {
                client.on(e.name, (...args) => e.execute(...args, client));
            }
        }
    };
};
