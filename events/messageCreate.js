const { MessageEmbed } = require('discord.js')

module.exports = (client, message, interaction) => {

    if (message.author.bot || message.channel.type === 'dm') return;

    const prefix = client.config.app.px;

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    const DJ = client.config.opt.DJ;

    if (cmd && DJ.enabled && DJ.commands.includes(cmd.name)) {
        const roleDJ = message.guild.roles.cache.find(x => x.name === DJ.roleName);

        if (!message.member._roles.includes(roleDJ.id)) {

            const embedOnlyDJ = new MessageEmbed()
            .setColor('RED')
            .setDescription(`🎄 Ця команда доступна лише учасникам з ${DJ.roleName} роллю на сервері`)
            
            return message.channel.send({ embeds: [embedOnlyDJ] });
        }
    }

    if (cmd && cmd.voiceChannel) {

        const embedClientVCFalse = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Вам потрібно находитись у голосовому каналі!`)

        if (!message.member.voice.channel) return message.channel.send({ embeds: [embedClientVCFalse] });

        const embedDifferentVC = new MessageEmbed()
        .setColor('RED')
        .setDescription(`Ми находимося в різних голосових каналах!`)

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embeds: [embedDifferentVC] });
    }

    if (cmd) cmd.execute(interaction, player, client);
};