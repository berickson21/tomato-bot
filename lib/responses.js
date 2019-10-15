const { buildSkillMessage } = require("./builder");

/**
 * Responds to a message
 *
 * @param {Client.Message} message The message received by the bot
 * @returns The bot's response
 */
function prepareResponse(message) {
  // Don't worry about it...
  const powerUser = message.author.id === process.env.POWER_USER ? true : false;

  // Ignore any message that does not start with the % prefix or sent by another bot
  if (
    message.content.charAt(0) !== process.env.PREFIX ||
    (message.author.bot && message.author.id != 249609541954568195)
  )
    return;

  // Splits the message content into an array of words.
  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g);

  // Separates the command from the rest of the words
  const command = args.shift().toLowerCase();

  switch (command) {
  case "skills":
    return buildSkillMessage(args);
  case "soon":
    if (powerUser) {
      // eslint-disable-next-line no-unused-vars
      message.delete().catch(O_o => {});
      return ["Soon\u2122"];
    }
    break;
  default:
    return ["Unknown command."];
  }
}

module.exports = {
  prepareResponse
};
