module.exports = client => {
    const guild = client.guilds.cache.get("1532032501906800822");

    if (!guild) return;

    setInterval(() => {
        const channel = guild.channels.cache.get("1532032502636740861");

        if (!channel) return;

        channel.setName(`Total Members: ${guild.memberCount}`);
    }, 5000);
};