const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Remove the timeout from a user.',

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

        // Get the mentioned member
        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Please mention a member to unmute.");
        }

        // Check if the bot can moderate the member
        if (!member.moderatable) {
            return message.reply("❌ I can't unmute this member.");
        }

        // Check if the member is actually muted
        if (!member.communicationDisabledUntil) {
            return message.reply("❌ This member is not muted.");
        }

        try {
            // Remove the timeout
            await member.timeout(null);

            message.channel.send(
                `🔊 **${member.user.tag}** has been unmuted.`
            );
        } catch (error) {
            console.error(error);
            message.reply("❌ Failed to unmute the member.");
        }
    }
};