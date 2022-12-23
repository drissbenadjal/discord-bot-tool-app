localStorage.setItem('start', 'false');

if (localStorage.getItem('DISCORD_BOT_TOKEN') !== null) {
    document.querySelector('#botToken').value = localStorage.getItem('DISCORD_BOT_TOKEN');
}

const btnStartBot = document.querySelector('#StartBot');
const btnStopBot = document.querySelector('#StopBot');
btnStopBot.disabled = true;
const DISCORD_BOT_TOKEN = document.querySelector('#botToken');
btnStartBot.addEventListener('click', () => {
    btnStartBot.disabled = true;
    localStorage.setItem('DISCORD_BOT_TOKEN', DISCORD_BOT_TOKEN.value);
    app.window.discordStart(DISCORD_BOT_TOKEN.value);
});
btnStopBot.addEventListener('click', () => {
    app.window.discordStop();
});

setInterval(() => {
    if (localStorage.getItem('start') === 'true') {
        document.querySelectorAll('.hidden').forEach((element) => {
            element.classList.remove('hidden');
        });
    } else {
        document.querySelectorAll('#started section').forEach((element) => {
            element.classList.add('hidden');
        });
    }
}, 1);

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
    }
});

const githubLink = document.querySelectorAll("#githubLink");
githubLink.forEach((element) => {
    console.log(element)
    element.addEventListener('click', () => {
        app.window.openGithubLink();
    });
});