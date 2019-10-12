const { isEmpty, startCase, filter, map } = require("lodash");
const { buildSkills } = require("./skills");
const { nations, builds } = require("../resources/config.json");

// const skillMap = JSON.parse(read("../resources/skill-map.json"));

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
    return getNation(args[0])
      ? getNationalBuild(args[0], args.slice(1).join(" "))
      : getCaptainSkills(startCase(args.join(" ")));
  case "soon":
    if (powerUser) {
      // eslint-disable-next-line no-unused-vars
      message.delete().catch(O_o => {});
      return "Soon\u2122";
    }
    break;
  default:
    return "Unknown command.";
  }
}
function getNation(nationCode) {
  let nation = filter(nations, nation => {
    return nation["aliases"].includes(nationCode);
  }).shift();
  return nation;
}
/**
 * Gets the build for a given nation and ship class
 *
 * @param {string} nationCode Which nation to look under
 * @param {string} shipClass Which ship class to get a build for
 * @returns Builds for each line of the given nation and class
 */
function getNationalBuild(nationCode, shipClass) {
  // Get the lines of silver ships for a given nation
  let nationLines = filter(nations, nation => {
    return nation["aliases"].includes(nationCode);
  }).shift();

  const build = map(nationLines[shipClass], ship => {
    return getCaptainSkills(startCase(ship));
  });
  return build.join("\n");
}

/**
 * Searches for a ship build that matches the ship name given
 *
 * @param {string} ship The name of the ship to search for
 * @returns An Array of skills for the ship
 */
function getCaptainSkills(ship) {
  const skills = buildSkills(builds[ship]);
  return !isEmpty(skills)
    ? `Captain skills for ${ship}:\n${skills}\n`
    : `Sorry, I can't find a captain build for ${ship}`;
}
module.exports = {
  prepareResponse
};
