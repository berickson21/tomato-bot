const { map, reduce } = require("lodash");
const { skillMap, whitelist } = require("../resources/config.json");
const { captainSkills } = require("../resources/captain-skills.json");

function Skill(args) {
  return {
    name: args.name,
    type_id: args.type_id,
    type_name: args.type_name,
    perks: Perks(args.perks),
    tier: args.tier,
    icon: args.icon
  };
}

function Perks(perkList) {
  const perks = reduce(
    perkList,
    (acc, perk) => {
      acc.push(perk.description);
      return acc;
    },
    []
  );
  return perks.join("\n");
}

function buildSkills(skillList) {
  var skills;
  try {
    skills = map(skillList, skillCode => {
      if (Object.keys(skillMap).includes(skillCode)) {
        return new Skill(captainSkills[skillMap[skillCode]]).name;
      } else if (skillCode in whitelist) {
        return whitelist[skillCode];
      } else {
        console.error(skillList);
        throw `Unknown skillCode! Please bring this to the attention of <@${process.env.POWER_USER}> so that he fixes it!`;
      }
    });
  } catch (err) {
    return err;
  }
  return skills.join(", ");
}
function buildSkillsURL(skillList) {
  var skills;
  try {
    skills = map(skillList, skillCode => {
      if (Object.keys(skillMap).includes(skillCode)) {
        return skillMap[skillCode];
      } else if (skillCode in whitelist) {
        return whitelist[skillCode];
      } else {
        throw `URL Problem! Please bring this to the attention of <@${process.env.POWER_USER}> so that he fixes it!`;
      }
    });
  } catch (err) {
    return err;
  }
  return skills;
}
module.exports = {
  buildSkills,
  buildSkillsURL,
  Skill,
  Perks
};
