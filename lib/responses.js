const _ = require("lodash");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const { buildSkills } = require("./skills");
const builds = JSON.parse(
  readFileSync(resolve(__dirname, "../resources/builds.json"))
);

// const skillMap = JSON.parse(read("../resources/skill-map.json"));

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
  // console.log(args);
  switch (command) {
  case "build":
    return args.length > 1
      ? getNationalBuild(...args)
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

function getNationalBuild(nationCode, shipClass, ship = "") {
  const buildData = parseBuildArgs(
    nationCode.toLowerCase(),
    shipClass.toLowerCase(),
    ship.toLowerCase()
  );
  return `Build for ${buildData.name}:\n ${buildData.skills}`;
}
function parseBuildArgs(nationCode, shipClass, ship) {
  let nationBuilds = _.filter(builds, nation => {
    return nation["aliases"].includes(nationCode);
  });
  nationBuilds = nationBuilds.shift();
  // console.log(nationBuilds);
  const classBuilds = nationBuilds[shipClass];
  const build =
    classBuilds.length === 1
      ? classBuilds.shift()
      : _.filter(classBuilds, build => {
        return build.name.toLowerCase() === ship;
      }).shift();

  const skills = buildSkills(build.skills);

  // console.log(skills);
  return { name: build.name, skills };
}
function getSpecialBuild(name) {
  console.log(name);
  var build = "Soon\u2122";
  return build;
}
module.exports = {
  prepareResponse
};
