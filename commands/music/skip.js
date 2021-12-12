const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Пропускає поточний трек',

    async execute(interaction, player) {

        const queue = player.getQueue(interaction.guild.id);

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.reply({ embeds: [embedVoiceChannel] });

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        const success = queue.skip();

        const embedSkipSuccess = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(success ? `❄️ Трек [${queue.current.title}](${queue.current.url}) пропущено!` : `Щось пішло не так`)

        return interaction.editReply({ embeds: [embedSkipSuccess] });
    },
};