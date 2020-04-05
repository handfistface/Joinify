
let BaseCommand = require("./BaseCommand.js");

/*
 * Displays help information about the Joinify bot to the user
 */
class HelpCommand extends BaseCommand {

    constructor(cmdParams, botClient, msg) {
        super(cmdParams, botClient, msg);
    }

    /*
     * Processes the help command, displays information from the message
     * Make sure to set the message
     */
    ProcessHelp() {
        var msg = '';
        msg += 'Comand list: \n';
        msg += '\t!watch [channel name] -- Watches a channel for people joining a channel\n';
        msg += '\t!joinchange [youtube link] -- changes the audio thats played on joining a channel\n';
        msg += '\t!leavechange [youtube link] -- changes the audio thats played on leaving a channel\n';
        msg += '\t!joinifyplay [youtube link] -- joins and plays the audio link';

        this.ReplyToMessage(msg);
    }
}

module.exports = HelpCommand;