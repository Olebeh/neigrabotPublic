const { MessageEmbed, GuildMember } = require('discord.js')

module.exports = {
    name: 'filter',
    description: 'Вмикає фільтр для поточного треку',
    options: [
        {
            name: 'фільтр',
            type: 3,
            description: 'Сам фільтр, який потрібно ввімкнути. Введіть команду з поточним фільтром аби вимкнути його',
            required: true,
            choices: [
                {
                    name: 'bassboost',
                    value: 'bassboost',
                },
                {
                    name: 'earrape',
                    value: 'earrape',
                },
                {
                    name: '8D',
                    value: '8D',
                },
                {
                    name: 'nightcore',
                    value: 'nightcore'
                },
                {
                    name: 'reverse',
                    value: 'reverse',
                },
                {
                    name: 'vibrato',
                    value: 'vibrato'
                },
            ],
        },
    ],

    async execute(interaction, player, client) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const queue = player.getQueue(interaction.guild.id);

        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        const actualFilter = queue.getFiltersEnabled()[0];
        const filters = [];
        queue.getFiltersEnabled().map(x => filters.push(x));
        queue.getFiltersDisabled().map(x => filters.push(x));
        const selectedFilter = interaction.options.get('фільтр').value;
        const filter = filters.find((x) => x.toLowerCase() === selectedFilter.toLowerCase());

        const filtersUpdated = {};

        filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

        await queue.setFilters(filtersUpdated);

        const embedFilterSuccessful = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(`Фільтр ${filter} **${queue.getFiltersEnabled().includes(filter) ? 'завантажується...' : 'вимикається...'}**\n***Примітка:** чим довша музика, тим більше часу візьме завантаження*`)

        interaction.editReply({ embeds: [embedFilterSuccessful] });
    },
};