const { prepareResponse } = require("./lib/responses");

// Load up the discord.js library
const Discord = require("discord.js");
const bot = new Discord.Client();

require("dotenv").config();
// Initialize Discord Bot
bot.on("ready", () => {
  // This event will run if the bot starts and logs in successfully.
  console.log(
    `Tomato-bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels`
  );
  bot.user.setActivity("the long game");
});
bot.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild (server).
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
  );
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});
bot.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild (server).
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});
bot.on("message", async message => {
  // Construct a response
  const response = await prepareResponse(message);
  // Send the response
  if (response) {
    try {
      await message.channel.send(response);
    } catch (err) {
      console.error(err);
    }
  }
});

bot.login(process.env.BOT_TOKEN);
