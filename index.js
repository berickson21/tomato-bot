const {
    prepareResponse
} = require("./lib/responses");

// Load up the discord.js library
const Discord = require("discord.js");
const bot = new Discord.Client();

require('dotenv').config()
// Initialize Discord Bot
bot.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Tomato-bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels`);
    bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});
bot.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild (server).
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});
bot.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild (server).
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});
bot.on("message", async message => {
    // Ignore any message that does not start with the % prefix or sent by another bot
    if (message.content.charAt(0) !== process.env.PREFIX || message.author.bot) return;
    // Splits the message content into an array of words.
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    // Separates the command from the rest of the words
    const command = args.shift().toLowerCase();
    // Don't worry about it...
    const powerUser = message.author.id === process.env.POWER_USER ? true : false
    // Construct a response
    const response = prepareResponse(message, command, args, powerUser)
    // Send the response
    message.channel.send(response);
});

bot.login(process.env.BOT_TOKEN);