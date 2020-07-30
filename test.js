const path = require("path");

let messageCounts = require(path.resolve(__dirname, "./count.json"));

let totalShipRequests = sortObject(messageCounts.totalShipRequests);
let emptySkills = sortObject(messageCounts.emptySkills);
let emptyUpgrades = sortObject(messageCounts.emptyUpgrades);
let wrongName = sortObject(messageCounts.wrongName);

console.log(totalShipRequests);
console.log(emptySkills);
console.log(emptyUpgrades);
console.log(wrongName);
console.log("done");

function sortObject(object) {
  let sortable = [];
  for (var ship in object) {
    sortable.push([ship, object[ship]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  return sortable;
}
