const jetpack = require("fs-jetpack");
const builds = require("../resources/builds.json");
const config = require("../resources/config.json");
const { getUpdatedUpgrades, getUpdatedSkills } = require("./wg-api");
const { getSheetEntry } = require("./sheets-api");
const { map, reduce } = require("lodash");
main();

async function main() {
  await updateWGUpgrades().catch(err => {
    console.error(err);
  });
  await updateWGSkills().catch(err => {
    console.error(err);
  });
  await updateSheetSkills().catch(err => {
    console.error(err);
  });
  await updateSheetUpgrades().catch(err => {
    console.error(err);
  });
  jetpack.write(`${jetpack.cwd()}/resources/config.json`, config);
  jetpack.write(`${jetpack.cwd()}/resources/builds.json`, builds);
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

async function updateSheetSkills() {
  const newSkills = await getSheetEntry("skills");
  return map(newSkills, skills => {
    const shipName = skills[0];

    if (builds[shipName]) {
      builds[shipName]["skills"] = skills.slice(1);
    } else {
      console.log(shipName);
    }
  });
}

async function updateSheetUpgrades() {
  const newUpgrades = await getSheetEntry("upgrades");
  return map(newUpgrades, upgrades => {
    const shipName = upgrades[0];

    if (builds[shipName]) {
      builds[shipName]["upgrades"] = upgrades.slice(1);
    } else {
      console.log(shipName);
    }
  });
}
