const { MessageEmbed, GuildMember } = require('discord.js');
const maxVol = 200;

module.exports = {
    name: 'volume',
    description: 'Змінює гучність',
    options: [
      {
        name: 'гучність',
        type: 4,
        description: 'Гучність від 1 до 200',
        required: false,
      },
    ],

    execute(interaction, player) {

        const embedVoiceChannel = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

        const queue = player.getQueue(interaction.guild.id);
        
        const embedNothing = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Зараз нічого не відтворюється!`)

        if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

        if (interaction.options.get('гучність') == null) var vol = false;
        else vol = interaction.options.get('гучність').value

        const embedCurrentVolume = new MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setDescription(`Поточна гучність **${queue.volume}** з **${maxVol}**\n*Щоб змінити, введіть дійсне значення від **1** до **${maxVol}***`)

        if (!vol) return interaction.editReply({ embeds: [embedCurrentVolume] });

        const embedValueValue = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Значення, яке ви хочете встановити уже і так встановлено!`)

        if (queue.volume === vol) return interaction.editReply({ embeds: [embedValueValue] });

        const embedValueInvalid = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Вибране число не дійсне. Введіть дійсне число від **1** до **${maxVol}**`)

        if (vol < 0 || vol > maxVol) return interaction.editReply({ embeds: [embedValueInvalid] });

        const success = queue.setVolume(vol);

        const embedVolumeSet = new MessageEmbed()
        .setColor(success ? 'DARK_VIVID_PINK' : 'RED')
        .setDescription(success ? `❄️ Встановлено гучність **${vol}** з **${maxVol}**` : `Щось пішло не так`)

        return interaction.editReply({ embeds: [embedVolumeSet] });
    },
};