function prepareResponse(message, command, args, powerUser) {
    var response = "Unknown command.";
    switch (command) {
        // %hi
        case 'hi':
            response = "Hi!";
            // %build
            break;
        case "say":
            if (powerUser) {
                response = args.join(" ");
                message.delete().catch(O_o => {});
            }
            break;
        case 'build':
            response = args.length > 1 ?
                getNationalBuild(args[0].toLowerCase(), args[1].toLowerCase()) :
                getSpecialBuild(args[0].toLowerCase());
            break;
            // %hesright
        case 'hesright':
            response = powerUser ? '<:hesright:473885793341931531>' : "Viykin's right.";
            // %ship
        case 'ship':
            response = `?ship ${args[0]}`;
            break;
    };
    return response;
}

function getNationalBuild(nation, type) {
    let build = "Soon\u2122"
    switch (nation) {
        case "us":
        case "usa":
        case "usn":
        case "america":
        case "murica":
            switch (type) {
                case "dd":
                case "destroyer":
                    build = "USA destroyer placeholder"
                    break;
                case "cl":
                case "light cruiser":
                    build = "USA light cruiser placeholder"
                    break;
                case "ca":
                case "heavy cruiser":
                    build = "USA heavy cruiser placeholder"
                    break;
                case "bb":
                case "battleship":
                    build = "USA battleship placeholder"
                    break;
                case "cv":
                case "carrier":
                    build = "no u"
                    break;
                default:
                    build = "I didn't understand that ship type!"
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
                    build = "Japanese destroyer placeholder"
                    break;
                case "cl":
                case "light cruiser":
                    build = "Soon\u2122"
                    break;
                case "ca":
                case "heavy cruiser":
                    build = "Japanese heavy cruiser placeholder"
                    break;
                case "bb":
                case "battleship":
                    build = "Japanese battleship placeholder"
                    break;
                case "cv":
                case "carrier":
                    build = "no u"
                    break;
                default:
                    build = "I didn't understand that ship type!"
                    break;
            }
            break;

        case "km":
        case "german":
        case "kriegsmarine":
            switch (type) {
                case "dd":
                case "destroyer":
                    build = "German destroyer placeholder"
                    break;
                case "cl":
                case "light cruiser":
                    build = "Soon\u2122"
                    break;
                case "ca":
                case "heavy cruiser":
                    build = "German heavy cruiser placeholder"
                    break;
                case "bb":
                case "battleship":
                    build = "German battleship placeholder"
                    break;
                default:
                    build = "I didn't understand that ship type!"
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
                    build = "Soviet destroyer placeholder"
                    break;
                case "cl":
                case "light cruiser":
                    build = "Soon\u2122"
                    break;
                case "ca":
                case "heavy cruiser":
                    build = "Soviet heavy cruiser placeholder"
                    break;
                case "bb":
                case "battleship":
                    build = "Soviet battleship placeholder"
                    break;
                default:
                    build = "I didn't understand that ship type!"
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
                    build = "French destroyer placeholder"
                    break;
                case "cl":
                case "light cruiser":
                    build = "Soon\u2122"
                    break;
                case "ca":
                case "heavy cruiser":
                    build = "French heavy cruiser placeholder"
                    break;
                case "bb":
                case "battleship":
                    build = "French battleship placeholder"
                    break;
                default:
                    build = "I didn't understand that ship type!"
                    break;
            }
            break;
        case "pan-asian":
        case "pan asian":
        case "asian":
            switch (type) {
                case "dd":
                case "destroyer":
                    build = "Pan-Asian destroyer placeholder"
                    break;
                case "cl":
                case "light cruiser":
                    build = "Soon\u2122"
                    break;
                case "ca":
                case "heavy cruiser":
                    build = "Soon\u2122"
                    break;
                case "bb":
                case "battleship":
                    build = "Soon\u2122"
                    break;
                default:
                    build = "I didn't understand that ship type!"
                    break;
            }
            break;
        case "italian":
        case "it":
        case "mm":
            switch (type) {
                case "dd":
                case "destroyer":
                    build = "Soon\u2122"
                    break;
                case "cl":
                case "light cruiser":
                    build = "Soon\u2122"
                    break;
                case "ca":
                case "heavy cruiser":
                    build = "Soon\u2122"
                    break;
                case "bb":
                case "battleship":
                    build = "Soon\u2122"
                    break;
                default:
                    build = "I didn't understand that ship type!"
                    break;
            }
            break;
        default:
            build = "I didn't understand that nation!"
            break;
    }
    return build
}

function getSpecialBuild(name) {
    var build = "Soon\u2122"
    return build
}
module.exports = {
    prepareResponse
};