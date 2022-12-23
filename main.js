const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path')
const { autoUpdater } = require("electron-updater");
require('update-electron-app')()
const { Client, Events, EmbedBuilder, SlashCommandBuilder, User, Partials } = require('discord.js');
let client = new Client({ intents: ['Guilds', 'GuildMessages', 'GuildPresences', 'MessageContent', 'GuildMembers', 'DirectMessages', 'DirectMessageTyping'], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

app.disableHardwareAcceleration();

async function createWindow() {
  app.whenReady().then(() => {
    const win = new BrowserWindow({
      width: 400,
      minWidth: 400,
      maxWidth: 400,
      height: 560,
      minHeight: 560,
      maxHeight: 560,
      resizable: false,
      // icon: path.join(__dirname, "./assets/images/DiscordLogo.ico"),
      icon: path.join(__dirname, "./assets/images/DiscordLogo.icns"),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    win.setMenuBarVisibility(false)
    win.loadFile('public/main/index.html')

    win.once("ready-to-show", () => {
      autoUpdater.checkForUpdatesAndNotify();
    });

    ipcMain.on("restart_app", () => {
      autoUpdater.quitAndInstall();
    });

    ipcMain.on('discordStart', (event, DISCORD_BOT_TOKEN) => {
      if (DISCORD_BOT_TOKEN === null) {
        win.webContents.send('discordResponse', 'Please enter a valid token');
        return;
      } else if (DISCORD_BOT_TOKEN === undefined) {
        win.webContents.send('discordResponse', 'Please enter a valid token');
        return;
      } else if (DISCORD_BOT_TOKEN === '') {
        win.webContents.send('discordResponse', 'Please enter a valid token');
        return;
      } else {

        client.login(DISCORD_BOT_TOKEN);

        client.on('error', (error) => {
          win.webContents.send('discordResponse', 'Invalid token');
        });

        client.on('ready', () => {
          win.webContents.send('discordResponse', client.user.tag);
          client.user.setStatus('online');

          //recuperer les messages privés
          client.on('messageCreate', (message) => {
            if (message.guild) return;
            if (message.author.bot) return;
            win.webContents.send('dmMessageCreate', {
              'message': message.content,
              'author': message.author.username,
              'authorId': message.author.id
            });
          });
        });

      }
    });

    ipcMain.on('discordStop', () => {
      client.destroy();
      client = new Client({ intents: ['Guilds', 'GuildMessages', 'GuildPresences', 'MessageContent', 'GuildMembers'] });
      win.webContents.send('discordResponse', 'Bot stopped');
      return
    });

    ipcMain.on('changeBotName', (event, data) => {
      client.user.setUsername(data);
      win.webContents.send('changeBotName', 'Bot name changed');
    });

    ipcMain.on('changeGameActivity', (event, data) => {
      client.user.setPresence({ activities: [{ name: data }] });
      win.webContents.send('changeGameActivity', 'Game activity changed');
    });

    ipcMain.on('changeBotStatus', (event, data) => {
      if (data === 'online') {
        client.user.setStatus('online');
        win.webContents.send('changeBotStatus', 'Bot status changed');
      } else if (data === 'idle') {
        client.user.setStatus('idle');
        win.webContents.send('changeBotStatus', 'Bot status changed');
      } else if (data === 'dnd') {
        client.user.setStatus('dnd');
        win.webContents.send('changeBotStatus', 'Bot status changed');
      } else if (data === 'invisible') {
        client.user.setStatus('invisible');
        win.webContents.send('changeBotStatus', 'Bot status changed');
      } else {
        win.webContents.send('changeBotStatus', 'Bot status not changed');
      }
    });

    ipcMain.on('listServer', () => {
      const listServer = () => {
        const server = [];
        client.guilds.cache.forEach((guild) => {
          server.push({
            "name": guild.name,
            "id": guild.id
          });
        });
        win.webContents.send('listServer', server);
      }
      listServer();
    });

    ipcMain.on('listChannel', (event, serverID) => {
      const listChannel = (serverID) => {
        const channelList = [];
        client.guilds.cache.get(serverID).channels.cache.filter(channel => channel.type === 0).forEach((channel) => {
          channelList.push({
            "name": channel.name,
            "id": channel.id
          });
        });
        win.webContents.send('listChannel', channelList);
      }
      listChannel(serverID);
    });

    ipcMain.on('sendMessage', (event, data) => {
      const sendMessage = (data) => {
        client.guilds.cache.get(data.serverID).channels.cache.get(data.channelID).send(data.message);
      }
      sendMessage(data);
      win.webContents.send('sendMessage', 'Message sent');
    });

    ipcMain.on('sendDM', (event, data) => {
      client.users.cache.get(data.id).send(data.message);
      win.webContents.send('sendDM', 'DM sent');
    });

    autoUpdater.on("update-available", () => {
      win.webContents.send("update_available");
    });
    autoUpdater.on("update-downloaded", () => {
      win.webContents.send("update_downloaded");
    });
  });
}
createWindow();

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})