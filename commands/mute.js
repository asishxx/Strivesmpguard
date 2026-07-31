const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mute (timeout) a user for a specified time.',

    async execute(message, args) {

        // Allow only owner, admins, and moderators
        const isOwner = message.guild.ownerId === message.author.id;

        if (
            !isOwner &&
            !message.member.permissions.has(PermissionFlagsBits.Administrator) &&
            !message.member.permissions.has(PermissionFlagsBits.ModerateMembers)
        ) {
            return message.reply("❌ You don't have permission to use this command.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Please mention a member to mute.");
        }

        if (member.id === message.author.id) {
            return message.reply("❌ You cannot mute yourself.");
        }

        if (!member.moderatable) {
            return message.reply("❌ I can't mute this member.");
        }

        // Get duration (e.g. 10m, 1h, 2d)
        const duration = args[1];

        if (!duration) {
            return message.reply("❌ Please specify a duration. Example: `!mute @user 10m`");
        }

        const match = duration.match(/^(\d+)([smhd])$/);

        if (!match) {
            return message.reply("❌ Invalid duration. Use: 30s, 10m, 1h, or 2d.");
        }

        const value = parseInt(match[1]);
        const unit = match[2];

        let milliseconds;

        switch (unit) {
            case 's':
                milliseconds = value * 1000;
                break;
            case 'm':
                milliseconds = value * 60 * 1000;
                break;
            case 'h':
                milliseconds = value * 60 * 60 * 1000;
                break;
            case 'd':
                milliseconds = value * 24 * 60 * 60 * 1000;
                break;
        }

        try {
            await member.timeout(milliseconds, `Muted by ${message.author.tag}`);

            message.channel.send(
                `🔇 **${member.user.tag}** has been muted for **${duration}**.`
            );
        } catch (error) {
            console.error(error);
            message.reply("❌ Failed to mute the member.");
        }
    }
};