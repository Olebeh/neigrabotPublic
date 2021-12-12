const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'setup',
    description: 'ВИкористовується для створення повідолмення про відкриття квитківю. Використання неможливе',

    execute(interaction) {

        embedNoPermissions = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні мати дозвіл **керувати сервером** для виконання цієї команди! [${message.author}]`)

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.editReply({ embeds: [embedNoPermissions] })

        embedIdeshNafig = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`${interaction.member} іде нахуй 🎄`)

        if (interaction.member.id !== `343030451453296642`) return interaction.editReply({ embeds: [embedIdeshNafig] })
        else if (interaction.guild.id !== `731886399892226070`) return interaction.editReply({ embeds: [embedIdeshNafig] })

        const setupEmbed = new MessageEmbed();

        setupEmbed.setColor('DARK_VIVID_PINK');
        setupEmbed.setAuthor('☃️ Система квитків\nЩоб створити новий квиток, натисніть на кнопку нижче');
        setupEmbed.setDescription('Буде створено новий канал, де ви зможете спілкуватись з потрібними людьми!');

        const ticketButton = new MessageButton();

        ticketButton.setEmoji('🔓');
        ticketButton.setStyle('SUCCESS');
        ticketButton.setLabel('🎄 Відкрити репорт');
        ticketButton.setCustomId('createTicket');

        const row = new MessageActionRow().addComponents(ticketButton);

        interaction.editReply({ embeds: [setupEmbed], components: [row] });
    },
};