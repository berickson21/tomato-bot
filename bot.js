var Discord = require('discord.io');
var logger = require('winston');
require('dotenv').config()
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: process.env.BOT_TOKEN,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '%') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        var message = "";
        switch(cmd.toLowerCase()) {
            // %hi
            case 'hi':
                message = "Hi!"
            break;
            // %build
            case 'build':
                message = getBuild(args[0], args[1])
                break;
            // %hesright
            case 'hesright':
                message = user === "Viykin" ? '<:hesright:473885793341931531>' : "Viykin's right."
                break;
            // %ship
            case 'ship':
                message = `?ship ${args[0]}`
                break;
         };
         bot.sendMessage({
            to: channelID,
            message: message
        })
     }
});

function getBuild(nation, type) {
    switch (nation.toLowerCase()) {
        case "us":
        case "usa":
        case "usn":
        case "america":
        case "murica":
            switch (type.toLowerCase()) {
                case "dd":
                case "destroyer":
                    return "USA destroyer placeholder"
                case "cl":
                case "light cruiser":
                    return "USA light cruiser placeholder"
                case "ca":
                case "heavy cruiser":
                    return "USA heavy cruiser placeholder"
                case "bb":
                case "battleship":
                    return "USA battleship placeholder"
                case "cv":
                case "carrier":
                    return "no u"
                default:
                    return "I didn't understand that ship type!"
            }    
        case "japan":
        case "japanese":
        case "ijn":
        case "jp":
            switch (type.toLowerCase()) {
                case "dd":
                case "destroyer":
                    return "Japanese destroyer placeholder"
                case "cl":
                case "light cruiser":
                    return "Soon\u2122"
                case "ca":
                case "heavy cruiser":
                    return "Japanese heavy cruiser placeholder"
                case "bb":
                case "battleship":
                    return "Japanese battleship placeholder"
                case "cv":
                case "carrier":
                    return "no u"
                default:
                    return "I didn't understand that ship type!"
            }    
        case "km":
        case "german":
        case "kriegsmarine":
            switch (type.toLowerCase()) {
                case "dd":
                case "destroyer":
                    return "German destroyer placeholder"
                case "cl":
                case "light cruiser":
                    return "Soon\u2122"
                case "ca":
                case "heavy cruiser":
                    return "German heavy cruiser placeholder"
                case "bb":
                case "battleship":
                    return "German battleship placeholder"
                default:
                    return "I didn't understand that ship type!"
            }    
        case "russian":
        case "soviet":
        case "vmf":
        case "ru":
            switch (type.toLowerCase()) {
                case "dd":
                case "destroyer":
                    return "Soviet destroyer placeholder"
                case "cl":
                case "light cruiser":
                    return "Soon\u2122"
                case "ca":
                case "heavy cruiser":
                    return "Soviet heavy cruiser placeholder"
                case "bb":
                case "battleship":
                    return "Soviet battleship placeholder"
                default:
                    return "I didn't understand that ship type!"
            }
        case "french":
        case "fr":
        case "mn":
        case "baguette":
            switch (type.toLowerCase()) {
                case "dd":
                case "destroyer":
                    return "French destroyer placeholder"
                case "cl":
                case "light cruiser":
                    return "Soon\u2122"
                case "ca":
                case "heavy cruiser":
                    return "French heavy cruiser placeholder"
                case "bb":
                case "battleship":
                    return "French battleship placeholder"
                default:
                    return "I didn't understand that ship type!"
            }
        case "pan-asian":
        case "pan asian":
        case "asian":
            switch (type.toLowerCase()) {
                case "dd":
                case "destroyer":
                    return "Pan-Asian destroyer placeholder"
                case "cl":
                case "light cruiser":
                    return "Soon\u2122"
                case "ca":
                case "heavy cruiser":
                    return "Soon\u2122"
                case "bb":
                case "battleship":
                    return "Soon\u2122"
                default:
                    return "I didn't understand that ship type!"
            }      
        case "italian":
        case "it":
        case "mm":
            switch (type.toLowerCase()) {
                case "dd":
                case "destroyer":
                    return "Soon\u2122"
                case "cl":
                case "light cruiser":
                    return "Soon\u2122"
                case "ca":
                case "heavy cruiser":
                    return "Soon\u2122"
                case "bb":
                case "battleship":
                    return "Soon\u2122"
                default:
                    return "I didn't understand that ship type!"
            }      
        default:
            return "I didn't understand that nation!"
            
    }
}