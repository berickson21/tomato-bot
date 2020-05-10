const { isEmpty, reduce } = require("lodash");
const { skillMap } = require("../resources/config.json");

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
    this.skills = build.skills;
    this.upgrades = build.upgrades;
    this.captSkillsUrl;
    this.note = build.note || "";
  }
  async buildLists(build) {
    var skills = build.skills.map(skillCode => {
      return skillMap[skillCode];
    });
    const URL = `https://worldofwarships.com/en/content/captains-skills/?skills=${skills}&ship=${this.ship.type}`;
    this.captSkillsUrl = !isEmpty(skills) ? `${URL}\n` : "";
  }
}

module.exports = {
  Skill,
  Upgrade,
  Ship,
  Perks,
  Build
};
