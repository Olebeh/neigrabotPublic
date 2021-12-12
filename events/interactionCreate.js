const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client, int, interaction, message) => {

    if (!int.isCommand()) {

    const req = int.customId.split('_')[0];

    client.emit('ticketsLogs', req, int.guild, int.member.user);

    switch (req) {
        case 'createTicket': {
            const selectMenu = new MessageSelectMenu();

            selectMenu.setCustomId('newTicket');
            selectMenu.setPlaceholder('Виберіть причину');
            selectMenu.addOptions([
                {
                    emoji: '☃️',
                    label: 'Суд',
                    description: 'Поскаржитись на якогось учасника',
                    value: 'newTicket_Суд'
                },
                {
                    emoji: '❄️',
                    label: 'Допомога',
                    description: 'Потрібна допомога',
                    value: 'newTicket_Помощь'
                },
                {
                    emoji: '🏂',
                    label: 'Інше',
                    description: 'Неозначена причина/немає в переліку',
                    value: 'newTicket'
                },
            ]);

            const row = new MessageActionRow().addComponents(selectMenu);

            return int.reply({ content: 'Яка причина репорту?', components: [row], ephemeral: true });
        }

        case 'newTicket': {
            const reason = int.values[0].split('_')[1];

            const channel = int.guild.channels.cache.find(x => x.name === `🎄︱квиток-${int.member.id}`); 
            if (!channel) {
                await int.guild.channels.create(`🎄︱квиток-${int.member.id}`, {
                    type: 'GUILD_TEXT',
                    topic: `Квиток відкрито користувачем ${int.member.user.username}${reason ? ` (${reason})` : ''} ${new Date(Date.now()).toLocaleString()}`,
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: int.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: '880863408029859911',
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: '902136621170819072',
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        }
                    ]
                });

                const channel = int.guild.channels.cache.find(x => x.name === `🎄︱квиток-${int.member.id}`);

                const ticketEmbed = new MessageEmbed();

                ticketEmbed.setColor('DARK_VIVID_PINK');
                ticketEmbed.setAuthor(`Квиток користувача ${int.member.user.username}, причина:${reason ? ` ${reason}` : ' немає'} ☃️`);
                ticketEmbed.setDescription('Щоб закрити квиток, натисніть на кнопку нижче');

                const closeButton = new MessageButton();

                closeButton.setStyle('DANGER');
                closeButton.setLabel('Закрити квиток');
                closeButton.setCustomId(`closeTicket_${int.member.id}`);

                const row = new MessageActionRow().addComponents(closeButton);
                
                await channel.send({ embeds: [ticketEmbed], components: [row] });

                if (reason === `Суд`)

                var questions = [
                    `Час порушення у форматі **MM.DD.YY, HH:MM**\n||(Наприклад: 12.31.60, 12:45)||`,
                    `Тепер вкажіть причину скарги`,
                    `Вкажіть порушника`,
                    `Вкажіть свідків (себе також)`,
                    `Додаткова інформація (скріншоти (тільки посиланням), текст, докази, тд)`
                ];

                const embedHello = new MessageEmbed()
                .setColor(`DARK_VIVID_PINK`)
                .setDescription(`Вирішили подати заявку в суд? Просто відповідайте на питання нижче\nВикористовуйте \`-\` щоб залишити поле пустим`)

                await channel.send({ embeds: [embedHello] })

                let counter = 0;

                const embedCollector = new MessageEmbed()
                .setColor(`DARK_VIVID_PINK`)
                .setDescription(questions[counter++]);

                const embedDone = new MessageEmbed()
                .setColor(`DARK_VIVID_PINK`)
                .setDescription(`Дякуюємо за репорт! Ваша анкета була надіслана суддям, очікуйте її підтвердження! Настисніть нище аби видалити квиток\nВеселого різдва! 🎄`)

                const filter = m => !m.author.bot

                const collector = channel.createMessageCollector({
                    max: questions.length,
                    time: 1000 * 300, // 300 секунд, 5 хв
                    errors: [`time`],
                    filter
                });

                let answers = [`aboba`]

                await channel.send({ embeds: [embedCollector] })
                collector.on(`collect`, async m => {
                    if (counter < questions.length) {
                        embedCollector.setDescription(questions[counter++])
                        answers.push(m.content)
                        await m.channel.send({ embeds: [embedCollector] })
                    }
                    else if (counter === questions.length) {
                        answers.push(m.content)
                        await m.channel.send({ embeds: [embedDone], components: [row] })
                    }
                });

                collector.on(`end`, async (collected, reason, m) => {
                    console.log(`Зібрано ${collected.size} повідомлень`)

                    const embedReport = new MessageEmbed()
                    .setColor(`DARK_VIVID_PINK`)
                    .setAuthor(`Новий репорт від користувача ${int.member.user.username}`)
                    .setDescription(`
                    Час порушення: **${answers[1] === (`-` || `undefined`) ? `**не задано**` : `${answers[1]}`}**
                    Причина: **${answers[2] === (`-` || `undefined`) ? `**не задано**` : `${answers[2]}`}**
                    Порушники: **${answers[3] === (`-` || `undefined`) ? `**не задано**` : `${answers[3]}`}**
                    Свідки: **${answers[4] === (`-` || `undefined`) ? `**не задано**` : `${answers[4]}`}**
                    Додаткова інформація: **${answers[5] === (`-` || `undefined`) ? `**не задано**` : `${answers[5]}`}**
                    `)

                    const embedTimesUp = new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`Час на відповідь завершився! (5 хв)`)
        
                    if (reason === 'time') await channel.send({ embeds: [embedTimesUp] });
                    else {
                        client.channels.cache.get('911004433960292372').send({ embeds: [embedReport] });
                        await client.channels.cache.get('911004433960292372').send(`<@&880863408029859911>`);
                    }
                });

                if (reason === `Помощь`)
                    await channel.send(`<@&901807255496839168>, <@&902136621170819072>`)

                return int.update({ content: `Квиток створено! <#${channel.id}> ✅`, components: [], ephemeral: true });
            } else {
                return int.update({ content: `Спершу закрийте старий квиток! <#${channel.id}> ❌`, components: [], ephemeral: true });
            }
        }

        case 'closeTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);
            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: int.customId.split('_')[1],
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: '880863408029859911',
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: '902136621170819072',
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('DARK_VIVID_PINK');
            ticketEmbed.setAuthor(`${int.member.user.username} закрив квиток`);
            ticketEmbed.setDescription('Щоб назавжди видалити цей квиток, натисніть на "Видалити квиток"');

            const reopenButton = new MessageButton();

            reopenButton.setStyle('SUCCESS');
            reopenButton.setLabel('Відкрити квиток заново');
            reopenButton.setCustomId(`reopenTicket_${int.customId.split('_')[1]}`);

            const saveButton = new MessageButton();

            saveButton.setStyle('SUCCESS');
            saveButton.setLabel('Зберегти квиток');
            saveButton.setCustomId(`saveTicket_${int.customId.split('_')[1]}`);

            const deleteButton = new MessageButton();

            deleteButton.setStyle('DANGER');
            deleteButton.setLabel('Видалити квиток');
            deleteButton.setCustomId('deleteTicket');

            const row = new MessageActionRow().addComponents(reopenButton, saveButton, deleteButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
        }

        case 'reopenTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);
            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: int.customId.split('_')[1],
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: '880863408029859911',
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: '902136621170819072',
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('DARK_VIVID_PINK');
            ticketEmbed.setAuthor(`Квиток був відкритий заново! ✅`);
            ticketEmbed.setDescription('Щоб закрити квиток, натисніть на кнопку нижче');

            const closeButton = new MessageButton();

            closeButton.setStyle('DANGER');
            closeButton.setLabel('Закрити квиток');
            closeButton.setCustomId(`closeTicket_${int.customId.split('_')[1]}`);

            const row = new MessageActionRow().addComponents(closeButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });

        }

        case 'deleteTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            return channel.delete();
        }

        case 'saveTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.messages.fetch().then(async msg => {
                let messages = msg.filter(msg => msg.author.bot !== true).map(m => {
                    const date = new Date(m.createdTimestamp).toLocaleString();
                    const user = `${m.author.tag}${m.author.id === int.customId.split('_')[1] ? ' (ticket creator)' : ''}`;

                    return `${date} - ${user} : ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`;
                }).reverse().join('\n');

                if (messages.length < 1) messages = 'Квиток не містить ніяких повідолмень. Дивно...';

                const ticketID = Date.now();

                const stream = await createWriteStream(`./data/${ticketID}.txt`);

                stream.once('open', () => {
                    stream.write(`Квиток користувача ${int.customId.split('_')[1]} (канал #${channel.name})\n\n`);
                    stream.write(`${messages}\n\nLogs ${new Date(ticketID).toLocaleString()}`);

                    stream.end();
                });

                stream.on('finish', () => int.reply({ files: [`./data/${ticketID}.txt`] }));
                });
            }
        }
    }   
};
