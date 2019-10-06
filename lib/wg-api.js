const { WorldOfWarships } = require("wargamer");

const wows = WorldOfWarships({
  realm: "na",
  applicationId: process.env.APP_ID
});
console.log(wows);
