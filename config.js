const dotenv = require(`dotenv`);

dotenv.config();

module.exports = {
    app: {
        px: '-',
        token: process.env.DISCORD_CLIENT_TOKEN,
            playing: `-help | -ping`
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: 'DJ',
            commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'seek', 'shuffle', 'skip', 'stop', 'volume']
        },
        maxVol: 200,
        loopMessage: false,
        discordPlayer: {
          fetchBeforeQueued: true,
          ytdlOptions: {
            quality: 'lowest',
            filter: 'audioonly',
            highWaterMark: 1 << 30,
            dlChunkSize: 0
                    },
            },
    }}
;;