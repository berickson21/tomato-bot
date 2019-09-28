import {
    Client
} from 'discord.io';
import {
    remove,
    transports,
    add,
    level,
    info
} from 'winston';
import {
    token as _token
} from './auth.json';

// Configure logger settings
remove(transports.Console);
add(new transports.Console, {
    colorize: true
});
level = 'debug';
// Initialize Discord Bot
var bot = new Client({
    token: _token,
    autorun: true
});
bot.on('ready', function (evt) {
    info('Connected');
    info('Logged in as: ');
    info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '%') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd.toLowerCase()) {
            // !hi
            case 'hi':
                bot.sendMessage({
                    to: channelID,
                    message: 'Hi!'
                });
                break;
                // Just add any case commands if you want to..
        }
    }
});