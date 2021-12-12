const { MessageEmbed, GuildMember } = require('discord.js');
const Genius = require("genius-lyrics");
const Client = new Genius.Client(process.env.GENIUS_CLIENT_TOKEN);

module.exports = {
    name: 'lyrics',
    description: 'Якщо текст до треку буде в Інтернеті, бот вам його покаже',

    async execute(interaction, player, client) {

      const embedVoiceChannel = new MessageEmbed()
      .setColor(`RED`)
      .setDescription(`Ви повинні знаходитись в голосовому каналі!`)

      if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) return interaction.editReply({ embeds: [embedVoiceChannel] });

      const queue = player.getQueue(interaction.guild.id);

    const embedNoTracks = new MessageEmbed()
    .setColor(`RED`)
    .setDescription(`Поки що це остання пісня в черзі!`)

    if (!queue && !args[0]) return interaction.editReply({ embeds: [embedNoTracks] });

	  const tempterm = queue.current.title;
	  var searches;

	  if (tempterm.includes('('))
	  {
		var words = tempterm.split('(');
		words.pop();
		const searchterm = words[0];
		searches = await Client.songs.search(searchterm);
	  }
	  else
	  {
		searches = await Client.songs.search(tempterm);
	  }

	  if (searches) {

	  const firstSong = searches[0];
	  const lyrics = await firstSong.lyrics();

    const embed = new MessageEmbed()
    .setTitle(`Текст | ${queue.current.title} - ${interaction.guild.name}`)
    .setDescription(lyrics)
    .setColor('DARK_VIVID_PINK')
    .setAuthor(client.user.username, client.user.displayAvatarURL({ size: 1024, dynamic: true }))
    .setTimestamp()
    .setFooter('Найкращий музичний бот. Спеціально для Неігри', interaction.member.avatarURL({ dynamic: true }))

    interaction.editReply({ embeds: [embed] })
    } else {
      const embedNotFound = new MessageEmbed()
      .setColor(`RED`)
      .setDescription(`Не вдалось знайти тексту до цього треку!`)

      interaction.editReply({ embeds: [embedNotFound] });
    }
	},
}; 