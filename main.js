const {Client, GatewayIntentBits, Collection, AttachmentBuilder, createWelcomeCard, ActivityType, EmbedBuilder} = require('discord.js');
require("dotenv").config({ path: "./bottoken.env" });
const client = new Client({
    intents:[GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Privileged
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences, // Privileged
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent, // Privileged
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution]
});

const {
    createCanvas,
    loadImage
} = require("@napi-rs/canvas");

const { GoogleGenAI } = require("@google/genai");
require("dotenv").config({ path: "./bottoken.env" });

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
const { getStrivePrompt } = require("./striveai");
const afkCommand = require("./commands/afk");

// Bot prefix
const prefix = "!";

const fs = require('fs');

const memberCounter = require('./counters/member-counter');

const API_KEY = 'DZkNATsSnqGGCtvmYMKrMNXwXiZf83pChCUBElOaDUqaV8ljQduGq2hS';

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on("guildMemberAdd", async (member) => {

    // Give Member role
    const role = member.guild.roles.cache.find(r => r.name === "Member");

    if (role) {
        await member.roles.add(role);
    }

    // Create canvas
    const canvas = createCanvas(1024, 450);
    const ctx = canvas.getContext("2d");

    // Background image
    const path = require("path");
    const background = await loadImage(
    path.join(__dirname, "assets", "welcomebg.png")
    );

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Dark overlay
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // White border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Avatar
    const avatar = await loadImage(
        member.user.displayAvatarURL({
            extension: "png",
            size: 512,
            forceStatic: true
        })
    );

    ctx.save();
    ctx.beginPath();
    ctx.arc(170, 225, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, 70, 125, 200, 200);

    ctx.restore();

    // Avatar border
    ctx.beginPath();
    ctx.arc(170, 225, 105, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#00bfff";
    ctx.stroke();

    const timestamp = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    ctx.font = "20px Sans";
    ctx.fillStyle = "#CFCFCF";
    ctx.textAlign = "right";

    // Convert to attachment
    const attachment = new AttachmentBuilder(
        await canvas.encode("png"),
        {
            name: "welcome.png"
        }
    );

    // Welcome channel
    const channel =
        member.guild.channels.cache.get("1532032502636740864");

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#2B2D31")
    .setTitle("🎉 Welcome to Strive SMP!")
    .setDescription(
`**We're so happy to have you join our community! ❤️**

📜 **Read the Rules ➜** <#1532032502636740866>

📢 **Latest Updates ➜** <#1532032502636740868>

🌍 **Minecraft Java IP and Port ➜**
\`keep-ii.gl.joinmc.link:9470\`

🎫 **Need Help? ➜**<#1532032502904914120>

💖 Enjoy your stay, make new friends, and have an amazing time in **Strive SMP!**`
    )
    .setImage("attachment://welcome.png")
    .setFooter({
        text: `${member.guild.name} • Member #${member.guild.memberCount}`
    })
    .setTimestamp();

await channel.send({
    content: `Welcome ${member} (${member.user.tag}) to **${member.guild.name}**! 🎉`,
    embeds: [embed],
    files: [attachment]
});
    
});
/* ==========================================
   STRIVE AI
   ========================================== */

async function askAI(question, username) { try { const response = await genAI.models.generateContent({ model: "gemini-3.5-flash-lite", contents: question, config: { systemInstruction: getStrivePrompt(username) } }); 
return response.text; } catch (error) { console.error( "❌ Gemini API Error:", error ); throw error; } }


// Commands
client.on("messageCreate", async message => {

    if (message.author.bot) return;
    // ==========================================
// AFK SYSTEM
// ==========================================

const afkUser = afkCommand.afkUsers.get(message.author.id);

if (afkUser) {

    const duration = afkCommand.formatDuration(
        Date.now() - afkUser.timestamp
    );

    afkCommand.afkUsers.delete(message.author.id);

    const embed = new EmbedBuilder()
        .setColor("#57F287")
        .setAuthor({
            name: `${message.author.username} is back`,
            iconURL: message.author.displayAvatarURL({
                extension: "png",
                size: 256
            })
        })
        .setTitle("👋 Welcome Back!")
        .setDescription(
            `<@${message.author.id}> is no longer AFK.`
        )
        .addFields(
            {
                name: "👤 User",
                value: `<@${message.author.id}>`,
                inline: true
            },
            {
                name: "⏱️ AFK Duration",
                value: duration,
                inline: true
            },
            {
                name: "📝 AFK Reason",
                value: afkUser.reason,
                inline: false
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

    await message.channel.send({
        embeds: [embed]
    });
}


// ==========================================
// CHECK MENTIONED AFK USERS
// ==========================================

for (const mentionedUser of message.mentions.users.values()) {

    const mentionedAFK = afkCommand.afkUsers.get(
        mentionedUser.id
    );

    if (!mentionedAFK) continue;

    mentionedAFK.mentions++;

    if (!mentionedAFK.mentionUsers.includes(message.author.id)) {

        mentionedAFK.mentionUsers.push(
            message.author.id
        );
    }

    const duration = afkCommand.formatDuration(
        Date.now() - mentionedAFK.timestamp
    );

    const embed = new EmbedBuilder()
        .setColor("#FAA61A")
        .setAuthor({
            name: `${mentionedAFK.username} is AFK`,
            iconURL: mentionedUser.displayAvatarURL({
                extension: "png",
                size: 256
            })
        })
        .setTitle("💤 AFK User")
        .setDescription(
            `<@${mentionedUser.id}> is currently AFK.`
        )
        .addFields(
            {
                name: "👤 User",
                value: `<@${mentionedUser.id}>\n\`${mentionedAFK.username}\``,
                inline: true
            },
            {
                name: "📝 Reason",
                value: mentionedAFK.reason,
                inline: true
            },
            {
                name: "⏱️ AFK Duration",
                value: duration,
                inline: true
            },
            {
                name: "🔔 Mentions",
                value: `${mentionedAFK.mentions}`,
                inline: true
            },
            {
                name: "🕐 AFK Since",
                value: `<t:${Math.floor(mentionedAFK.timestamp / 1000)}:R>`,
                inline: true
            },
            {
                name: "📌 Status",
                value: "💤 Currently AFK",
                inline: true
            }
        )
        .setThumbnail(
            mentionedUser.displayAvatarURL({
                extension: "png",
                size: 256
            })
        )
        .setFooter({
            text: "Strive SMP • AFK System"
        })
        .setTimestamp();

    await message.channel.send({
        embeds: [embed]
    });
}
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "ping") 
    {
        client.commands.get('ping').execute(message, args);
    }
    else if (command == "youtube") {
        client.commands.get('youtube').execute(message, args);
    }
    else if (command === "rules") {
        client.commands.get('rules').execute(message, args);
    }
    else if (command === "clear") {
        client.commands.get('clear').execute(message, args);
    }
    else if (command === "kick") {
        client.commands.get('kick').execute(message, args);
    }
    else if (command === "ban") {
        client.commands.get('ban').execute(message, args);
    }
    else if (command === "unban") {
        client.commands.get("unban").execute(message, args);
    }
    else if (command === "mute") {
        client.commands.get("mute").execute(message, args);
    }
    else if (command === "unmute") {
        client.commands.get("unmute").execute(message, args);
    }
    else if (command === "image") {
    client.commands.get("image").execute(message, args);
    }
    else if (command === "status") {
    client.commands.get("status").execute(message);
    }
    else if (command === "afk") {

    afkCommand.execute(message, args);

}
    else if (command === "ai") {

    const question = args.join(" ");

    if (!question) {
        return message.reply(
            "🤖 Please ask me something!\nExample: `!ai how do I join Strive SMP?`"
        );
    }

    try {

        await message.channel.sendTyping();

        const answer = await askAI(
            question,
            message.author.username
        );

        if (!answer) {
            return message.reply(
                "❌ I couldn't generate a response."
            );
        }

        // Discord message limit is 2000 characters
        if (answer.length <= 2000) {

            await message.reply(answer);

        } else {

            const chunks = answer.match(/[\s\S]{1,1900}/g);

            for (const chunk of chunks) {
                await message.channel.send(chunk);
            }
        }

    } catch (error) {

        console.error("Gemini Error:", error);

        await message.reply(
            "❌ Sorry, I couldn't connect to StriveAI right now."
        );
    }
}
});

client.once("clientReady", async () => {
    console.log("StrivesmpGuard is online!");
    console.log("Tag:", client.user.tag);
    console.log("ID:", client.user.id);
    console.log("Application ID:", client.application.id);
    await client.user.setPresence({
        
        status: "online",
        activities: [
            {
                name: "Strive SMP | By asish6339",
                type: ActivityType.Playing
            }
        ]
    });

    console.log("Presence:", client.user.presence?.status);

    memberCounter(client);
});


client.login(process.env.TOKEN);
