const jetpack = require("fs-jetpack");
// const builds = require("../resources/builds.json");
const config = require("../resources/config.json");
const { getUpdatedUpgrades, getUpdatedSkills } = require("./wg-api");

const { reduce } = require("lodash");
main();

async function main() {
  await updateUpgrades();
  await updateSkills();
  jetpack.write(`${jetpack.cwd()}/resources/config.json`, config);
}

async function updateUpgrades() {
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

async function updateSkills() {
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
