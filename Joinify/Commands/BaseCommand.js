
class BaseCommand {

    /*
     * @cmdParams - The collection of command parameters sent to the watch command, expects a string array
     * @botClient - The discord bot client created and institated through Discord.js
     * @msg - The message that was originally sent starting this command
     */
    constructor(cmdParams, botClient, msg) {
        this.commandParameters = cmdParams;
        this.client = botClient;
        this.message = msg;
    }

    /*
     * Gets a voice channel id by its name
     * @channelName - the channel's name
     * @return - The channel id, if no channel was found then '' is returned
     */
    GetVoiceChannelIdByName(channelName) {
        //find the channel the use wants to join
        var chnls = this.message.guild.channels;
        var selectedChannel = chnls.cache.find(channel =>
            channel.name === channelName
            && channel.type === 'voice'
        );
        var channelId = '';
        //only select the channel id if the channel was setup properly
        if (selectedChannel != undefined) {
            channelId = selectedChannel.id;
        }

        return channelId;
    }
}

module.exports = BaseCommand;