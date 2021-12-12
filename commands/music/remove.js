const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: 'remove',
    description: 'Вилучає вказаний трек з черги',
    options: [
      {
        name: 'трек',
        type: 4,
        description: 'Номер треку',
        required: true,
      },
    ],

    async execute (interaction, player) {

        const queue = player.getQueue(interaction.guild.id);

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const embedNothing = new MessageEmbed()
        embedNothing.setColor('RED')
        embedNothing.setDescription(`Зараз нічого не відвторюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        const embedEmptyAfter = new MessageEmbed()
        embedEmptyAfter.setColor('RED')
        embedEmptyAfter.setDescription(`Поки що це остання пісня в черзі!`)

        if (!queue.tracks[0]) return interaction.editReply ({ embeds: [embedEmptyAfter] });

        const args = interaction.options.get('трек').value;

        const embedRemovedSuccessful = new MessageEmbed()
        embedRemovedSuccessful.setColor('DARK_VIVID_PINK')
        embedRemovedSuccessful.setDescription(`Вилучено пісню з черги!`)
        if (queue.tracks.length < args) embedRemovedSuccessful.setDescription(`В черзі немає стільки треків!`)

        queue.tracks.splice(args - 1, 1)

        interaction.editReply({ embeds: [embedRemovedSuccessful] });
    },
};