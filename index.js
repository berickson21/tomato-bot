const { prepareResponse } = require("./lib/responses");
const jetpack = require("fs-jetpack");
// Load up the discord.js library
const Discord = require("discord.js");
const bot = new Discord.Client();

// Initialize Discord Bot
require("dotenv").config();

let messageCount = 0;

const TOKEN =
  process.argv[2] === "debug" ? process.env.DEBUG_TOKEN : process.env.BOT_TOKEN;
// This event will run if the bot starts and logs in successfully.
bot.on("ready", () => {
  console.log(
    `Tomato-bot has started, with ${bot.users.cache.size} users, in ${bot.channels.cache.size} channels`
  );
  bot.user.setActivity("%help for commands");
});

// This event triggers when the bot joins a guild (server).
bot.on("guildCreate", guild => {
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
  );
  // bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

// This event triggers when the bot is removed from a guild (server).
bot.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  // bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

// This event triggers when a message is sent in a guild (server) the bot belongs to.
bot.on("message", async message => {
  const checkAdmin = message.member.roles.cache.find(
    role =>
      role.name === "Discord Admin" ||
      role.name === "Clan Admin" ||
      role.name === "AdvisoryCouncil"
  );
  // Construct a response
  let response = await prepareResponse(message).catch(err => {
    console.error(err);
  });

  if (!response && checkAdmin) {
    if (message.content === "%guilds") {
      response = [
        [...bot.guilds.cache.values()].map(guild => guild.name).join("\n")
      ];
    } else if (message.content === "%guildCount") {
      response = [bot.guilds.cache.size.toString()];
    } else if (message.content === "%userCount") {
      response = [(bot.users.cache.size - 1).toString()];
    } else if (message.content === "%messageCount") {
      response = [jetpack.read(`${jetpack.cwd()}/count.txt`)];
    }
    // else if (message.content === "%users") {
    //   let users = [...bot.users.cache.filter(user => user.bot === false)].map(
    //     user => user[1].username
    //   );
    //   message.channel.send(users.join("\n"));
    // }
  }

  // Send the response
  if (response) {
    try {
      response.forEach(msg => message.channel.send(msg));
      messageCount++;
      jetpack.write(`${jetpack.cwd()}/count.txt`, messageCount.toString());
    } catch (err) {
      console.error(err);
    }
  }
});
bot.login(TOKEN);
