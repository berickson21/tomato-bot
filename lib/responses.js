const jetpack = require("fs-jetpack");
const {
  buildSkillMessage,
  buildUpgradesMessage,
  buildFullMessage,
  buildHelpMessage,
  buildRequestCountMessage
} = require("./builder");
/**
 * Responds to a message
 *
 * @param {Client.Message} message The message received by the bot
 * @param {Map} userRoles The roles of the user on the server
 * @returns The bot's response
 */
async function prepareResponse(message, userRoles) {
  const { BOT_ID, command, args, powerUser } = parseArgs();

  if (
    message.content.charAt(0) !== process.env.PREFIX ||
    (message.author.bot && message.author.id != BOT_ID)
  )
    return;

  const isAdmin = userRoles.find(
    role => ["Founder", "Discord Admin", "Clan Admin", "Advisory Council"].includes(role.name)
  ) ? true : false;
  
  const isMentor = isAdmin | userRoles.find(
    role => role.name === "Mentor"
  ) ? true : false;

  // prettier-ignore
  switch (command) {
  case "skills":
    return await buildSkillMessage(args);
  case "upgrades":
    return await buildUpgradesMessage(args);
  case "signals":
    return ["Soon\u2122"];
  case "build":
    return buildFullMessage(args);
  case "invite":
    return [
      "Invite me here: https://discordapp.com/api/oauth2/authorize?client_id=627324156748365844&permissions=314432&scope=bot"
    ];
  case "help":
    return [buildHelpMessage()];
  case "soon":
    if (isAdmin) {
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
  case "messagecount":
    return isAdmin ? [JSON.parse(jetpack.read(`${jetpack.cwd()}/count.json`)).totalMessages] : undefined;

  case "requests":
    return isMentor ? [buildRequestCountMessage()] : undefined;

  default:
    return;
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
    if (command !== "say") {
      args = args.map(arg => arg.toLowerCase());
    }

    return { BOT_ID, command, args, powerUser };
  }
}

module.exports = {
  prepareResponse
};
