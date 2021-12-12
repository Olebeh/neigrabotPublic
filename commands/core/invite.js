const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Дає вам посилання з запрошенням бота на свій сервер',

    execute(interaction, client) {
        const embed = new MessageEmbed();
        embed.setColor('DARK_VIVID_PINK');
        embed.setAuthor(`Запрошення - ${interaction.guild.name}`, client.user.displayAvatarURL({ size: 1024, dynamic: true }));
        embed.setDescription(`Щоб запросити бота на ваш сервер - [клацніть тут 🎄](https://aboba.com)\nОбов'язково введіть \`-deploy\` після додавання бота на сервер`);
        embed.setTimestamp();
        embed.setFooter('Найкращий музичний бот. Спеціально для Неігри', interaction.member.avatarURL({ dynamic: true }));
        interaction.editReply({ embeds: [embed] });
    },
};
