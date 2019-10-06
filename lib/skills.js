const { reduce } = require("lodash");
function skill(args) {
  return {
    name: args.name,
    type_id: args.type_id,
    type_name: args.type_name,
    perks: perks(args.perks),
    tier: args.tier,
    icon: args.icon
  };
}

function perks(perkList) {
  return reduce(
    perkList,
    (acc, perk) => {
      acc.push(perk.description);
      return acc;
    },
    []
  );
}

module.exports(skill, perks);
