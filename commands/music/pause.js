const { MessageEmbed, GuildMember } = require('discord.js')

module.exports = {
    name: 'pause',
    description: 'Призупиняє трек',

    execute(interaction, player) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const queue = player.getQueue(interaction.guild.id);
        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється`)

        if (!queue) return interaction.editReply({ embeds: [embedNothing] });

        const success = queue.setPaused(true);

        const embedPausedSuccessful = new MessageEmbed()
        .setColor(success ? `DARK_VIVID_PINK` : `RED`)
        .setDescription(success ? `❄️ Трек [${queue.current.title}](${queue.current.url}) зупинено!` : `Трек і так зупинено. Можливо ви мали наувазі \`/resume\`?`)

        return interaction.editReply({ embeds: [embedPausedSuccessful] });
    },
};