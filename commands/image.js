const axios = require("axios");

const API_KEY = "YOUR_PEXELS_API_KEY";

module.exports = {
    name: "image",
    description: "Search for an image from Pexels.",

    async execute(message, args) {

        if (!args.length) {
            return message.reply("❌ Please enter an image name.");
        }

        const query = args.join(" ");

        try {

            const response = await axios.get(
                "https://api.pexels.com/v1/search",
                {
                    headers: {
                        Authorization: API_KEY
                    },
                    params: {
                        query: query,
                        per_page: 1
                    }
                }
            );

            if (!response.data.photos.length) {
                return message.reply("❌ No image found.");
            }

            const image = response.data.photos[0];

            await message.channel.send({
                content: `🖼️ **Result for:** **${query}**\n${image.src.large}`
            });

        } catch (error) {
            console.error(error);

            message.reply("❌ Failed to fetch image.");
        }
    }
};