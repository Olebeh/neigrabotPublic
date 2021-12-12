const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'clean',
    description: 'Очищає певну кількість повідолмень',
    options: [
      {
        name: 'кількість',
        type: 4,
        description: 'Кількість повідомлень для видалення (максимум 99)',
        required: true,
      },
    ],

    async execute(interaction, client) {

        const embedNoPerms = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Не достатньо прав для використання команди!`);

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return interaction.editReply({ embeds: [embedNoPerms] })
        };

        const embedInvalid = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Введіть дійсне число від 1 до 99`)

        const args = interaction.options.get('кількість').value

        if (!args || args <= 0 || args >= 100) return interaction.editReply({ embeds: [embedInvalid] })

        const amount = args;

        function pluralizeUkr(number, one, two, five) {
            let n = Math.abs(number);
            n %= 100;
            if (n >= 5 && n <= 20) {
              return five;
            }
            n %= 10;
            if (n === 1) {
              return one;
            }
            if (n >= 2 && n <= 4) {
              return two;
            }
            return five;
          }

        const embedSuccessful = new MessageEmbed()
        .setColor(`DARK_VIVID_PINK`)
        .setDescription(`❄️ Успішно видалено ${amount} повідомлен${pluralizeUkr(amount, `ня`, `ня`, `ь`)}\n***Повідолмення старші 14-ти днів не можуть бути видаленими***`)
        if (amount === 99) interaction.channel.bulkDelete(amount, true);
        else interaction.channel.bulkDelete(amount + 1, true);
        await interaction.channel.send({ embeds: [embedSuccessful] }).then(msg => {setTimeout(() => msg.delete().catch(e => console.log(`Повідолмення, яке я мав видалити щезло само (${e})`)), 5000)
        });
    }
};