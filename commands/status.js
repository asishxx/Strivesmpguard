const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "status",
    aliases: ["server", "mc"],

    async execute(message) {

        const server = "keep-ii.gl.joinmc.link";

        try {

            const response = await axios.get(
                `https://api.mcstatus.io/v2/status/java/${server}`,
                {
                    timeout: 10000
                }
            );

            const data = response.data;

            if (!data.online) {

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("<a:online:1538401822618820668> Strive SMP Server")
                            .setDescription("Server is currently **Offline**.")
                            .addFields(
                                {
                                    name: "Java IP",
                                    value: server,
                                    inline: true
                                },
                                {
                                    name: "Bedrock IP",
                                    value: data.ip_address || "Unknown",
                                    inline: true
                                },
                                {
                                    name: "Port",
                                    value: `${data.port || 25566}`,
                                    inline: true
                                }
                            )
                            .setTimestamp()
                    ]
                });

            }

            let motd = "No MOTD";

            if (data.motd?.clean) {
                motd = Array.isArray(data.motd.clean)
                    ? data.motd.clean.join("\n")
                    : data.motd.clean;
            }

            const players =
                data.players?.list?.length
                    ? data.players.list
                        .map(player => `• ${player.name_clean || player.name}`)
                        .join("\n")
                    : "No players online.";

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("<a:online:1538401822618820668> Strive SMP Server Status")
                .setDescription(`**${server}**`)
                .addFields(
                    {
                        name: "Status",
                        value: "🟢 Online",
                        inline: true
                    },
                    {
                        name: "Players",
                        value: `${data.players?.online ?? 0}/${data.players?.max ?? 0}`,
                        inline: true
                    },
                    {
                        name: "Version",
                        value: data.version?.name_clean || "Unknown",
                        inline: true
                    },
                    {
                        name: "Ping",
                        value: `${data.latency ?? "N/A"} ms`,
                        inline: true
                    },
                    {
                        name: "Java IP",
                        value: data.host || server,
                        inline: true
                    },
                    {
                        name: "Bedrock IP",
                        value: data.ip_address || "Unknown",
                        inline: true
                    },
                    {
                        name: "Port",
                        value: `${data.port || 25566}`,
                        inline: true
                    },
                    {
                        name: "📢 Server Info",
                        value: "<#1532032502636740868>",
                        inline: true
                    },
                    {
                        name: "MOTD",
                        value: motd.substring(0, 1024)
                    },
                )
                .setFooter({
                    text: "Powered by mcstatus.io"
                })
                .setTimestamp();

            const files = [];

            if (data.icon) {

                const base64 = data.icon.replace(
                    /^data:image\/png;base64,/,
                    ""
                );

                const buffer = Buffer.from(base64, "base64");

                const attachment = new AttachmentBuilder(buffer, {
                    name: "server-icon.png"
                });

                embed.setThumbnail("attachment://server-icon.png");

                files.push(attachment);
            }

            return message.reply({
                embeds: [embed],
                files
            });

        } catch (err) {

            console.error(err);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Error")
                        .setDescription("Unable to fetch Minecraft server status.")
                        .setTimestamp()
                ]
            });

        }

    }
};