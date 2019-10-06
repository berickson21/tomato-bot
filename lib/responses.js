const _ = require("lodash");
const { read } = require("fs-jetpack");
const builds = JSON.parse(read("../resources/builds.json"));
// const skillMap = JSON.parse(read("../resources/skill-map.json"));

function CaptainBuild(args) {
  return {
    name: args.name,
    skills: args.skills
  };
}

function prepareResponse(message) {
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
  // Don't worry about it...
  // const powerUser = message.author.id === process.env.POWER_USER ? true : false;

  switch (command) {
  case "build":
    return args.length > 1
      ? getNationalBuild(args[0].toLowerCase(), args[1].toLowerCase())
      : getSpecialBuild(args[0].toLowerCase());
  }
  // case "say":
  //     if (powerUser) {
  //         // eslint-disable-next-line no-unused-vars
  //         message.delete().catch(O_o => {});
  //         return args.join(" ");
  //     } else {
  //         return "I don't wanna!";
  //     }
  // %hesright
  // case "hesright":
  //     response = powerUser ? "<:hesright:473885793341931531>" : "Viykin's right.";
  //     break;
  // %ship
  return "Unknown command.";
}

function getNationalBuild(nationCode, shipClass, ship = null) {
  const buildData = new CaptainBuild(parseBuildArgs());
  return `Build for ${buildData.name}: ${buildData.skills}`;

  function parseBuildArgs() {
    const nationBuilds = _.pickBy(builds.nations, nation => {
      return nation["aliases"].includes(nationCode);
    });
    const classBuilds = nationBuilds[shipClass];
    return classBuilds.length === 1
      ? classBuilds[0]
      : getShipBuild(ship, classBuilds);
  }
}
function getShipBuild(ship, classBuilds = null) {
  return _.pickBy(classBuilds, shipName => shipName === ship) || null;
}

function getSpecialBuild(name) {
  console.log(name);
  var build = "Soon\u2122";
  return build;
}
module.exports = {
  prepareResponse
};
