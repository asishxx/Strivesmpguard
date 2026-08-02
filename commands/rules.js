const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'rules',
    description: 'Displays the server rules.',

    execute(message, args) {

        const logo = new AttachmentBuilder('./assets/strivelogo.png', {
            name: 'strivelogo.png'
        });

        const banner = new AttachmentBuilder('./assets/strive banner.png', {
            name: 'strivebanner.png'
        });

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📜 StriveSMP Rules')
            .setDescription(
                "Welcome to **StriveSMP**!\n\n" +
                "Please read and follow the rules below to keep our community safe and enjoyable."
            )
            .addFields(
                {
                    name: '🤝 Respect Everyone',
                    value: 'Treat all members with kindness. Harassment, bullying, or hate speech is not allowed.'
                },
                {
                    name: '🚫 No Spamming',
                    value: 'Avoid spam, excessive mentions, or repeated messages.'
                },
                {
                    name: '⚔️ No Hacks or Cheats',
                    value: 'Using hacked clients, X-ray, or exploits is strictly prohibited.'
                },
                {
                    name: '💬 Keep Chats Appropriate',
                    value: 'Do not post NSFW, offensive, or inappropriate content.'
                },
                {
                    name: '👮 Follow Staff Instructions',
                    value: 'Respect staff decisions. If you have an issue, create a support ticket.'
                }
            )
            .setThumbnail('attachment://strivelogo.png')
            .setImage('attachment://strivebanner.png')
            .setFooter({
                text: 'Thank you for being part of StriveSMP ❤️'
            })
            .setTimestamp();

        message.reply({
            embeds: [embed],
            files: [logo, banner]
        });
    }
};