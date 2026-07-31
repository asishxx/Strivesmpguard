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
    const background = await loadImage(
        "https://m.media-amazon.com/images/I/61OFtTP3A0L._AC_UF1000,1000_QL80_.jpg"
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

    // Welcome text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Sans";

    ctx.fillText("WELCOME!", 330, 130);

    // Username
    ctx.font = "bold 42px Sans";

    ctx.fillStyle = "#00ffff";

    ctx.fillText(member.user.username, 330, 200);

    // Server name
    ctx.font = "30px Sans";

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        `Welcome to ${member.guild.name}`,
        330,
        260
    );

    // Member count
    ctx.fillStyle = "#FFD700";

    ctx.fillText(
        `Member #${member.guild.memberCount}`,
        330,
        320
    );

    // Footer
    ctx.font = "24px Sans";

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        "Check rules of the server in rules channel and enjoy your stay!",
        330,
        380
        
    );
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

    channel.send({
        content: `🎉 Welcome ${member} to **${member.guild.name}**!`,
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

client.once('clientReady', () => {
    console.log('StrivesmpGuard is online!');

    client.user.setPresence({
        status: "online",
        activities: [
            {
                name: "Protecting the server",
                type: ActivityType.Watching
            }
        ]
    });

    memberCounter(client);
});

require("dotenv").config({ path: "./bottoken.env" });

client.login(process.env.TOKEN);
