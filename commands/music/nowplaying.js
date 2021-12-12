const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'nowplaying',
    description: 'Показує всю інформацію про поточний трек',

    execute(interaction, player) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const queue = player.getQueue(interaction.guild.id);

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        const track = queue.current;

        const embed = new MessageEmbed();

        embed.setColor('DARK_VIVID_PINK');

        const methods = ['вимкнено', 'трека', 'черги'];

        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Infinity' ? 'безкінечно (стрім)' : track.duration;
        const progress = queue.createProgressBar();

        embed.setDescription(`Назва треку [${queue.current.title}](${queue.current.url})\nАвтор **${queue.current.author}**\nГучність **${queue.volume}**%\nТривалість **${trackDuration}**\nПовторювання **${methods[queue.repeatMode]}**\nЗапит від ${track.requestedBy}\n${progress} (**${timestamp.progress}**%)`);
        if (timestamp.progress == 'Infinity') embed.setDescription(`Назва треку [${queue.current.title}](${queue.current.url})\nАвтор **${queue.current.author}**\nГучність **${queue.volume}**%\nТривалість **∞**\nПовторювання **${methods[queue.repeatMode]}**\nЗапит від ${track.requestedBy}`);

        embed.setFooter('Найкращий музичний бот. Спеціально для Неігри', interaction.member.avatarURL({ dynamic: true }));
        embed.setTimestamp();
        
        interaction.editReply({ embeds: [embed] })
    },
};