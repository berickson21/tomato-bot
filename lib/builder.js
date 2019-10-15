const Discord = require("discord.js");
const { filter, isEmpty, map, reduce } = require("lodash");
const { captainSkills } = require("../resources/captain-skills.json");
const encyclopedia = require("../resources/encyclopedia.json");
const {
  nations,
  ships,
  skillMap,
  whitelist
} = require("../resources/config.json");

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
    this.perkString = this.perks ? this.perks.join("\n") : "";
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
    this.skills = this.buildSkills(args.skills);
    this.captSkillsUrl = this.buildSkillsURL(args.skills);
  }

  buildSkills(skillList) {
    try {
      var skills = map(skillList, skillCode => {
        if (Object.keys(skillMap).includes(skillCode)) {
          return new Skill(captainSkills[skillMap[skillCode]]).name;
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

  buildSkillsURL(skillList) {
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
    const URL = `https://worldofwarships.com/en/content/captains-skills/?skills=${skills}&ship=${this.type.shipClass}`;
    if (!isEmpty(skills)) return `${URL}\n`;
  }
}

function buildSkillMessage(args) {
  args = args.map(arg => arg.toLowerCase());
  const nation = searchAliases(nations, args[0]) || "";
  if (nation) {
    const shipName = args.slice(1).join(" ");
    const embeds = map(nation[shipName], ship => {
      return buildEmbed(ship);
    });
    return embeds;
  } else {
    return [buildEmbed(args.join(" "))];
  }
}

function buildEmbed(ship) {
  const shipId = searchAliases(ships, ship).ship_id;
  const shipEntry = shipId
    ? new Ship(encyclopedia[shipId])
    : new Ship(encyclopedia["placeholder"]);
  const embed = new Discord.RichEmbed()
    .setTitle(`Captain skills for ${shipEntry.name}`)
    .setThumbnail(shipEntry.images["small"])
    .setDescription(shipEntry.skills)
    .setURL(shipEntry.captSkillsUrl);
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
  Skill,
  Perks
};
