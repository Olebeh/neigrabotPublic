const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: 'back',
    description: 'Включає попередній трек',

    async execute(interaction, player) {

        const queue = player.getQueue(interaction.guild.id);

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        const embedFirstTrack = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Це єдиний трек в черзі!`)

        if (!queue.previousTracks[1]) return interaction.editReply({ embeds: [embedFirstTrack] });

        await queue.back();

        const embedBackSuccessful = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(`❄️ Зараз відтворюється **попередній** трек!`)

        interaction.editReply({ embeds: [embedBackSuccessful] });
    },
};