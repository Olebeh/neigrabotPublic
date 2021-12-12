const { QueueRepeatMode } = require('discord-player');
const { MessageEmbed, GuildMember } = require('discord.js')

module.exports = {
    name: 'loop',
    description: 'Включає режим повторення треку/черги',
    options: [
        {
            name: 'режим',
            description: 'Вибір режиму повторення, повторення треку або черги',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'трек',
                    value: 'track',
                },
                {
                    name: 'черга',
                    value: 'queue',
                },
            ],
        },
    ],

    execute(interaction, player, client) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const queue = player.getQueue(interaction.guild.id);

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        const args = interaction.options.get('режим').value;

        if (args === 'queue') {

            const embedTrackLoopAlreadyOn = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Спочатку ви повинні вимкнути повторення поточної пісні **(${client.config.app.px}loop)**`)

            if (queue.repeatMode === 1) return message.channel.send({ embeds: [embedTrackLoopAlreadyOn] });

            const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

            const embedQueueLoopSuccess = new MessageEmbed()
            .setColor(success ? 'DARK_VIVID_PINK' : 'RED')
            .setDescription(success ? `Режим повторення **${queue.repeatMode === 0 ? 'вимкнено' : 'увімкнено'}**` : `Щось пішло не так`)

            return interaction.editReply({ embeds: [embedQueueLoopSuccess] });

        } else {

            const embedQueueLoopAlreadyOn = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Спочатку ви повинні вимкнути повторення черги \`(/loop queue)\``)

            if (queue.repeatMode === 2) return interaction.editReply({ embeds: [embedQueueLoopAlreadyOn] });

            const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);

            const embedTrackLoopSuccess = new MessageEmbed()
            .setColor(success ? 'DARK_VIVID_PINK' : 'RED')
            .setDescription(success ? `Режим повторення **${queue.repeatMode === 0 ? 'вимкнено' : 'увімкнено'}**` : `Щось пішло не так`)

            return interaction.editReply({ embeds: [embedTrackLoopSuccess] });
        };
    },
};