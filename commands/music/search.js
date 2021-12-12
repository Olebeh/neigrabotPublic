const { MessageEmbed, GuildMember } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'search',
    description: 'Шукає десять треків за запитом, можна обрати один',
    options: [
      {
        name: 'запит',
        type: 3, // 'STRING' Type
        description: 'Назва треку',
        required: true,
      },
    ],

    async execute(interaction, player, client, message) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const args = interaction.options.get('запит').value

        const res = await player.search(args, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Нічого не знайдено!`)

        if (!res || !res.tracks.length) return interaction.editReply({ embeds: [embedNothing] });

        const queue = await player.createQueue(interaction.guild, {
            leaveOnEnd: false,
            leaveOnEmptyCooldown: 30000,
            metadata: interaction.channel
        });

        const embed = new MessageEmbed();

        embed.setColor('DARK_VIVID_PINK');
        embed.setAuthor(`☃️ Результати для ${args}`, client.user.displayAvatarURL({ size: 1024, dynamic: true }));

        const maxTracks = res.tracks.slice(0, 10);

        embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nВиберіть від **1** до **${maxTracks.length}** або **відмініть** (\`cancel\`)`);

        embed.setTimestamp();
        embed.setFooter('Найкращий музичний бот. Спеціально для Неігри', interaction.member.avatarURL({ dynamic: true }));

        interaction.editReply({ embeds: [embed] });

        const collector = interaction.channel.createMessageCollector({
            time: 10000,
            errors: ['time'],
            filter: interaction => interaction.member.id === interaction.member.id
        });

        collector.on('collect', async (query) => {

            const embedSearchCanceled = new MessageEmbed()
            .setColor('DARK_VIVID_PINK')
            .setDescription(`Пошук відмінено!`)

            if (query.content.toLowerCase() === 'cancel') return interaction.channel.messages.cache.get(query.id).reply({ embeds: [embedSearchCanceled] }) && collector.stop();

            let value = parseInt(query.content);

            const embedInvalidResponse = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Недійсна відповідь, виберіть між **1** і **${maxTracks.length}**`)

            if (value !== (1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 10)) return interaction.channel.messages.cache.get(query.id).reply({ embeds: [embedInvalidResponse] }) && collector.stop();

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {

                const embedCantConnect = new MessageEmbed()
                .setColor('RED')
                .setDescription(`Я не можу приєднатись до голосового каналу!`)

                await player.deleteQueue(interaction.guild.id);

                return interaction.folowUp({ embeds: [embedCantConnect] });
            }

            collector.stop();
            queue.addTrack(res.tracks[query.content - 1]);

            if (!queue.playing) await queue.play();
        });

        collector.on('end', (reason) => {

            const embedTimesUp = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Час на вибір завершено!`)

            if (reason === 'time') return interaction.followUp({ embeds: [embedTimesUp] });
        });
    },
};