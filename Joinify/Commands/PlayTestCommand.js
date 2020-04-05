
let BaseCommand = require("./BaseCommand.js");
let AudioPlayer = require("../Audio/AudioPlayer.js");

/*
 * Plays a youtube link that a user requests
 */
class PlayTestCommand extends BaseCommand {

    audioPlayer;		//the AudioPlayer class for the project who will play audio

    constructor(cmdParams, botClient, msg) {
        super(cmdParams, botClient, msg);
        this.audioPlayer = new AudioPlayer(botClient);
    }

    /*
     * Joins the channel and plays the given audio link
     * Expects the class variables message and commandParameters to be up to date
     */
    ProcessPlayTestCommand() {
        var ytLink = this.commandParameters[0];
        this.audioPlayer.client = this.client;
        this.audioPlayer.channelId = this.message.member.voice.channelID;       //this catches if a user is in a voice channel and defaults to their channel

        //catch a null case if the user was not in a channel
        if (this.audioPlayer.channelId == null)
            return;
        this.audioPlayer.PlayYoutube(ytLink);
    }
}

module.exports = PlayTestCommand;