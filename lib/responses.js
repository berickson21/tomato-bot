function prepareResponse(message) {
    // Ignore any message that does not start with the % prefix or sent by another bot
    if (message.content.charAt(0) !== process.env.PREFIX || (message.author.bot && message.author.id != 249609541954568195)) return;
    // Splits the message content into an array of words.
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    // Separates the command from the rest of the words
    const command = args.shift().toLowerCase();
    // Don't worry about it...
    // const powerUser = message.author.id === process.env.POWER_USER ? true : false;


    switch (command) {
    case "build":
        return args.length > 1 ?
            getNationalBuild(args[0].toLowerCase(), args[1].toLowerCase()) :
            getSpecialBuild(args[0].toLowerCase());
    }
    // case "say":
    //     if (powerUser) {
    //         // eslint-disable-next-line no-unused-vars
    //         message.delete().catch(O_o => {});
    //         return args.join(" ");
    //     } else {
    //         return "I don't wanna!";
    //     }
    // %hesright
    // case "hesright":
    //     response = powerUser ? "<:hesright:473885793341931531>" : "Viykin's right.";
    //     break;
    // %ship
    return "Unknown command.";
}

function getNationalBuild(nation, type) {
    let build = "Soon\u2122";
    switch (nation) {
    case "us":
    case "usa":
    case "usn":
    case "america":
    case "murica":
        switch (type) {
        case "dd":
        case "destroyer":
            build = "USA destroyer placeholder";
            break;
        case "cl":
        case "light cruiser":
            build = "USA light cruiser placeholder";
            break;
        case "ca":
        case "heavy cruiser":
            build = "USA heavy cruiser placeholder";
            break;
        case "bb":
        case "battleship":
            build = "USA battleship placeholder";
            break;
        case "cv":
        case "carrier":
            build = "no u";
            break;
        default:
            build = "I didn't understand that ship type!";
            break;
        }
        break;

    case "japan":
    case "japanese":
    case "ijn":
    case "jp":
        switch (type) {
        case "dd":
        case "destroyer":
            build = "Japanese destroyer placeholder";
            break;
        case "cl":
        case "light cruiser":
            build = "Soon\u2122";
            break;
        case "ca":
        case "heavy cruiser":
            build = "Japanese heavy cruiser placeholder";
            break;
        case "bb":
        case "battleship":
            build = "Japanese battleship placeholder";
            break;
        case "cv":
        case "carrier":
            build = "no u";
            break;
        default:
            build = "I didn't understand that ship type!";
            break;
        }
        break;

    case "km":
    case "german":
    case "kriegsmarine":
        switch (type) {
        case "dd":
        case "destroyer":
            build = "German destroyer placeholder";
            break;
        case "cl":
        case "light cruiser":
            build = "Soon\u2122";
            break;
        case "ca":
        case "heavy cruiser":
            build = "German heavy cruiser placeholder";
            break;
        case "bb":
        case "battleship":
            build = "German battleship placeholder";
            break;
        default:
            build = "I didn't understand that ship type!";
            break;
        }
        break;
    case "russian":
    case "soviet":
    case "vmf":
    case "ru":
        switch (type) {
        case "dd":
        case "destroyer":
            build = "Soviet destroyer placeholder";
            break;
        case "cl":
        case "light cruiser":
            build = "Soon\u2122";
            break;
        case "ca":
        case "heavy cruiser":
            build = "Soviet heavy cruiser placeholder";
            break;
        case "bb":
        case "battleship":
            build = "Soviet battleship placeholder";
            break;
        default:
            build = "I didn't understand that ship type!";
            break;
        }
        break;
    case "french":
    case "fr":
    case "mn":
    case "baguette":
        switch (type) {
        case "dd":
        case "destroyer":
            build = "French destroyer placeholder";
            break;
        case "cl":
        case "light cruiser":
            build = "Soon\u2122";
            break;
        case "ca":
        case "heavy cruiser":
            build = "French heavy cruiser placeholder";
            break;
        case "bb":
        case "battleship":
            build = "French battleship placeholder";
            break;
        default:
            build = "I didn't understand that ship type!";
            break;
        }
        break;
    case "pan-asian":
    case "pan asian":
    case "asian":
        switch (type) {
        case "dd":
        case "destroyer":
            build = "Pan-Asian destroyer placeholder";
            break;
        case "cl":
        case "light cruiser":
            build = "Soon\u2122";
            break;
        case "ca":
        case "heavy cruiser":
            build = "Soon\u2122";
            break;
        case "bb":
        case "battleship":
            build = "Soon\u2122";
            break;
        default:
            build = "I didn't understand that ship type!";
            break;
        }
        break;
    case "italian":
    case "it":
    case "mm":
        switch (type) {
        case "dd":
        case "destroyer":
            build = "Soon\u2122";
            break;
        case "cl":
        case "light cruiser":
            build = "Soon\u2122";
            break;
        case "ca":
        case "heavy cruiser":
            build = "Soon\u2122";
            break;
        case "bb":
        case "battleship":
            build = "Soon\u2122";
            break;
        default:
            build = "I didn't understand that ship type!";
            break;
        }
        break;
    default:
        build = "I didn't understand that nation!";
        break;
    }
    return build;
}

// eslint-disable-next-line no-unused-vars
function getSpecialBuild(name) {
    var build = "Soon\u2122";
    return build;
}
module.exports = {
    prepareResponse
};