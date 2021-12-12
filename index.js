const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const {Player} = require('discord-player');

const client = new Client();
client.commands = new Discord.Collection();

const events = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

console.log(`🏂 Завантажую івенти...`);

for (const file of events) {
    const event = require(`./events/${file}`);
    console.log(`-> 🎄 Завантажено івент ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
};

console.log(`🏂 Завантажую команди...`)

fs.readdirSync('./commands/').forEach(dirs => {
    const commandFiles = fs.readdirSync(`./commands/${dirs}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${dirs}/${file}`);
      console.log(`-> 🎄 Завантажено команду ${command.name.toLowerCase()}`)
      client.commands.set(command.name, command);
      delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
    };
});

client.config = require(`./config`)
global.player = new Player(client, client.config.opt.discordPlayer);
require('./src/events');

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (message.content === '-deploy' && message.author.id === client.application?.owner?.id) {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        message.reply('абоба!');
      })
      .catch(err => {
        message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
        console.error(err);
      });
  }
});

  client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName);

    if (interaction.isCommand()) {

      await interaction.deferReply().catch(() => {});

    try {
      if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
        command.execute(interaction, client, global.player);
      } else {
        command.execute(interaction, client, global.player);
      }
    } catch (error) {
      console.error(error);
      interaction.followUp({ content: 'Помилка під час виконання команди!' });
        }
    }
});

module.exports = async (client, interaction) => {

  console.log(`Увідйено в клієнт ${client.user.username}\n-> Готовий включати музику та відкривати білети на ${client.guilds.cache.size} серверах`);
  console.log(`🎄 Веселого різдва!`)
  client.user.setActivity(client.config.app.playing);
};

client.login(client.config.app.token);