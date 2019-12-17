const Discord = require("discord.js");
const { filter, isEmpty, map, reduce } = require("lodash");
const captainSkills = require("../resources/captain-skills.json");
const builds = require("../resources/builds.json");
const { nations, skillMap, whitelist } = require("../resources/config.json");
const { getShipData } = require("../tools/wg-api");
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
    this.skills = this.buildSkillsList(build.skills) || [];
    this.upgrades = build.upgrades || [];
    this.captSkillsUrl = buildSkillsURL(build.skills) || "";
  }

  buildSkillsList(skillList) {
    try {
      var skills = skillList.map(skillCode => {
        if (Object.keys(skillMap).includes(skillCode)) {
          return new Skill(captainSkills[skillMap[skillCode]]);
        } else if (skillCode in whitelist) {
          return whitelist[skillCode];
        } else {
          console.error(skillList);
          throw `Unknown captain Skill code! Please bring this to the attention of <@${process.env.POWER_USER}> so that he fixes it!`;
        }
      });
    } catch (err) {
      console.error(err);
    }
    return skills;
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

function buildSkillsURL(skillList) {
  var skills = skillList.map(skillCode => {
    return skillMap[skillCode];
  });
  const URL = `https://worldofwarships.com/en/content/captains-skills/?skills=${skills}`;
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

async function buildCaptSkillsEmbed(shipName) {
  const shipAlias = searchAliases(builds, shipName);
  const shipData = await getShipData(shipAlias.ship_id);
  const shipEntry = shipAlias ? new Ship(shipData) : undefined;
  const shipBuild = shipAlias
    ? new Build({ ship: shipEntry, build: builds[shipAlias.ship_id] })
    : undefined;
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
  buildSkillsURL,
  urlMessage,
  Skill,
  Perks
};
