const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Clears a specified number of messages from the channel.',

    async execute(message, args) {

        // Only Mods/Admins/Owner
        if (
            !message.member.permissions.has(PermissionFlagsBits.ManageMessages) &&
            !message.member.permissions.has(PermissionFlagsBits.Administrator)
        ) {
            return message.reply("❌ You don't have permission to use this command.");
        }

        if (!args[0]) {
            return message.reply("Please specify the number of messages to clear.");
        }

        if (isNaN(args[0])) {
            return message.reply("Please provide a valid number.");
        }

        const amount = parseInt(args[0]);

        if (amount > 100) {
            return message.reply("You can only clear up to 100 messages at a time.");
        }

        if (amount < 1) {
            return message.reply("You must clear at least 1 message.");
        }

        try {
            // +1 deletes the command message too
            await message.channel.bulkDelete(amount + 1, true);

            const msg = await message.channel.send(
                `✅ Successfully deleted **${amount}** messages.`
            );

            setTimeout(() => msg.delete().catch(() => {}), 3000);

        } catch (err) {
            console.error(err);
            message.reply("❌ I couldn't delete the messages. Messages older than 14 days cannot be bulk deleted.");
        }
    }
};