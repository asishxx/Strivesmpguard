module.exports = client => {
    const updateMemberCount = () => {
        const guild = client.guilds.cache.get("1532032501906800822");

        setInterval(() => {
            const memberCount = guild.memberCount;
            const channel = guild.channels.cache.get("1532032502636740861");

            if (channel) {
                channel.setName(`Total Members: ${memberCount}`);
            }
        }, 5000);
    };

    updateMemberCount();
};