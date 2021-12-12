const { QueryType } = require('discord-player');
const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: 'radio',
    description: 'Включає радіо у голосовому каналі',
    options: [
        {
            name: 'радіостанція',
            type: 3,
            description: 'Вибір радіостанції',
            required: true,
            choices: [
                {
                name: 'christmas',
                value: `https://open.spotify.com/playlist/37i9dQZF1DX0Yxoavh5qJV?si=b61b1c3a24f84b79`,
                },
            ],
        },
    ],

    async execute(interaction, player) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const queue = await player.createQueue(interaction.guild, {
            leaveOnEnd: false,
            leaveOnEmptyCooldown: 30000,
            metadata: interaction.channel
        });

        let radio = interaction.options.get('радіостанція').value

        const res = await player.search(radio, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await player.deleteQueue(interaction.guild.id);
        }

        const embedPlaying = new MessageEmbed()
        .setColor(`DARK_VIVID_PINK`)
        .setDescription(`❄️ Підключено до радіостанції!`)

        await queue.clear()
        await queue.skip()
        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
        await queue.shuffle()
        interaction.editReply({ embeds: [embedPlaying] });
        if (!queue.playing) await queue.play();
    }
};