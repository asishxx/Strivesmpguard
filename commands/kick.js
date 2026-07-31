const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server.',

    async execute(message, args) {

        // Allow only owner, admins, and moderators
        const isOwner = message.guild.ownerId === message.author.id;

        if (
            !isOwner &&
            !message.member.permissions.has(PermissionFlagsBits.Administrator) &&
            !message.member.permissions.has(PermissionFlagsBits.KickMembers)
        ) {
            return message.reply("❌ You don't have permission to use this command.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Please mention a member to kick.");
        }

        if (!member.kickable) {
            return message.reply("❌ Cannot kick this member.");
        }

        try {
            await member.kick();

            message.channel.send(`✅ ${member.user.tag} has been kicked from the server.`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Failed to kick the member.");
        }
    }
};