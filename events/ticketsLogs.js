module.exports = (client, type, guild, user) => {
    switch (type) {
        case 'newTicket': {
            return console.log(`${user.username} створив квиток на сервері ${guild.name}`);
        }

        case 'closeTicket': {
            return console.log(`${user.username} закрив квиток на сервері ${guild.name}`);
        }

        case 'reopenTicket': {
            return console.log(`${user.username} заново відкрив квиток на сервері ${guild.name}`);
        }

        case 'deleteTicket': {
            return console.log(`${user.username} видалив квиток на сервері ${guild.name}`);
        }

        case 'saveTicket': {
            return console.log(`${user.username} зберіг квиток з сервера ${guild.name}`);
        }
    }
};