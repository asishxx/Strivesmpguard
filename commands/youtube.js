module.exports = {
    name: 'youtube',
    description: 'Send a youtube link!',
    execute(message, args) {
        console.log("youtube command executed");
        message.reply('https://youtube.com/@strivesmp44?si=5yVE7pe90u9vvzMh');
    }
}