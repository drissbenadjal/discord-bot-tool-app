const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const { Client, Events, EmbedBuilder, SlashCommandBuilder, User } = require('discord.js');
let client = new Client({ intents: ['Guilds', 'GuildMessages', 'GuildPresences', 'MessageContent', 'GuildMembers'] });

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 400,
    minWidth: 400,
    maxWidth: 400,
    height: 560,
    minHeight: 560,
    maxHeight: 560,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.setMenuBarVisibility(false)
  win.loadFile('public/main/index.html')

  ipcMain.on('discordStart', (event, DISCORD_BOT_TOKEN) => {
    if (DISCORD_BOT_TOKEN === null) {
      win.webContents.send('discordResponse', 'Please enter a valid token');
      return;
    }else if (DISCORD_BOT_TOKEN === undefined) {
      win.webContents.send('discordResponse', 'Please enter a valid token');
      return;
    } else if (DISCORD_BOT_TOKEN === '') {
      win.webContents.send('discordResponse', 'Please enter a valid token');
      return;
    } else {
      client.login(DISCORD_BOT_TOKEN);
      //if the token is invalid, the bot will not start
      client.on(Events.ShardError, error => {
        win.webContents.send('discordResponse', 'Please enter a valid token');
        return;
      });
      
      client.on('ready', () => {
        win.webContents.send('discordResponse', client.user.tag);
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


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})