const {Client, GatewayIntentBits, Collection, AttachmentBuilder, createWelcomeCard, ActivityType} = require('discord.js');

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
ctx.arc(278, 406, 172, 0, Math.PI * 2); // Avatar radius
ctx.closePath();
ctx.clip();

ctx.drawImage(
    avatar,
    106, // X
    234, // Y
    344, // Width
    344  // Height
);

ctx.restore();
// Avatar border
ctx.beginPath();
ctx.arc(278, 406, 184, 0, Math.PI * 2); // Border radius
ctx.lineWidth = 10;
ctx.strokeStyle = "#00BFFF";
ctx.shadowColor = "#66CCFF";
ctx.shadowBlur = 18;
ctx.stroke();
ctx.shadowBlur = 0;
    // Welcome text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Sans";
    const now = new Date();
    const timestamp = now.toLocaleString("en-IN", {
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

    ctx.fillText(
        `Joined: ${timestamp}`,
        990,
        420
    );


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

📜 **Read the Rules ➜** <#RULES_CHANNEL_ID>

📢 **Latest Updates ➜** <#ANNOUNCEMENT_CHANNEL_ID>

🌍 **Minecraft IP ➜**
\`play.strivesmp.com\`

🎫 **Need Help? ➜**
<#TICKET_CHANNEL_ID>

💖 Enjoy your stay, make new friends, and have an amazing time in **Strive SMP!**

🌟 **Member #${member.guild.memberCount}**`
    )
    .setImage("attachment://welcome.png")
    .setFooter({
        text: `${member.guild.name} • Welcome!`
    })
    .setTimestamp();

await channel.send({
    content: `Welcome ${member} (${member.user.tag}) to **${member.guild.name}**! 🎉`,
    embeds: [embed],
    files: [attachment]
});
    
});

// Commands
client.on("messageCreate", (message) => {
    console.log("messageCreate event fired");

    if (message.author.bot) return;
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
                name: "Protecting the server",
                type: ActivityType.Watching
            }
        ]
    });

    console.log("Presence:", client.user.presence?.status);

    memberCounter(client);
});

require("dotenv").config({ path: "./bottoken.env" });

client.login(process.env.TOKEN);
