const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'jump',
    description: 'Примусово вмикає любий трек з черги',
    options: [
        {
            name: 'трек',
            type: 4,
            description: 'Номер треку, який ви хочете примусово ввімкнути',
            required: 'true',
        },
    ],

    async execute(interaction, player) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const queue = player.getQueue(interaction.guild.id);

        const embedNothing = new MessageEmbed()
        embedNothing.setColor('RED')
        embedNothing.setDescription(`Зараз нічого не відвторюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        const embedEmptyAfter = new MessageEmbed()
        embedEmptyAfter.setColor('RED')
        embedEmptyAfter.setDescription(`Поки що це остання пісня в черзі!`)

        if (!queue.tracks[0]) return interaction.editReply({ embeds: [embedEmptyAfter] });

        const embedNoTracks = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Невірний номер треку! Введіть дійсне значення від **1** до **${queue.tracks.length}**!`)

        const args = interaction.options.get('трек').value
        if (queue.tracks.length < args || args === 0) return interaction.editReply({ embeds: [embedNoTracks] })

        const embedJumpedSuccessful = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Трек переміщено на першу позицію!`)

        await queue.jump(args - 1)

        interaction.editReply({ embeds: [embedJumpedSuccessful] });
    },
};