# Про Groovus Abobus

Повністю робочий бот, який бездоганно грає музику і виконує деякі інші операції

Повністю безплатний і вільний для скачування

Якщо у вас є якісь проблеми з ботом (хотя, його й так ніхто не додасть, це закритий репозиторій, ну похуй), то звертайтесь [сюди](https://discord.gg/SPg9j7qtUZ) і відкривайте тікет.

*Якщо у вас немає ніяких навиків розробника, і ви навіть не розумієте як скачати файли, рекомендуємо звернутись за допомогою вище*

### 🛸 Можливості
- Грає музику з Spotify/YouTube/SoundCloud
- Можна зберігати пісні собі в приватні повідолмення
- Музика повністю без лагів
- 100% українська мова, ніяких платних функцій
- Ніяких преміумів
- Басбуст і можливість встановлювати гучність
І остальні базові команди
> Остальні команди можна глянути у папці `.\commands\`, вони розподілені по категоріям

### ⚡ Конфігурація

Вся конфігурація знаходиться в файлі `config.js`.

```js
const dotenv = require(`dotenv`);

dotenv.config();

module.exports = {
    app: {
        px: '-',
        token: process.env.DISCORD_CLIENT_TOKEN,
            playing: `-help | -ping`
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: 'DJ',
            commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'seek', 'shuffle', 'skip', 'stop', 'volume']
        },
        maxVol: 200,
        loopMessage: false,
        discordPlayer: {
          fetchBeforeQueued: true,
          ytdlOptions: {
            quality: 'lowest',
            filter: 'audioonly',
            highWaterMark: 1 << 30,
            dlChunkSize: 0
                    },
            },
    }}
;;
```

⚙️ Базова конфігурація

- `app/px`, префікс, який ви будете використовувати для команд бота
- `app/token`, потрібно вставляти у .env, а сам токен можна найти на порталі [Discord Developers](https://discordapp.com/developers/applications)
- `app/playing`, показує, що буще відображатись у статусі в бота

🎶 Діджей-конфігурація

- `opt/DJ/enabled`, включає/виключає режим діджея
- `opt/DJ/roleName`, назва ролі Діджея
- `opt/DJ/commands`, список команд, які зможе використовувати лише Діджей

💪 Продвинута конфігурація

- `opt/maxVol`, максимальна значення звуку, яке може бути встановлене командою `volume`
- `opt/loopMessage`, відповідає за відправлення повідолмень про те, що зараз грає музика під час режиму повторення
- `opt/discordPlayer`, остальна конфігурація, налаштувати яку можна знаючи бібліотеку `discord-player`

### 📑 Встановлення

Щоб використовувати бота, потрібно дещо мати...
**Покроково:**

1) Завантажте [FFmpeg](https://www.ffmpeg.org) для обробки звуку
2) Завантажте [Node JS](https://nodejs.org/en/) (v16) для працездатності взагальному
3) Завантажте [Git](https://git-scm.com/downloads) для того, щоб скачати проект і потім викладати його на хостинг
4) Перезавантажте комп'ютер
5) Відкрийте `cmd` і перейдіть в зручно директорію (не створюючи папки, вона сама створиться)
**Подальші кроки обов'язково повинні проводитись в `cmd` перейшовши в потрібну директорію**
6) Введіть
```sh
git clone https://github.com/Olebeh/neigrabot
npm i
```
7) Перейдіть в папку з файлами бота, знайдіть файл `.env.example`, перейменуйте в `.env`, відкрийте за допомогою блокнота, і вставте значення у всі потрібні поля

> Токен можна дістати в порталі [Discord Developers](https://discordapp.com/developers/applications), ID бота просто перейти в діскорд, клацнути пкм по боту, знизу Копіювати ID, а GENIUS_CLIENT_TOKEN потрібно зареєструватись [по посиланню](https://genius.com/api-clients), знизу натиснути на `Generate Access Token`, і ось ваш токен. Вставляти все **обов'язково з лапками**!

8) Знову перейшовши в `cmd` введіть
```sh
node .
```

Готово! Ваш бот запустився! Тепер ви можете виставляти його на хостинг. До речі, ось декілька варіантів:

[![Спробуй на Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/Olebeh/neigrabot)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![Захостити на Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Olebeh/neigrabot)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![Хость на Repl.it](https://repl.it/badge/github/Olebeh/neigrabot)](https://repl.it/github/Olebeh/neihtabot)

Зроблено [Олебехом](https://github.com/Olebeh)

Будь ласка, залишайте усі авторські підписи, не видавайте проект за свій

[Задонать дєняг і тоді можеш забирати авторські права](https://new.donatepay.ru/@896858)
