// This file is just used to test random things and is not part of the bot.
const path = require("path");

let messageCounts = require(path.resolve(__dirname, "./count.json"));

// let totalShipRequests = sortObject(messageCounts.totalShipRequests);
let emptySkills = sortObject(messageCounts.emptySkills);
let emptyUpgrades = sortObject(messageCounts.emptyUpgrades);
let wrongName = sortObject(messageCounts.wrongName);

let topEmptySkills = emptySkills
  .map(ship => {
    return {
      rank: emptySkills.indexOf(ship) + 1, 
      name: ship[0],
      requests: ship[1]
    };
  })
  .slice(0, 9)
  .reduce(formatTopEmptyBuilds, []);

let topEmptyUpgrades = emptyUpgrades
  .map(ship => {
    return {
      rank: emptyUpgrades.indexOf(ship) + 1, 
      requests: ship[1],
      name: ship[0]
    };
  })
  .slice(0, 9)
  .reduce(formatTopEmptyBuilds, []);

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

function formatTopEmptyBuilds(output, ship) {
  output.push(`${ship.rank}: ${ship.name}`);
  return output;
}
console.log(sortObject(emptySkills).join("\n"));
console.log(sortObject(emptyUpgrades).join("\n"));
console.log(sortObject(wrongName).join("\n"));
console.log(topEmptySkills.join("\n"));
console.log(topEmptyUpgrades.join("\n"));
console.log("done!");