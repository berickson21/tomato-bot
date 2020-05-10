const { Ship, Build } = require("./classes");

const Discord = require("discord.js");
const { filter, map } = require("lodash");
const builds = require("../resources/builds.json");
const { nations } = require("../resources/config.json");
const { getWGShipData } = require("../tools/wg-api");

async function buildSkillMessage(args) {
  const nation = searchAliases(nations, args[0]);
  if (nation) {
    const shipName = args.slice(1).join(" ");
    const embeds = nation[shipName].map(ship => {
      return buildCaptSkillsEmbed(ship);
    });
    return await Promise.all(embeds);
  } else {
    return [await buildCaptSkillsEmbed(args.join(" "))];
  }
}

async function buildUpgradesMessage(args) {
  const nation = searchAliases(nations, args[0]);
  if (nation) {
    const shipName = args.slice(1).join(" ");
    const embeds = nation[shipName].map(ship => {
      return buildUpgradesEmbed(ship);
    });
    return await Promise.all(embeds);
  } else {
    return [await buildUpgradesEmbed(args.join(" "))];
  }
}

async function buildFullMessage(args) {
  const nation = searchAliases(nations, args[0]);
  if (nation) {
    const shipName = args.slice(1).join(" ");
    const embeds = nation[shipName].map(ship => {
      return buildFullEmbed(ship);
    });
    return await Promise.all(embeds);
  } else {
    return [await buildFullEmbed(args.join(" "))];
  }
}

async function buildCaptSkillsEmbed(shipName) {
  const { shipBuild, shipEntry } = await getShipData(shipName).catch(err => {
    console.error(err);
    return undefined;
  });
  const skillString = shipBuild.skills.join("\n") || "";
  if (skillString) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Captain skills for ${shipEntry.name}`)
      .setDescription(skillString)
      .setThumbnail(shipEntry.images["small"])
      // .addField("Captain Skills", skillString)
      .setURL(shipBuild.captSkillsUrl);
    if (shipBuild.note) {
      embed.setFooter(shipBuild.note);
    }
    return embed;
  } else {
    return undefined;
  }
}

async function buildUpgradesEmbed(shipName) {
  const { shipBuild, shipEntry } = await getShipData(shipName).catch(err => {
    console.error(err);
    return undefined;
  });
  const upgradeString = shipBuild.upgrades.join("\n") || "";
  if (upgradeString) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Upgrades for ${shipEntry.name}`)
      .setDescription(upgradeString)
      .setThumbnail(shipEntry.images["small"]);
    // .addField("Captain Skills", skillString)
    // .setURL(shipBuild.captSkillsUrl);
    if (shipBuild.note) {
      embed.setFooter(shipBuild.note);
    }
    return embed;
  } else {
    return undefined;
  }
}

async function buildFullEmbed(shipName) {
  const { shipBuild, shipEntry } = await getShipData(shipName).catch(err => {
    console.error(err);
    return undefined;
  });
  const skillString = shipBuild.skills.join("\n") || "";
  const upgradeString = shipBuild.upgrades.join("\n");

  if (skillString) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Ship build for ${shipEntry.name}`)
      .setThumbnail(shipEntry.images["small"])
      .addFields(
        { name: "Captain Skills", value: skillString },
        { name: "Upgrades", value: upgradeString }
      )
      .setURL(shipBuild.captSkillsUrl);
    if (shipBuild.note) {
      embed.setFooter(shipBuild.note);
    }
    return embed;
  } else {
    return undefined;
  }
}

async function getShipData(shipName) {
  const shipAlias = searchAliases(builds, shipName);
  if (shipAlias === "") {
    throw "Unable to find ship!";
  }
  const shipData = await getWGShipData(shipAlias.ship_id);
  const shipEntry = shipAlias ? new Ship(shipData) : undefined;
  const shipBuild = shipAlias
    ? new Build({ ship: shipEntry, build: builds[shipAlias.name] })
    : undefined;
  await shipBuild.buildLists(builds[shipAlias.name]);
  return { shipBuild, shipEntry };
}

function searchAliases(collection, alias) {
  try {
    let result = filter(collection, entry => {
      return entry["aliases"].includes(alias);
    });
    return result[0] || "";
  } catch (err) {
    return undefined;
  }
}

function buildHelpMessage() {
  const commands = {
    skills: {
      name: "skills",
      description:
        "Get the recommended captain skills for a ship or ship line.",
      usage: "%skills Montana or %skills usn BB"
    },
    upgrades: {
      name: "upgrades",
      description: "Get the recommended ship modules for a ship or ship line",
      usage: "%modules Montana or %modules usn BB"
    },
    // link: {
    //   name: "link",
    //   description: "Build a link for a custom captain build.",
    //   usage: "%link pt em si ce ar fp bos"
    // },
    invite: {
      name: "invite",
      description: "Get a link to invite Tomato-bot to your server!",
      usage: "%invite"
    }
  };
  const commandString = map(commands, command => {
    return `${command.name}:\n${command.description}\nExample: ${command.usage}`;
  }).join("\n\n");
  const response = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Available commands:")
    .setDescription(commandString);
  return response;
}

module.exports = {
  buildHelpMessage,
  buildSkillMessage,
  buildUpgradesMessage,
  buildFullMessage
};
