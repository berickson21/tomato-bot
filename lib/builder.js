const Discord = require("discord.js");
const { filter, isEmpty, map, reduce } = require("lodash");
const builds = require("../resources/builds.json");
const {
  nations,
  skillMap,
  upgradeMap,
  whitelist
} = require("../resources/config.json");
const {
  getShipData,
  getSkillData,
  getUpgradeData
} = require("../tools/wg-api");
class Skill {
  constructor(args) {
    this.name = args.name;
    this.type_id = args.type_id;
    this.type_name = args.type_name;
    this.perks = new Perks(args.perks);
    this.tier = args.tier;
    this.icon = args.icon;
  }
}

class Upgrade {
  constructor(args) {
    this.name = args.name;
    this.consumable_id = args.consumable_id;
    this.price_credit = args.price_credit;
    this.type = args.type;
    this.description = args.description;
  }
}

class Perks {
  constructor(args) {
    this.perkList = reduce(
      args,
      (acc, perk) => {
        acc.push(perk.description);
        return acc;
      },
      []
    );
    this.perkString = this.perkList.length ? this.perkList.join("\n") : "";
  }
}
class Ship {
  constructor(args) {
    this.tier = args.tier;
    this.name = args.name;
    this.nation = args.nation;
    this.ship_id = args.ship_id;
    this.images = args.images;
    this.type = args.type;
  }
}

class Build {
  constructor({ ship, build }) {
    this.ship = ship;
    this.name = build.name;
    this.ship_id = build.ship_id;
    this.signals = build.signals || [];
    this.skills;
    this.upgrades;
    this.captSkillsUrl;
  }

  async buildLists(build) {
    this.skills = (await this.buildSkillsList(build.skills)) || [];
    this.upgrades = (await this.buildUpgradesList(build.upgrades)) || [];
    this.captSkillsUrl = buildSkillsURL(build.skills, this.ship.type) || "";
  }

  async buildSkillsList(skillList) {
    try {
      var skills = await Promise.all(
        skillList.map(async skillCode => {
          if (Object.keys(skillMap).includes(skillCode)) {
            return new Skill(await getSkillData(skillMap[skillCode]));
          } else if (skillCode in whitelist) {
            return whitelist[skillCode];
          } else {
            console.error(skillList);
            throw `Unknown captain Skill code! Please bring this to the attention of <@${process.env.POWER_USER}> so that he fixes it!`;
          }
        })
      );
    } catch (err) {
      console.error(err);
    }
    return skills;
  }
  async buildUpgradesList(upgradesList) {
    try {
      var upgrades = await Promise.all(
        upgradesList.map(async upgradeCode => {
          if (Object.keys(upgradeMap).includes(upgradeCode)) {
            return new Upgrade(await getUpgradeData(upgradeMap[upgradeCode]));
          } else if (Object.values(whitelist).includes(upgradeCode)) {
            return whitelist[upgradeCode];
          } else {
            console.error(upgradesList);
            throw `Unknown upgrade code! Please bring this to the attention of <@${process.env.POWER_USER}> so that he fixes it!`;
          }
        })
      );
    } catch (err) {
      console.error(err);
    }
    return upgrades;
  }
}

async function urlMessage(args) {
  const url = buildSkillsURL(args);
  const embed = new Discord.RichEmbed()
    .setTitle("Here's your link!")
    .setThumbnail(
      "https://worldofwarships.com/static/511090af0a1/assetsV2/ad99c390512d48005f1ead2481b5c132.gif"
    )
    .setURL(url);
  return embed;
}

function buildSkillsURL(skillList, type = "Battleship") {
  var skills = skillList.map(skillCode => {
    return skillMap[skillCode];
  });
  const URL = `https://worldofwarships.com/en/content/captains-skills/?skills=${skills}&ship=${type}`;
  if (!isEmpty(skills)) return `${URL}\n`;
}

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

async function buildCaptSkillsEmbed(shipName) {
  const shipAlias = searchAliases(builds, shipName);
  const shipData = await getShipData(shipAlias.ship_id);
  const shipEntry = shipAlias ? new Ship(shipData) : undefined;
  const shipBuild = shipAlias
    ? new Build({ ship: shipEntry, build: builds[shipAlias.ship_id] })
    : undefined;
  await shipBuild.buildLists(builds[shipAlias.ship_id]);
  const skillString = shipBuild.skills.map(skill => skill.name).join("\n");
  const embed = new Discord.RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Captain skills for ${shipEntry.name}`)
    .setDescription(skillString)
    .setThumbnail(shipEntry.images["small"])
    // .addField("Captain Skills", skillString)
    .setURL(shipBuild.captSkillsUrl);
  return embed;
}

async function buildUpgradesEmbed(shipName) {
  const shipAlias = searchAliases(builds, shipName);
  const shipData = await getShipData(shipAlias.ship_id);
  const shipEntry = shipAlias ? new Ship(shipData) : undefined;
  const shipBuild = shipAlias
    ? new Build({ ship: shipEntry, build: builds[shipAlias.ship_id] })
    : undefined;
  await shipBuild.buildLists(builds[shipAlias.ship_id]);
  const upgradeString = shipBuild.upgrades
    .map(upgrade => upgrade.name)
    .join("\n");
  const embed = new Discord.RichEmbed()
    .setColor("#0099ff")
    .setTitle(`Upgrade Modules for ${shipEntry.name}`)
    .setDescription(upgradeString)
    .setThumbnail(shipEntry.images["small"]);
  // .addField("Captain Skills", skillString)
  // .setURL(shipBuild.captSkillsUrl);
  return embed;
}

function searchAliases(collection, alias) {
  let result = filter(collection, entry => {
    return entry["aliases"].includes(alias);
  });
  return result[0] || "";
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
      name: "modules",
      description: "Get the recommended ship modules for a ship or ship line",
      usage: "%modules Montana or %modules usn BB"
    },
    link: {
      name: "link",
      description: "Build a link for a custom captain build.",
      usage: "%link pt em si ce ar fp bos"
    },
    invite: {
      name: "invite",
      description: "Get a link to invite Tomato-bot to your server!",
      usage: "%invite"
    }
  };
  const commandString = map(commands, command => {
    return `${command.name}:\n${command.description}\nExample: ${command.usage}`;
  }).join("\n\n");
  const response = new Discord.RichEmbed()
    .setColor("#0099ff")
    .setTitle("Available commands:")
    .setDescription(commandString);
  return response;
}

module.exports = {
  buildHelpMessage,
  buildSkillMessage,
  buildUpgradesMessage,
  buildSkillsURL,
  urlMessage,
  Skill,
  Perks
};
