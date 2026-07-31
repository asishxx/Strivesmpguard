module.exports = {
    name: 'youtube',
    description: 'Send a youtube link!',
    execute(message, args) {
        console.log("youtube command executed");
        message.reply("Sorry, Not able to provide a youtube link at the moment,");
    }
}