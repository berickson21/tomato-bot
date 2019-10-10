const { map, reduce } = require("lodash");
const { skillMap } = require("../resources/config.json");
const { resolve } = require("path");
const { readFileSync } = require("fs");
const sampleSkills = JSON.parse(
  readFileSync(resolve(__dirname, "../resources/sampleSkills.json"))
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
  const skills = map(skillList, skillCode => {
    console.log(skillCode);
    return skillCode !== "Soon\u2122"
      ? new Skill(sampleSkills[skillMap[skillCode]]).name
      : "Soon\u2122";
  });
  return skills.join(", ");
}
module.exports = {
  buildSkills,
  Skill,
  Perks
};
