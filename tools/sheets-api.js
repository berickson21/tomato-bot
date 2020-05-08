const jetpack = require("fs-jetpack");
const { reduce } = require("lodash");
// const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
// const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
// getSheetEntry().then(a => {
//   console.log(a);
// });

async function getSheetEntry(type) {
  const credentials = jetpack.read(
    jetpack.path(jetpack.cwd(), "credentials.json")
  );
  let callback = type === "skills" ? getCaptainSkills : getUpgrades;
  const output = await authorize(JSON.parse(credentials), callback);
  return output;
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const token = jetpack.read(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));
  let output = await callback(oAuth2Client);
  return output;
  // Check if we have previously stored a token.
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
// async function getNewToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES
//   });
//   console.log("Authorize this app by visiting this url:", authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
//   rl.question("Enter the code from that page here: ", async code => {
//     rl.close();
//     oAuth2Client.getToken(code, async (err, token) => {
//       if (err)
//         return console.error(
//           "Error while trying to retrieve access token",
//           err
//         );
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
//         if (err) return console.error(err);
//         console.log("Token stored to", TOKEN_PATH);
//       });
//       return await callback(oAuth2Client);
//     });
//   });
// }

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function getUpgrades(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  let res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1gviI0FbwIpUGk1yEKru9sJcycaE45c3AjS4oM4a0gx4",
    range: "Upgrades"
  });
  if (res.err)
    return console.error("The Sheets API returned an error: " + res.err);
  const rows = res.data.values;
  if (rows.length) {
    // Print columns A and E, which correspond to indices 0 and 4.
    return reduce(
      rows,
      (acc, row) => {
        if (row.length > 1) {
          acc[row[0]] = row;
        }
        return acc;
      },
      {}
    );
  } else {
    console.log("No data found.");
  }
}

async function getCaptainSkills(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  let res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1gviI0FbwIpUGk1yEKru9sJcycaE45c3AjS4oM4a0gx4",
    range: "Captain Skills"
  });
  if (res.err)
    return console.error("The Sheets API returned an error: " + res.err);
  const rows = res.data.values;
  if (rows.length) {
    // Print columns A and E, which correspond to indices 0 and 4.
    return reduce(
      rows,
      (acc, row) => {
        if (row.length > 1) {
          acc[row[0]] = row;
        }
        return acc;
      },
      {}
    );
  } else {
    console.log("No data found.");
  }
}

module.exports = { getSheetEntry, getCaptainSkills };
