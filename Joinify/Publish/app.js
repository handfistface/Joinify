
//run dotenv to import configuration variables
require('dotenv').config();
//import libraries
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const client = new Discord.Client();
//import other files
let WatchCommand = require('./Commands/WatchCommand.js');

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
        cmd = msg.content.substring(0, msg.content.indexOf(' '));
        //split the command parameters up
        cmdParameters = msg.content.substring(cmd.length + 1).split(' ');
    }

    if (cmd == '!ping') {
        msg.channel.send('pong');
    } else if (cmd == '!watch') {
        try {
            let watchCmd = new WatchCommand(cmdParameters, client, msg);
            watchCmd.ProcessWatchCommand();
        } catch (ex) {
            console.log('Error while processing join command: ' + ex.message);
        }
    } else if (cmd == '!disconnect') {

    }
});

//initialize the bot by connecting to the server
client.login(process.env.DISCORD_TOKEN);
