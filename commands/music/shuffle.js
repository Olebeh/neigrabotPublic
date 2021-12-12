const { MessageEmbed, GuildMember } = require('discord.js')

module.exports = {
  name: 'shuffle',
  description: 'Перемішує усі треки в черзі',

  async execute(interaction, player) {

    const embedVoiceChannel = new MessageEmbed()
      .setColor(`RED`)
      .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

    const queue = player.getQueue(interaction.guild.id);

    const embedNothing = new MessageEmbed()
      .setColor('RED')
      .setDescription(`Зараз нічого не відтворюється!`)

    if (!queue || !queue.playing) return interaction.editReply({ embeds: [embedNothing] });

    const embedNotFound = new MessageEmbed()
      .setColor('RED')
      .setDescription(`Це єдиний трек в черзі!`)

    if (!queue.tracks[0]) return interaction.editReply({ embeds: [embedNotFound] });

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

    await queue.shuffle();

    const embedShuffleSuccess = new MessageEmbed()
      .setColor('DARK_VIVID_PINK')
      .setDescription(`Перемішано **${queue.tracks.length}** піс${pluralizeUkr(queue.tracks.length, 'ню', 'ні', 'ень')}!`)

    return interaction.editReply({ embeds: [embedShuffleSuccess] });
  },
};