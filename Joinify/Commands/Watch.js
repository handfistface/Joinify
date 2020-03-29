
let BaseCommand = require("./BaseCommand.js");
const ytdl = require('ytdl-core');

class WatchCommand extends BaseCommand {

    channelId;      //channel id who is being watched
    friendlyChannelName;        //friendly name of the channel being watched
    isAudioReady;        //allows playing audio

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
        this.isAudioReady = true;
    }

    /*
     * Processes the watch command
     */
    ProcessCommand() {
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
            this.message.channel.send('Watching the channel ' + this.friendlyChannelName + ' for new users joining');
        }

        //hook to the join events for the given channel id
        this.client.on('voiceStateUpdate', (oldMember, newMember) => {
            this.ListenToChannel(oldMember, newMember);
        });
    }



    /*
     * Listens to the channel given to by this.channelId setup with the ProcessCommand() function
     * Intended to be private
     */
    ListenToChannel(oldMember, newMember) {
        let newUserChannel = newMember.channel;
        let oldUserChannel = oldMember.channel;

        //don't process the channel if the user who joined is Joinify or if there's already an audio thread being processed
        if (newMember.member.displayName == 'Joinify' || this.isAudioReady == false) {
            return;
        }

        if (
            (oldUserChannel === null && newUserChannel !== null && newUserChannel.id == this.channelId) ||
            (oldUserChannel !== null && newUserChannel !== null && oldUserChannel.id != newUserChannel.id && newUserChannel.id == this.channelId)
        ) {
            //a user has joined the watching channel
            this.message.channel.send('User has joined ' + newUserChannel.name);
            //connect to the channel that the user has just connected to
            const channel = this.client.channels.cache.get(this.channelId);
            channel.join().then(connection => {
                //voice chat join successful
                this.isAudioReady = false;
                var ytStream = 'D:\code\Joinify\Joinify\AudioFiles\yooooooooooo.mp3';//ytdl('https://www.youtube.com/watch?v=KLIiGMMMf-E');
                const dispatcher = connection.play(ytStream, { volume: 0.75, quality: 'highestaudio' });
                dispatcher.on('error', (ex) => {
                    console.error('Error while playing audio: ' + ex)
                });
                dispatcher.on('end', end => {
                    //ended playing the file
                    this.isAudioReady = true;
                    channel.leave();
                });
            }).catch(ex => {
                console.error('Error connecting to voice channel: ' + ex);
            })
        }
        else if (
            (oldUserChannel !== null && newUserChannel === null && oldUserChannel.id == this.channelId) ||      //user has left the channel
            (oldUserChannel !== null && newUserChannel !== null && newUserChannel.id != this.channelId)         //user has swapped channels
        ) {
            //a user has left a voice channel 
            this.message.channel.send("User has left " + oldUserChannel.name);
        }
    }

}

module.exports = WatchCommand;