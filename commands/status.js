const { status } = require("minecraft-server-util");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "status",
    description: "Shows Minecraft server status.",

    async execute(message) {

        try {

            const response = await status("keep-ii.gl.joinmc.link", 25566);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🟢 StriveSMP Server Status")
                .addFields(
                    {
                        name: "🌍 Server",
                        value: "keep-ii.gl.joinmc.link:25566",
                        inline: false
                    },
                    {
                        name: "👥 Players",
                        value: `${response.players.online}/${response.players.max}`,
                        inline: true
                    },
                    {
                        name: "🎮 Version",
                        value: response.version.name,
                        inline: true
                    },
                    {
                        name: "📝 MOTD",
                        value: response.motd.clean.join("\n"),
                        inline: false
                    }
                )
                .setTimestamp();

            message.channel.send({
                embeds: [embed]
            });

        } catch (err) {

            console.error(err);

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🔴 StriveSMP Server")
                .setDescription("Server is Offline or cannot be reached.")
                .setTimestamp();

            message.channel.send({
                embeds: [embed]
            });

        }

    }
};