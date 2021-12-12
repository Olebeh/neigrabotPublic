const { MessageEmbed, GuildMember } = require('discord.js')

module.exports = {
    name: 'clear',
    description: 'Очищаю чергу',

    async execute(interaction, player) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const queue = player.getQueue(interaction.guild.id);

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        const embedEmptyAfter = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Поки що це остання пісня в черзі!`)

        if (!queue.tracks[0]) return interaction.editReply({ embeds: [embedEmptyAfter] });

        await queue.clear();

        const embedQueueCleared = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(`☃️ Чергу очищено!`)

        interaction.editReply({ embeds: [embedQueueCleared] });
    },
};