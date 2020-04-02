
const ytdl = require('ytdl-core');

class AudioPlayer {

    client;     //discord bot client managed through discord.js
    channelId;      //channelId who will play audio
    leaveChatAfterPlay;     //boolean, leaves the chat after playing audio
    isAudioReady;           //only allows playing audio one at a time

    /*
     * @botClient - The discord bot client created and instaniated through discord.js
     */
    constructor(botClient) {
        this.client = botClient;
        this.channelId = '';
        this.leaveChatAfterPlay = true;
        this.isAudioReady = true;
    }

    PlayYoutube(link) {

        if (this.isAudioReady == false)
            return;     //the player is already playing audio

        try {
            //connect to the channel that the user has just connected to
            const channel = this.client.channels.cache.get(this.channelId);
            channel.join().then(connection => {
                //voice chat join successful
                this.isAudioReady = false;
                //'D:\code\Joinify\Joinify\AudioFiles\yooooooooooo.mp3'
                var ytStream = ytdl(link, { filter: 'audioonly' });
                const dispatcher = connection.play(ytStream, { volume: 0.25, quality: 'highestaudio' })
                dispatcher.on('finish', () => {
                    //ended playing the file
                    this.isAudioReady = true;
                    if (this.leaveChatAfterPlay == true)
                        channel.leave();
                });
            });
        } catch (ex) {
            console.error('Exception while playing audio in AudioPlayer: ' + ex);
        }
    }

}

module.exports = AudioPlayer;