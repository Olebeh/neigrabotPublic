module.exports = async (client) => {
    console.log(`Увідйено в клієнт ${client.user.username}\n-> Готовий включати музику та відкривати білети на ${client.guilds.cache.size} серверах`);
    console.log(`🎄 Веселого різдва!`)
    client.user.setActivity(client.config.app.playing);
};