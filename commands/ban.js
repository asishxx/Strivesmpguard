const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a user from the server.',

    async execute(message, args) {

        // Allow only owner, admins, and moderators
        const isOwner = message.guild.ownerId === message.author.id;

        if (
            !isOwner &&
            !message.member.permissions.has(PermissionFlagsBits.Administrator) &&
            !message.member.permissions.has(PermissionFlagsBits.BanMembers)
        ) {
            return message.reply("❌ You don't have permission to use this command.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Please mention a member to ban.");
        }

        if (!member.bannable) {
            return message.reply("❌ I can't ban this member.");
        }

        try {
            await member.ban({ reason: "Banned by a moderator." });

            message.channel.send(`🔨 ${member.user.tag} has been banned from the server.`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Failed to ban the member.");
        }
    }
};