const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {});

const API = {
  window: {
    discordStart: (DISCORD_BOT_TOKEN) =>
      ipcRenderer.send("discordStart", DISCORD_BOT_TOKEN),
    discordStop: () => ipcRenderer.send("discordStop"),
    listServer: () => ipcRenderer.send("listServer"),
    listChannel: (serverID) => ipcRenderer.send("listChannel", serverID),
  },
};

ipcRenderer.on("discordResponse", (event, arg) => {
  const btnStartBot = document.querySelector("#StartBot");
  const btnStopBot = document.querySelector("#StopBot");
  const popup = document.createElement("div");
  document.querySelectorAll("button").forEach((element) => {
    element.disabled = true;
  });
  popup.classList.add("popup");
  if (arg === "Please enter a valid token") {
    popup.innerHTML = `<p>${arg}</p>`;

    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
      btnStopBot.disabled = true;
      btnStartBot.disabled = false;
    }, 3000);
  } else if (arg === "Bot stopped") {
    popup.innerHTML = `<p>${arg}</p>`;
    localStorage.setItem("start", "false");
    document.querySelector("#serverSection").innerHTML = "";

    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
      btnStopBot.disabled = true;
      btnStartBot.disabled = false;
    }, 3000);
  } else {
    popup.innerHTML = `<p>Logged in as ${arg}!</p>`;
    localStorage.setItem("start", "true");
    API.window.listServer();

    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
      btnStopBot.disabled = false;
      btnStartBot.disabled = true;
    }, 3000);
  }
});

ipcRenderer.on("listServer", (event, arg) => {
  const serverSection = document.querySelector("#serverSection");

  const title = document.createElement("h3");
  const count = arg.length;
  title.innerHTML = `List of servers ( ${count} )`;
  serverSection.appendChild(title);

  if (count === 0) {
    const noServer = document.createElement("p");
    noServer.innerHTML = `You are not in any server`;
    serverSection.appendChild(noServer);
  } else {
    const select = document.createElement("select");
    for (let i = 0; i < count; i++) {
      select.innerHTML += `<option value="${arg[i].id}">${arg[i].name}</option>`;
    }
    serverSection.appendChild(select);
  }

  API.window.listChannel(arg[0].id);
});

ipcRenderer.on("listChannel", (event, arg) => {
  const serverSection = document.querySelector("#serverSection");

  const title = document.createElement("h3");
  const count = arg.length;
  title.innerHTML = `List of channels ( ${count} )`;
  serverSection.appendChild(title);

  if (count === 0) {
    const noServer = document.createElement("p");
    noServer.innerHTML = `You are not in any channel`;
    serverSection.appendChild(noServer);
  } else {
    const select = document.createElement("select");
    select.classList.add("select");
    for (let i = 0; i < count; i++) {
      select.innerHTML += `<option value="${arg[i].id}">${arg[i].name}</option>`;
    }
    serverSection.appendChild(select);
  }
});

contextBridge.exposeInMainWorld("app", API);
