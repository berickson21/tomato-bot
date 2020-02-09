const request = require("request-promise");

async function getAPIData(url) {
  const options = {
    url: url,
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  let response = await request(options, function(err, res, body) {
    return body;
  });
  response = JSON.parse(response);
  return response.status === "error" ? response.error.message : response.data;
}

async function getShipData(ship_id) {
  const url = `https://api.worldofwarships.com/wows/encyclopedia/ships/?application_id=e9581dae8d941b44bd5e7f0b06dc5146&fields=name%2Cship_id%2Cnation%2Ctier%2Cimages.small%2Cimages.medium%2Cimages.large%2Ctype&ship_id=${ship_id}`;
  const data = await getAPIData(url);
  return data[ship_id];
}

async function getSkillData(skill_id) {
  const url = `https://api.worldofwarships.com/wows/encyclopedia/crewskills/?application_id=e9581dae8d941b44bd5e7f0b06dc5146&skill_id=${skill_id}&fields=name%2C+type_id%2C+type_name%2C+perks%2C+tier%2C+icon`;
  const data = await getAPIData(url);
  return data[skill_id];
}

async function getUpgradeData(upgrade_id) {
  const url = `https://api.worldofwarships.com/wows/encyclopedia/consumables/?application_id=e9581dae8d941b44bd5e7f0b06dc5146&type=Modernization&consumable_id=${upgrade_id}`;
  const data = await getAPIData(url);
  return data[upgrade_id];
}

module.exports = { getShipData, getSkillData, getUpgradeData };
