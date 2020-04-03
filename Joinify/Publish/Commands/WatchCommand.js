
let BaseCommand = require("./BaseCommand.js");
let AudioPlayer = require("../Audio/AudioPlayer.js");
let DateService = require('../Utilities/DateService.js');
const ytdl = require('ytdl-core');

/*
 * Represents a command for watching a channel
 */
class WatchCommand extends BaseCommand {

    channelId;      //channel id who is being watched
    friendlyChannelName;        //friendly name of the channel being watched
    joinLink;       //youtube link to play when a person joins
    leaveLink;      //youtube link to play when a person leaves
    audioPlayer;        //AudioPlayer class which plays audio for the app
    dateService;        //used for helping with generating date strings

    /*
     * @cmdParams - The collection of command parameters sent to the watch command, expects a string array
     * @botClient - The discord bot client created and institated through Discord.js
     * @msg - The message that was originally sent starting this command
     */
    constructor(cmdParams, botClient, msg) {
        super(cmdParams, botClient, msg);
        //class based variable initialization
        this.channelId = '';
        this.friendlyChannelName = '';
        this.joinLink = 'https://www.youtube.com/watch?v=KLIiGMMMf-E';
        //this.joinLink = 'https://youtu.be/MvlGLx4M1cw';
        this.leaveLink = 'https://youtu.be/7NFwhd0zsHU';
        this.audioPlayer = new AudioPlayer(botClient);
        this.dateService = new DateService();
    }

    /*
     * Processes the watch command
     */
    ProcessWatchCommand() {
        if (this.commandParameters.length < 1)
            return;
        //get the channel id
        this.friendlyChannelName = this.message.content.substring(this.message.content.indexOf(' ') + 1);
        this.channelId = this.GetVoiceChannelIdByName(this.friendlyChannelName);

        //if the channel id was empty then the channel wasn't found, reply to the user and tell them they mistyped the channel
        if (this.channelId == '') {
            this.message.channel.send('Channel ' + this.friendlyChannelName + ' not found');
            return;
        } else {

            //hook to the join events for the given channel id
            this.client.on('voiceStateUpdate', (oldMember, newMember) => {
                this.ListenToChannel(oldMember, newMember);
            });

            //just display a message so the user knows they're being watched
            var msg = 'Watching the channel ' + this.friendlyChannelName + ' for joining users';
            this.ReplyToMessage(msg);
            this.audioPlayer.channelId = this.channelId;
        }

    }



    /*
     * Listens to the channel given to by this.channelId setup with the ProcessCommand() function
     * Intended to be private
     * Works with ProcessWatchCommand
     */
    ListenToChannel(oldMember, newMember) {
        let newUserChannel = newMember.channel;
        let oldUserChannel = oldMember.channel;
        this.audioPlayer.client = this.client;

        //don't process the channel if the user who joined is Joinify or if there's already an audio thread being processed
        if (newMember.member.displayName == 'Joinify' || this.isAudioReady == false) {
            return;
        }

        if (
            (oldUserChannel === null && newUserChannel !== null && newUserChannel.id == this.channelId) ||
            (oldUserChannel !== null && newUserChannel !== null && oldUserChannel.id != newUserChannel.id && newUserChannel.id == this.channelId)
        ) {
            //a user has joined the watching channel
            //this.message.channel.send('User has joined ' + newUserChannel.name);
            var msg = this.dateService.GetCurrentDateTime() + 
                ' - User ' + newMember.member.displayName + ' has joined ' + newUserChannel.name;
            console.info(msg);
            this.audioPlayer.PlayYoutube(this.joinLink);
        }
        else if (
            (oldUserChannel !== null && newUserChannel === null && oldUserChannel.id == this.channelId) ||      //user has left the channel
            (oldUserChannel !== null && newUserChannel !== null && newUserChannel.id != this.channelId)         //user has swapped channels
        ) {
            //a user has left a voice channel 
            //this.message.channel.send("User has left " + oldUserChannel.name);
            var msg = this.dateService.GetCurrentDateTime() +
                " - User " + oldMember.member.displayName + " has left " + oldUserChannel.name;
            console.info(msg);
            this.audioPlayer.PlayYoutube(this.leaveLink);
        }
    }

    /*
     * Changes the join command to the command parameter fed to this function
     * Expects this.commandParameters to be set prior to calling this function
     */
    ProcessJoinChangeCommand() {
        var newYtLink = this.commandParameters[0];
        this.joinLink = newYtLink;
        var msg = 'Join audio changed to the link: ' + newYtLink;
        this.ReplyToMessage(msg);
    }

    /*
     * Changes the leave command to the command parameter fed to this function
     * Expects this.commandParameters to be set prior to calling this function
     */
    ProcessLeaveChangeCommand() {
        var newYtLink = this.commandParameters[0];
        this.leaveLink = newYtLink;
        var msg = 'Leave audio changed to the link: ' + newYtLink;
        this.ReplyToMessage(msg);
    }

}

module.exports = WatchCommand;