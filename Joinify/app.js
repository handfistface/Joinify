
//run dotenv to import configuration variables
require('dotenv').config();
//import libraries
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const client = new Discord.Client();

//import classes
let WatchCommand = require('./Commands/WatchCommand.js');
let HelpCommand = require('./Commands/HelpCommand.js');
let PlayTestCommand = require('./Commands/PlayTestCommand.js');

//command initialization
var watchCmd = new WatchCommand(null, null, null);
var helpCmd = new HelpCommand(null, null, null);
var playCmd = new PlayTestCommand(null, null, null);

//event listener when a user connects to the server
client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag );
});

//event listener when a user sends a message in the chat
client.on('message', msg => {

    //return from the message queue if the first character wasn't an !
    if (msg.content.substring(0, 1) != '!')
        return;

    //get the command that was processed
    var cmd = '';
    var cmdParameters = '';
    if (msg.content.indexOf(' ') == -1)
        cmd = msg.content;
    else {
        //then there were parameters given to this command
        cmd = msg.content.substring(0, msg.content.indexOf(' '));
        cmdParameters = msg.content.substring(cmd.length + 1).split(' ');
    }

    if (cmd == '!watch') {
        //this was the watch command
        try {
            watchCmd.commandParameters = cmdParameters;
            watchCmd.client = client;
            watchCmd.message = msg;
            watchCmd.ProcessWatchCommand();
        } catch (ex) {
            console.log('Error while processing watch command: ' + ex.message);
        }
    } else if (cmd == '!joinchange') {
        //the user wants to change the join link
        watchCmd.commandParameters = cmdParameters;
        watchCmd.client = client;
        watchCmd.message = msg;
        watchCmd.ProcessJoinChangeCommand();
    } else if (cmd == '!leavechange') {
        //the user wants to change the leave link
        watchCmd.commandParameters = cmdParameters;
        watchCmd.client = client;
        watchCmd.message = msg;
        watchCmd.ProcessLeaveChangeCommand();
    } else if (cmd == '!joinifyhelp') {
        //this was the help command
        helpCmd.commandParameters = cmdParameters;
        helpCmd.client = client;
        helpCmd.message = msg;
        helpCmd.ProcessHelp();
    } else if (cmd == '!joinifyplay') {
        //this was the play command
        playCmd.commandParameters = cmdParameters;
        playCmd.client = client;
        playCmd.message = msg;
        playCmd.ProcessPlayTestCommand();
    }
});

//initialize the bot by connecting to the server
client.login(process.env.DISCORD_TOKEN);
