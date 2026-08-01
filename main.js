const {Client, GatewayIntentBits, Collection, AttachmentBuilder, createWelcomeCard, ActivityType, EmbedBuilder} = require('discord.js');

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
\`keep-ii.gl.joinmc.link:25566\`

🎫 **Need Help? ➜**
<#1532032502904914120>

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

// Commands
client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command)
        || client.commands.find(c => c.aliases && c.aliases.includes(command));

    if (!cmd) return;

    cmd.execute(message, args);

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
                name: "Strive SMP | By <@1104803956745588768>",
                type: ActivityType.Playing
            }
        ]
    });

    console.log("Presence:", client.user.presence?.status);

    memberCounter(client);
});

require("dotenv").config({ path: "./bottoken.env" });

client.login(process.env.TOKEN);
