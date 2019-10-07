const _ = require("lodash");
const { resolve } = require("path");
const { readFileSync } = require("fs");
const sampleSkills = JSON.parse(
  readFileSync(resolve(__dirname, "../resources/sampleSkills.json"))
);
const skillsMap = JSON.parse(
  readFileSync(resolve(__dirname, "../resources/skill-map.json"))
);

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
  const perks = _.reduce(
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
  const skills = _.map(skillList, skillCode => {
    return new Skill(sampleSkills[skillsMap[skillCode]]).name;
  });
  return skills.join(", ");
}
module.exports = {
  buildSkills,
  Skill,
  Perks
};
