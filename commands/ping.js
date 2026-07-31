module.exports = {
    name: 'ping',
    description: 'This is a ping command!',
    execute(message, args) {
        console.log("Ping command executed");
        message.reply("🏓 Pong!");
    }
}