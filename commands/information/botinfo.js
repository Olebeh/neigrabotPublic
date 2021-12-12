const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'botinfo',
    description: 'Показує глобальну інформацію про бота',

    execute(interaction, client) {

        const embed = new MessageEmbed();
        embed.setTitle(`Статистика - ${client.user.username}`);
        embed.setDescription(`\`\`\`js\nКількість серверів: ${client.guilds.cache.size}\nКількість каналів: ${client.channels.cache.size}\nКількість користувачів: ${client.users.cache.size}\nВерсія Node: ${process.version}\nПінг: ${Math.round(client.ws.ping)} мс\`\`\``);
        embed.setColor(`DARK_VIVID_PINK`);
        embed.setFooter('Найкращий музичний бот. Спеціально для Неігри', interaction.member.avatarURL({ dynamic: true }));
        embed.setTimestamp();

        interaction.editReply({ embeds: [embed] });
    }
};