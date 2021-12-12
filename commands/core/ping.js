const ms = require('ms');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: `Показує швідикість з'єднання з сервером`,

    execute(interaction, client) {

        const embedPing = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(`❄️ Пінг: **${client.ws.ping}мс**`)

        interaction.editReply({ embeds: [embedPing] });
    },
};