const weather = require('weather-js');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'weather',
    description: 'Показує погоду у вибраному місті',
    options: [
      {
        name: 'місто',
        type: 3,
        description: 'Назва міста/регіону/штату. Залиште пустим щоб побачити Івано-Франківськ',
        required: false,
      },
    ],
    async execute(interaction) {
        if (interaction.options.get('місто') == null) var args = 'Ivano-Frankivsk';
        else args = interaction.options.get('місто').value

        weather.find({search: args, degreeType: 'C'}, function (error, result) {

        const embedInvalidLocation = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Невірна локація!`)

        if (result === undefined || result.length === 0) return interaction.editReply({ embeds: [embedInvalidLocation] });

        var current = result[0].current;
        var location = result[0].location;

        const weatherinfo = new Discord.MessageEmbed()
        weatherinfo.setDescription(`**${current.skytext}**`)
        weatherinfo.setAuthor(`Прогноз погоди в ${current.observationpoint}`)
        weatherinfo.setThumbnail(current.imageUrl)
        weatherinfo.setColor('DARK_VIVID_PINK')
        weatherinfo.addField('Часовий пояс', `UTC${location.timezone}`, true)
        weatherinfo.addField('Тип градусів', 'Цельсії', true)
        weatherinfo.addField('Температура', `${current.temperature}°`, true)
        weatherinfo.addField('Вітер', current.winddisplay, true)
        weatherinfo.addField('Відчувається як', `${current.feelslike}°`, true)
        weatherinfo.addField('Вологість', `${current.humidity}%`, true)
        weatherinfo.setFooter('Найкращий музичний бот. Спеціально для Неігри', interaction.member.avatarURL({ dynamic: true }))
        interaction.editReply({ embeds: [weatherinfo] })
        });
    },
};