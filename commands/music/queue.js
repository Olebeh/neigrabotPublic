const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Показує чергу',
    options: [
      {
        name: 'сторінка',
        type: 4,
        description: 'Номер сторінки',
        required: false,
      },
    ],

    async execute (interaction, player, client) {

        const queue = player.getQueue(interaction.guild.id);

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється!`)

        if (!queue) return interaction.editReply({ embeds: [embedNothing] });

        const embedEmptyAfter = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Поки що це остання пісня в черзі!`)

        if (!queue.tracks[0]) return interaction.editReply({ embeds: [embedEmptyAfter] });

        const methods = ['', '🔁', '🔂'];
        if (interaction.options.get('сторінка') == null) var args = 1;
        else args = interaction.options.get('сторінка').value

        const songs = queue.tracks.length;
        const parsedSongs = parseInt(songs);
        const maxPage = Math.ceil(parsedSongs/5)
        const page = args;
        const firstTrackInPage = page * 5 - 5;
        const lastTrackInPage = page * 5;
        const embedMaxPage = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Не дійсний номер сторінки! Введіть дійсне значення від **1** до **${maxPage}**!`)

        if (maxPage < page || page <= 0) {
            return interaction.editReply({ embeds: [embedMaxPage] })
        }

        //Виставляємо правильні закінчення
        function pluralizeUkr(number, one, two, five) {
            let n = Math.abs(number);
            n %= 100;
            if (n >= 5 && n <= 20) {
              return five;
            }
            n %= 10;
            if (n === 1) {
              return one;
            }
            if (n >= 2 && n <= 4) {
              return two;
            }
            return five;
          }

        const embedPaginated = new MessageEmbed();

        embedPaginated.setColor('DARK_VIVID_PINK');
        embedPaginated.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
        embedPaginated.setAuthor(`Черга - ${interaction.guild.name} ${methods[queue.repeatMode]}`, client.user.displayAvatarURL({ size: 1024, dynamic: true }));
        const tracksPaginated = queue.tracks.map((track, i) => `${i + 1} - [${track.title}](${track.url}) | ${track.author} | ${track.requestedBy}`);
        const nextSongsPaginated = songs > lastTrackInPage ? `І ще **${songs - lastTrackInPage}** інш${pluralizeUkr(songs - lastTrackInPage, `а`, `і`, `их`)} піс${pluralizeUkr(songs - lastTrackInPage, `ня`, `ні`, `ень`)}\n` : `Всього **${songs}** піс${pluralizeUkr(songs, `ня`, `ні`, `ень`)}\n`;
        embedPaginated.setDescription(`${page === 1 ? `Зараз грає [${queue.current.title}](${queue.current.url}) | ${queue.current.author}\n**Наступні:**\n\n` : ``}${tracksPaginated.slice(firstTrackInPage, lastTrackInPage).join('\n')}\n\n${nextSongsPaginated}\nСторінка **${page}/${maxPage}**`);
        embedPaginated.setTimestamp();
        embedPaginated.setFooter('Найкращий музичний бот. Спеціально для Неігри', interaction.member.avatarURL({ dynamic: true }));

        interaction.editReply({ embeds: [embedPaginated] });
    },
};