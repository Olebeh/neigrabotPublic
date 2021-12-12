const { MessageEmbed, GuildMember } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'playnext',
    description: 'Додає трек в чергу примусово наступним',
    options: [
      {
        name: 'джерело',
        type: 3,
        description: 'Назва або посилання на трек',
        required: true,
      },
    ],

    async execute(interaction, player) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const res = await player.search(interaction.options.get('джерело').value, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });
        const embedNotFound = new MessageEmbed()
         .setColor(`RED`)
         .setDescription(`Нічого не знайдено!`)

        if (!res || !res.tracks.length) return interaction.editReply({ embeds: [embedNotFound] });

        const queue = await player.createQueue(interaction.guild, {
            leaveOnEnd: false,
            leaveOnEmptyCooldown: 30000,
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await player.deleteQueue(interaction.guild.id);
        }

        const embedLoading = new MessageEmbed()
        .setColor(`DARK_VIVID_PINK`)
        .setDescription(`Завантажую наступний ${res.playlist ? `плейлист` : `трек`}...`);

        await interaction.editReply({ embeds: [embedLoading] })

        queue.insert(res.tracks[0], 0)
        if (!queue.playing) await queue.play();
    },
};