const { EmbedBuilder } = require("discord.js");
const { status } = require("minecraft-server-util");

module.exports = {
    name: "status",
    aliases: ["server", "mc"],

    async execute(message) {

        const HOST = "keep-ii.gl.joinmc.link";
        const PORT = 25565;

        try {

            const result = await status(HOST, PORT, {
                timeout: 5000
            });

            const motd = result.motd?.clean
                ? Array.isArray(result.motd.clean)
                    ? result.motd.clean.join("\n")
                    : result.motd.clean
                : "No MOTD";

            const players = result.players?.sample?.length
                ? result.players.sample.map(p => `• ${p.name}`).join("\n")
                : "No players online.";

            const embed = new EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("🟢 StriveSMP Server")
                .setDescription(`**${HOST}**`)
                .addFields(
                    {
                        name: "Status",
                        value: "🟢 Online",
                        inline: true
                    },
                    {
                        name: "Players",
                        value: `${result.players.online}/${result.players.max}`,
                        inline: true
                    },
                    {
                        name: "Version",
                        value: result.version.name,
                        inline: true
                    },
                    {
                        name: "Protocol",
                        value: `${result.version.protocol}`,
                        inline: true
                    },
                    {
                        name: "Latency",
                        value: `${result.roundTripLatency} ms`,
                        inline: true
                    },
                    {
                        name: "Host",
                        value: HOST,
                        inline: true
                    },
                    {
                        name: "MOTD",
                        value: motd.substring(0, 1024)
                    },
                    {
                        name: "Online Players",
                        value: players.substring(0, 1024)
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: "Minecraft Server Status"
                });

            if (result.favicon) {
                embed.setThumbnail(result.favicon);
            }

            return message.reply({
                embeds: [embed]
            });

        } catch (err) {

            console.error(err);

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🔴 StriveSMP Server")
                .setDescription("Server is Offline or cannot be reached.")
                .addFields(
                    {
                        name: "Host",
                        value: HOST,
                        inline: true
                    },
                    {
                        name: "Port",
                        value: `${PORT}`,
                        inline: true
                    }
                )
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });
        }
    }
};