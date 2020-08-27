const { Ship, Build } = require("./classes");

const Discord = require("discord.js");
const { filter } = require("lodash");
const builds = require("../resources/builds.json");
const { nations } = require("../resources/config.json");
const { getWGShipData } = require("../tools/wg-api");
const jetpack = require("fs-jetpack");
const path = require("path");

let messageCounts = require(path.resolve(__dirname, "../count.json"));

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
  const shipAlias = searchAliases(builds, shipName);
  if (shipAlias === "") {
    messageCounts.wrongName[shipName] =
      (messageCounts.wrongName[shipName] || 0) + 1;
    jetpack.write(path.resolve(__dirname, "../count.json"), messageCounts);
    return;
  }

  const shipData = await getWGShipData(shipAlias.ship_id);
  const shipEntry = shipAlias ? new Ship(shipData) : undefined;
  const shipBuild = shipAlias
    ? new Build({ ship: shipEntry, build: builds[shipAlias.name] })
    : undefined;
  await shipBuild.buildLists(builds[shipAlias.name]);

  const skillString = shipBuild.skills.join("\n") || "";

  messageCounts.totalShipRequests[shipBuild.name] =
    (messageCounts.totalShipRequests[shipBuild.name] || 0) + 1;

  if (skillString) {
    if (skillString === "Soon™") {
      messageCounts.emptySkills[shipBuild.name] =
        (messageCounts.emptySkills[shipBuild.name] || 0) + 1;
    }
    else if (messageCounts.emptySkills[shipBuild.name]) {
      delete messageCounts.emptySkills[shipBuild.name];
    }
    
    jetpack.write(path.resolve(__dirname, "../count.json"), messageCounts);

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
  const shipAlias = searchAliases(builds, shipName);
  if (shipAlias === "") {
    messageCounts.wrongName[shipName] =
      (messageCounts.wrongName[shipName] || 0) + 1;
    jetpack.write(path.resolve(__dirname, "../count.json"), messageCounts);
    return;
  }

  const shipData = await getWGShipData(shipAlias.ship_id);
  const shipEntry = shipAlias ? new Ship(shipData) : undefined;
  const shipBuild = shipAlias
    ? new Build({ ship: shipEntry, build: builds[shipAlias.name] })
    : undefined;
  await shipBuild.buildLists(builds[shipAlias.name]);

  const upgradeString = shipBuild.upgrades.join("\n") || "";

  messageCounts.totalShipRequests[shipBuild.name] =
    (messageCounts.totalShipRequests[shipBuild.name] || 0) + 1;

  if (upgradeString) {
    if (upgradeString === "Soon™") {
      messageCounts.emptyUpgrades[shipBuild.name] =
        (messageCounts.emptyUpgrades[shipBuild.name] || 0) + 1;
    }
    else if (messageCounts.emptyUpgrades[shipBuild.name]) {
      delete messageCounts.emptyUpgrades[shipBuild.name];
    }

    jetpack.write(path.resolve(__dirname, "../count.json"), messageCounts);

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
  const shipAlias = searchAliases(builds, shipName);
  if (shipAlias === "") {
    messageCounts.wrongName[shipName] =
      (messageCounts.wrongName[shipName] || 0) + 1;
    jetpack.write(path.resolve(__dirname, "../count.json"), messageCounts);
    return;
  }

  const shipData = await getWGShipData(shipAlias.ship_id);
  const shipEntry = shipAlias ? new Ship(shipData) : undefined;
  const shipBuild = shipAlias
    ? new Build({ ship: shipEntry, build: builds[shipAlias.name] })
    : undefined;
  await shipBuild.buildLists(builds[shipAlias.name]);

  const skillString = shipBuild.skills.join("\n") || "";
  const upgradeString = shipBuild.upgrades.join("\n");

  messageCounts.totalShipRequests[shipBuild.name] =
    (messageCounts.totalShipRequests[shipBuild.name] || 0) + 1;

  if (skillString || upgradeString) {
    if (skillString === "Soon™") {
      messageCounts.emptySkills[shipBuild.name] =
        (messageCounts.emptySkills[shipBuild.name] || 0) + 1;
    }
    else if (messageCounts.emptySkills[shipBuild.name]) {
      delete messageCounts.emptySkills[shipBuild.name];
    }
    if (upgradeString === "Soon™") {
      messageCounts.emptyUpgrades[shipBuild.name] =
        (messageCounts.emptyUpgrades[shipBuild.name] || 0) + 1;
    }
    else if (messageCounts.emptyUpgrades[shipBuild.name]) {
      delete messageCounts.emptyUpgrades[shipBuild.name];
    }

    jetpack.write(path.resolve(__dirname, "../count.json"), messageCounts);

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
  const commands = [
    {
      name: "skills",
      value:
        "Get the recommended captain skills for a ship or ship line.\nExample: %skills Montana or %skills usn BB"
    },
    {
      name: "upgrades",
      value:
        "Get the recommended ship modules for a ship or ship line.\nExample: %upgrades Montana or %upgrades usn BB"
    },
    {
      name: "build",
      value:
        "recommended captain skills and upgrades for a ship.\nExample: %build Montana or %build usn BB"
    },
    {
      name: "invite",
      value: "Get a link to invite Tomato-bot to your server!\nExample: %invite"
    }
  ];
  const response = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Available commands:")
    .addFields(...commands);
  return response;
}

function buildRequestCountMessage() {

  let messageCounts = require(path.resolve(__dirname, "../count.json"));

  // let totalShipRequests = sortObject(messageCounts.totalShipRequests);
  let emptySkills = sortObject(messageCounts.emptySkills);
  let emptyUpgrades = sortObject(messageCounts.emptyUpgrades);
  // let wrongName = sortObject(messageCounts.wrongName);

  let topEmptySkills = emptySkills
    .map(ship => {
      return {
        rank: emptySkills.indexOf(ship) + 1, 
        name: ship[0],
        requests: ship[1]
      };
    })
    .slice(0, 9)
    .reduce(formatTopEmptyBuilds, []);

  let topEmptyUpgrades = emptyUpgrades
    .map(ship => {
      return {
        rank: emptyUpgrades.indexOf(ship) + 1, 
        name: ship[0],
        requests: ship[1]
      };
    })
    .slice(0, 9)
    .reduce(formatTopEmptyBuilds, []);

  const embed = new Discord.MessageEmbed()
    .setTitle("Top requested ship builds")
    .setColor("#0099ff")
  // .setThumbnail(shipEntry.images["small"])
    .addFields(
      { name: "Ships without captain skills", value: topEmptySkills.join("\n") },
      { name: "Ships without upgrades", value: topEmptyUpgrades.join("\n") }
    )
    .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  return embed;
}

function sortObject(object) {
  let sortable = [];
  for (var ship in object) {
    sortable.push([ship, object[ship]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  return sortable;
}

function formatTopEmptyBuilds(output, ship) {
  output.push(`${ship.rank}: ${ship.name}`);
  return output;
}




module.exports = {
  buildHelpMessage,
  buildSkillMessage,
  buildUpgradesMessage,
  buildFullMessage,
  buildRequestCountMessage
};
