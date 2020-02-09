const {
  buildSkillMessage,
  buildUpgradesMessage,
  buildHelpMessage,
  urlMessage
} = require("./builder");
/**
 * Responds to a message
 *
 * @param {Client.Message} message The message received by the bot
 * @returns The bot's response
 */
async function prepareResponse(message) {
  const { BOT_ID, command, args, powerUser } = parseArgs();

  if (
    message.content.charAt(0) !== process.env.PREFIX ||
    (message.author.bot && message.author.id != BOT_ID)
  )
    return;
  // prettier-ignore
  switch (command) {
  case "skills": return await buildSkillMessage(args);
  case "link": return [await urlMessage(args)];
  case "modules": return await buildUpgradesMessage(args);
  case "signals": return ["Soon\u2122"];
  case "build": return ["Soon\u2122"];
  case "invite": return [
    "Invite me here: https://discordapp.com/api/oauth2/authorize?client_id=627324156748365844&permissions=314432&scope=bot"
  ];
  case "help": return [buildHelpMessage()];
  case "guilds": 
    if (powerUser) {
      return ["guilds"];
    }
    break;
  case "soon":
    if (powerUser) {
      // eslint-disable-next-line no-unused-vars
      message.delete().catch(O_o => {});
      return ["Soon\u2122"];
    }
    break;
  case "say":
    if (powerUser) {
      // eslint-disable-next-line no-unused-vars
      message.delete().catch(O_o => {});
      return [args.join(" ")];
    } else {
      return ["I don't wanna!"];
    }
  default:
    return ["Unknown command."];
  }

  function parseArgs() {
    const BOT_ID =
      process.argv[2] === "debug" ? process.env.DEBUG_ID : process.env.BOT_ID;
    // Don't worry about it...
    const powerUser =
      message.author.id == process.env.POWER_USER ? true : false;
    // Ignore any message that does not start with the % prefix or sent by another bot
    // Splits the message content into an array of words.
    var args = message.content
      .slice(process.env.PREFIX.length)
      .trim()
      .split(/ +/g);
    // Separates the command from the rest of the words
    const command = args.shift().toLowerCase();
    args = args.map(arg => arg.toLowerCase());

    return { BOT_ID, command, args, powerUser };
  }
}

module.exports = {
  prepareResponse
};
