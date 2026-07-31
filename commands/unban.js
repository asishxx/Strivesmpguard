const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unban a user from the server.',

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

        const userId = args[0];

        if (!userId) {
            return message.reply("Please provide the User ID of the user to unban.");
        }

        try {
            const bans = await message.guild.bans.fetch();

            if (!bans.has(userId)) {
                return message.reply("❌ This user is not banned.");
            }

            await message.guild.members.unban(userId);

            message.channel.send(`✅ User with ID **${userId}** has been unbanned.`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Failed to unban the user. Make sure the User ID is correct.");
        }
    }
};