const { MessageEmbed, GuildMember } = require('discord.js')

module.exports = {
    name: 'save',
    description: 'Зберегти назву та посилання на трек собі в приват',

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

        const embedMessageDMS = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(`Назва треку [${queue.current.title}](${queue.current.url}). Збережено з сервера **${interaction.guild.name}**`)

        interaction.member.send({ embeds: [embedMessageDMS] }).then(() => {

        const embedMessagedDMS = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(`Перевірте свій приват!`)

            interaction.editReply({ embeds: [embedMessagedDMS] });
        }).catch(error => {
            const embedMessageDMSUnsuccessful = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Не вдалось написати вам в приват. Можливо у вас закритий приват, або ви мене заблокували`)
            interaction.editReply({ embeds: [embedMessageDMSUnsuccessful] });
        });
    },
};