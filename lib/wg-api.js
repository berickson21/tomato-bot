const request = require("request-promise");

async function getShipData(ship_id) {
  const options = {
    url: `https://api.worldofwarships.com/wows/encyclopedia/ships/?application_id=e9581dae8d941b44bd5e7f0b06dc5146&fields=name%2Cship_id%2Cnation%2Ctier%2Cimages.small%2Cimages.medium%2Cimages.large%2Ctype&ship_id=${ship_id}`,
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  let response = await request(options, function(err, res, body) {
    return body;
  });
  return JSON.parse(response).data[ship_id];
}
module.exports = { getShipData };
