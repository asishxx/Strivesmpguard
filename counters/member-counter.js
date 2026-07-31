module.exports = client => {
    const updateMemberCount = async () => {
        const guild = client.guilds.cache.get('1532032501906800822');
        setInterval(() => {
            const memberCount = guild.memberCount;
            const channel = guild.channels.cache.get('1532032502636740861');
            channel.setName(`Total Members: ${memberCount.toLocaleString()}`);
            console.log(`Updated member count to ${memberCount}`);
        }, 5000); 
    }
}
