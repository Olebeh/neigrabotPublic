const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: 'stop',
    description: 'Зупиняє музику',

    async execute(interaction, player) {

        const queue = player.getQueue(interaction.guild.id);

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        queue.destroy();
        const embedStop = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(`Музику зупинено!`)
        interaction.editReply({ embeds: [embedStop] });
    },
};