const Discord = require("discord.js");
const { filter, isEmpty, map, reduce, startCase } = require("lodash");
const captainSkills = require("../resources/captain-skills.json");
const builds = require("../resources/builds.json");
const {
  nations,
  ships,
  skillMap,
  whitelist
} = require("../resources/config.json");
const { getShipData } = require("./wg-api");
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
    this.captSkillsUrl = buildSkillsURL(this.ship, build.skills) || "";
  }

  buildSkillsList(skillList) {
    try {
      var skills = map(skillList, skillCode => {
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
  const ship = await getShipData(searchAliases(ships, args.shift()).ship_id);
  const url = buildSkillsURL(ship, args);
  const embed = new Discord.RichEmbed()
    .setTitle(`Here's your link for ${ship.name} skills!`)
    .setThumbnail(ship.images["small"])
    .setURL(url);
  return embed;
}
function buildSkillsURL(ship, skillList) {
  var skills;
  try {
    skills = map(skillList, skillCode => {
      if (Object.keys(skillMap).includes(skillCode)) {
        return skillMap[skillCode];
      } else {
        throw `Captain Skill URL Problem! Please bring this to the attention of <@${process.env.POWER_USER}> so that he fixes it!`;
      }
    });
  } catch (err) {
    return err;
  }
  const URL = `https://worldofwarships.com/en/content/captains-skills/?skills=${skills}&ship=${startCase(
    ship.type
  )}`;
  if (!isEmpty(skills)) return `${URL}\n`;
}
async function buildSkillMessage(args) {
  const nation = searchAliases(nations, args[0]) || "";
  if (nation) {
    const shipName = args.slice(1).join(" ");
    const embeds = map(nation[shipName], ship => {
      return buildCaptSkillsEmbed(ship);
    });
    return await Promise.all(embeds);
  } else {
    return [await buildCaptSkillsEmbed(args.join(" "))];
  }
}

async function buildCaptSkillsEmbed(ship) {
  const shipAlias = searchAliases(ships, ship);
  const shipData = await getShipData(shipAlias.ship_id);
  const shipEntry = shipAlias ? new Ship(shipData) : undefined;

  const shipBuild = shipAlias
    ? new Build({ ship: shipEntry, build: builds[shipAlias.ship_id] })
    : undefined;
  const skillString = map(shipBuild.skills, skill => skill.name).join("\n");
  const embed = new Discord.RichEmbed()
    .setColor("#0099ff")
    .setTitle(`${shipEntry.name}`)
    .setDescription(skillString)
    .setThumbnail(shipEntry.images["small"])
    // .addField("Captain Skills", skillString)
    .setURL(shipBuild.captSkillsUrl);
  return embed;
}

function searchAliases(collection, alias) {
  let nation = filter(collection, entry => {
    return entry["aliases"].includes(alias);
  }).shift();
  return nation;
}

module.exports = {
  buildSkillMessage,
  buildSkillsURL,
  urlMessage,
  Skill,
  Perks
};
