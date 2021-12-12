const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'authors',
    description: 'Показує розробників (ну або розробника) бота',

    execute(interaction, client) {
        const embed = new MessageEmbed();
        embed.setColor('DARK_VIVID_PINK');
        embed.setAuthor(`Автори - ${interaction.guild.name}`, client.user.displayAvatarURL({ size: 1024, dynamic: true }));
        embed.setDescription(`Розробник: <@343030451453296642>\nGitHub репозиторій [тут](https://github.com/Olebeh/neigrabotPublic)\nЗапросити бота: \`/invite\``);
        embed.setTimestamp();
        embed.setFooter('Найкращий музичний бот. Спеціально для Неігри', interaction.member.avatarURL({ dynamic: true }));
        interaction.editReply({ embeds: [embed] });
    },
};
