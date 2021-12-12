const { MessageEmbed } = require ('discord.js');

player.on('error', (queue, error) => {
    console.log(`Error emitted from the queue ${error.message}`);
});

player.on('connectionError', (queue, error) => {
    console.log(`Error emitted from the connection ${error.message}`);
});

player.on('trackStart', (queue, track) => {
    const embedTrackStart = new MessageEmbed()
    .setColor(`DARK_VIVID_PINK`)
    .setDescription(`❄️ Зараз грає [${queue.current.title}](${queue.current.url}) [${track.requestedBy}]`)
    queue.metadata.send({ embeds: [embedTrackStart] })
    .then(msg => {
        setTimeout(() => msg.delete(), 20000)
        })
});

player.on('trackAdd', (queue, track) => {
    const embedStartedPlay = new MessageEmbed()
    .setColor('DARK_VIVID_PINK')
    .setDescription(`☃️ Трек [${track.title}](${track.url}) доданий в чергу! [${track.requestedBy}]`)
    queue.metadata.send({ embeds: [embedStartedPlay] });
});

player.on('botDisconnect', (queue) => {
    const embedDisconnect = new MessageEmbed()
    .setColor('RED')
    .setDescription(`❄️ Від'єднано. Очищаю чергу...`)
    queue.metadata.send({ embeds: [embedDisconnect] });
});

player.on('channelEmpty', (queue) => {
    const embedAlone = new MessageEmbed()
    .setColor('RED')
    .setDescription(`Нікого немає в голосовому каналі. Виходжу та очищаю чергу...`)
    queue.metadata.send({ embeds: [embedAlone] });
});

player.on('queueEnd', (queue) => {
    const embedQueueEnd = new MessageEmbed()
    .setColor('DARK_VIVID_PINK')
    .setDescription(`❄️ Чергу завершено!`)
    queue.metadata.send({ embeds: [embedQueueEnd] });
});