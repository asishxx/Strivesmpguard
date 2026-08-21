const {
    EmbedBuilder
} = require("discord.js");

// Store AFK users
const afkUsers = new Map();

function formatDuration(milliseconds) {

    let seconds = Math.floor(milliseconds / 1000);

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(" ");
}

module.exports = {
    name: "afk",

    async execute(message, args) {

        const reason = args.join(" ") || "AFK";

        const existing = afkUsers.get(message.author.id);

        if (existing) {

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#ffcc00")
                        .setTitle("⚠️ You are already AFK")
                        .setDescription(
                            `You are already marked as AFK.\n\n` +
                            `📝 **Reason:** ${existing.reason}\n` +
                            `⏱️ **Duration:** ${formatDuration(Date.now() - existing.timestamp)}`
                        )
                        .setThumbnail(message.author.displayAvatarURL({
                            extension: "png",
                            size: 256
                        }))
                        .setFooter({
                            text: "Strive SMP • AFK System"
                        })
                        .setTimestamp()
                ]
            });
        }

        const afkData = {
            userId: message.author.id,
            username: message.author.username,
            displayName: message.member?.displayName || message.author.username,
            reason: reason,
            timestamp: Date.now(),
            mentions: 0,
            mentionUsers: []
        };

        afkUsers.set(message.author.id, afkData);

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setAuthor({
                name: `${message.author.username} is now AFK`,
                iconURL: message.author.displayAvatarURL({
                    extension: "png",
                    size: 256
                })
            })
            .setTitle("💤 AFK Mode Enabled")
            .setDescription(
                `<@${message.author.id}> is now AFK.`
            )
            .addFields(
                {
                    name: "👤 User",
                    value: `<@${message.author.id}>\n\`${message.author.username}\``,
                    inline: true
                },
                {
                    name: "📝 Reason",
                    value: reason,
                    inline: true
                },
                {
                    name: "⏱️ AFK Duration",
                    value: "0s",
                    inline: true
                },
                {
                    name: "🔔 Mentions",
                    value: "0",
                    inline: true
                },
                {
                    name: "🕐 Started",
                    value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                    inline: true
                },
                {
                    name: "📌 Status",
                    value: "💤 Currently AFK",
                    inline: true
                }
            )
            .setThumbnail(
                message.author.displayAvatarURL({
                    extension: "png",
                    size: 256
                })
            )
            .setFooter({
                text: "Strive SMP • AFK System"
            })
            .setTimestamp();

        await message.reply({
            embeds: [embed]
        });
    },

    afkUsers,
    formatDuration
};