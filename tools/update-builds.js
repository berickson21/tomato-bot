const jetpack = require("fs-jetpack");
const builds = require("../resources/builds.json");
const config = require("../resources/config.json");
const {
  getUpdatedUpgrades,
  getUpdatedSkills,
  getWGNationClassData
} = require("./wg-api");
const { getSheetEntry } = require("./sheets-api");
const { flatten, map, reduce } = require("lodash");
main();

async function main() {
  console.log("Updating the ship catalog");
  await updateShipCatalog().catch(err => {
    console.error(err);
  });
  console.log("Updating the Upgrades list...");
  await updateWGUpgrades().catch(err => {
    console.error(err);
  });
  console.log("Updating the Captain Skills list...");
  await updateWGSkills().catch(err => {
    console.error(err);
  });
  console.log("Pulling updated Captain Skill builds from Sheets...");
  await updateSheetSkills().catch(err => {
    console.error(err);
  });
  console.log("Pulling updated Upgrade builds from Sheets...");
  await updateSheetUpgrades().catch(err => {
    console.error(err);
  });
  jetpack.write(`${jetpack.cwd()}/resources/config.json`, config);
  jetpack.write(`${jetpack.cwd()}/resources/builds.json`, builds);
  
  console.log("done!");
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

async function updateShipCatalog() {
  const shipArray = [
    ...(await getShipsByNationType("AirCarrier")),
    ...(await getShipsByNationType("Battleship")),
    ...(await getShipsByNationType("Cruiser")),
    ...(await getShipsByNationType("Destroyer"))
  ];

  shipArray.forEach(ship => {
    builds[ship.name] = ship;
  });
  return shipArray;
}
async function getShipsByNationType(type) {
  console.log(`    ${type}s...`);
  const ships = Object.assign(
    {},
    flatten(
      await Promise.all(
        map(
          Object.keys(config.nations),
          async nation => await getWGNationClassData(nation, type)
        )
      )
    )
  );

  const a = reduce(
    ships,
    (result, ship) => {
      if (
        (ship.tier === 10 ||
          ship.is_premium === true ||
          ship.is_special === true) &&
        !ship.name.includes("[") &&
        !ship.name.includes("ARP") &&
        !ship.name.includes("Dragon") &&
        !ship.name.includes("Atago B") &&
        !ship.name.includes("Massachusetts B") &&
        !ship.name.includes("Scharnhorst B") &&
        !ship.name.includes("Alaska B") &&
        !ship.name.includes("Asashio B") &&
        !ship.name.includes("Sims B") &&
        !ship.name.includes("Graf Zeppelin B") &&
        !ship.name.includes("Tirpitz B") &&
        !ship.name.includes("STALINGRAD #2")
      ) {
        const buildsShip = builds[ship.name];
        result.push(
          buildsShip ? existingShipEntry(buildsShip, ship) : newShipEntry(ship)
        );
      }
      return result;
    },
    []
  );
  return a;

  function newShipEntry(ship) {
    return {
      name: ship.name,
      aliases: [ship.name.toLowerCase()],
      ship_id: ship.ship_id,
      type: ship.type,
      nation: ship.nation,
      tier: ship.tier,
      is_premium: ship.is_premium,
      is_special: ship.is_special,
      skills: ["Soon™"],
      upgrades: ["Soon™"],
      signals: ["Soon™"]
    };
  }

  function existingShipEntry(buildsShip, ship) {
    return {
      name: buildsShip.name || ship.name,
      aliases: buildsShip.aliases || [ship.name.toLowerCase()],
      ship_id: buildsShip.ship_id || ship.ship_id,
      type: buildsShip.type || ship.type,
      nation: buildsShip.nation || ship.nation,
      tier: buildsShip.tier || ship.tier,
      is_premium: buildsShip.is_premium || ship.is_premium,
      is_special: buildsShip.is_special || ship.is_special,
      skills: buildsShip.skills || ["Soon™"],
      upgrades: buildsShip.upgrades || ["Soon™"],
      signals: buildsShip.signals || ["Soon™"]
    };
  }
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
