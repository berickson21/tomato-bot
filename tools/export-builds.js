const jetpack = require("fs-jetpack");
// const builds = require("../resources/builds.json");
const config = require("../resources/config.json");
const { getUpdatedUpgrades, getUpdatedSkills } = require("./wg-api");
const { getSheetEntry } = require("./sheets-api");
const { reduce } = require("lodash");
main();

async function main() {
  await updateWGUpgrades();
  await updateWGSkills();
  config.sheetSkills = await getSheetEntry("skills");
  config.sheetUpgrades = await getSheetEntry("upgrades");
  jetpack.write(`${jetpack.cwd()}/resources/config.json`, config);
}

async function updateWGUpgrades() {
  let newUpgrades = reduce(
    await getUpdatedUpgrades(),
    (result, value, id) => {
      result[value.name] = parseInt(id);
      return result;
    },
    {}
  );
  config.upgradeMap = newUpgrades;
}

async function updateWGSkills() {
  let newSkills = reduce(
    await getUpdatedSkills(),
    (result, value, id) => {
      result[value.name] = parseInt(id);
      return result;
    },
    {}
  );
  config.skillMap = newSkills;
}
