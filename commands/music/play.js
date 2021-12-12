const { MessageEmbed, GuildMember } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'play',
    description: 'Грає трек у голосовому каналі!',
    options: [
      {
        name: 'джерело',
        type: 3, // 'STRING' Type
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
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });
        const embedNotFound = new MessageEmbed()
         .setColor('RED')
         .setDescription(`Нічого не знайдено! [${interaction.user}]`)

        if (!res || !res.tracks.length) return void interaction.editReply({ embeds: [embedNotFound] });

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
        .setDescription(`Завантажую ${res.playlist ? `плейлист` : `трек`}...`);

        await interaction.editReply({ embeds: [embedLoading] })

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
    },
};