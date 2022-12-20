const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {});

const API = {
  window: {
    discordStart: (DISCORD_BOT_TOKEN) =>
      ipcRenderer.send("discordStart", DISCORD_BOT_TOKEN),
    discordStop: () => ipcRenderer.send("discordStop"),
    listServer: () => ipcRenderer.send("listServer"),
    listChannel: (serverID) => ipcRenderer.send("listChannel", serverID),
    sendMessage: (data) => ipcRenderer.send("sendMessage", data),
    changeGameActivity: (Activity) => ipcRenderer.send("changeGameActivity", Activity),
    changeBotName: (name) => ipcRenderer.send("changeBotName", name),
    changeBotStatus: (status) => ipcRenderer.send("changeBotStatus", status),
  },
};

ipcRenderer.on("discordResponse", (event, arg) => {
  const btnStartBot = document.querySelector("#StartBot");
  const btnStopBot = document.querySelector("#StopBot");
  const popup = document.createElement("div");
  btnStartBot.disabled = true;
  btnStopBot.disabled = true;
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
    document.querySelector("#started").innerHTML = "";

    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
      btnStopBot.disabled = true;
      btnStartBot.disabled = false;
    }, 3000);
  } else {
    popup.innerHTML = `<p>Logged in as ${arg}!</p>`;
    localStorage.setItem("start", "true");

    /////////////////////////// SECTION ///////////////////////////

    const botInfosSection = document.createElement("section");
    botInfosSection.id = "botInfos";
    botInfosSection.classList.add("hidden");
    document.querySelector("#started").appendChild(botInfosSection);

    const serverSection = document.createElement("section");
    serverSection.id = "serverSection";
    serverSection.classList.add("hidden");
    document.querySelector("#started").appendChild(serverSection);

    /////////////////////////// FIN SECTION ///////////////////////////

    const changeBotNameTitle = document.createElement("h3");
    changeBotNameTitle.innerHTML = "Change bot name";
    botInfosSection.appendChild(changeBotNameTitle);

    const changeBotName = document.createElement("input");
    changeBotName.type = "text";
    changeBotName.placeholder = "Enter bot name";
    const actualBotName = arg.split("#")[0];
    changeBotName.value = `${actualBotName}`;
    botInfosSection.appendChild(changeBotName);

    const changeBotNameBtn = document.createElement("button");
    changeBotNameBtn.classList.add("simple-btn");
    changeBotNameBtn.innerHTML = "Change bot name";
    botInfosSection.appendChild(changeBotNameBtn);
    changeBotNameBtn.addEventListener("click", () => {
      API.window.changeBotName(changeBotName.value);
    });

    const botGameActivityTitle = document.createElement("h3");
    botGameActivityTitle.innerHTML = "Bot Game Activity";
    botInfosSection.appendChild(botGameActivityTitle);
    
    const botGameActivity = document.createElement("input");
    botGameActivity.type = "text";
    botGameActivity.placeholder = "Enter bot Game Activity";
    botInfosSection.appendChild(botGameActivity);
    
    const changeGameActivity = document.createElement("button");
    changeGameActivity.classList.add("simple-btn");
    changeGameActivity.innerHTML = "Change bot Game Activity";
    botInfosSection.appendChild(changeGameActivity);
    changeGameActivity.addEventListener("click", () => {
      API.window.changeGameActivity(botGameActivity.value);
    });

    const changeBotStatusTitle = document.createElement("h3");
    changeBotStatusTitle.innerHTML = "Change bot status";
    botInfosSection.appendChild(changeBotStatusTitle);

    const changeBotStatus = document.createElement("select");
    botInfosSection.appendChild(changeBotStatus);
    
    const changeBotStatusOnline = document.createElement("option");
    changeBotStatusOnline.value = "online";
    changeBotStatusOnline.innerHTML = "Online";
    changeBotStatus.appendChild(changeBotStatusOnline);

    const changeBotStatusIdle = document.createElement("option");
    changeBotStatusIdle.value = "idle";
    changeBotStatusIdle.innerHTML = "Idle";
    changeBotStatus.appendChild(changeBotStatusIdle);

    const changeBotStatusDnd = document.createElement("option");
    changeBotStatusDnd.value = "dnd";
    changeBotStatusDnd.innerHTML = "Do not disturb";
    changeBotStatus.appendChild(changeBotStatusDnd);

    const changeBotStatusOffline = document.createElement("option");
    changeBotStatusOffline.value = "invisible";
    changeBotStatusOffline.innerHTML = "Offline";
    changeBotStatus.appendChild(changeBotStatusOffline);

    const changeBotStatusBtn = document.createElement("button");
    changeBotStatusBtn.classList.add("simple-btn");
    changeBotStatusBtn.innerHTML = "Change bot status";
    botInfosSection.appendChild(changeBotStatusBtn);
    changeBotStatusBtn.addEventListener("click", () => {
      API.window.changeBotStatus(changeBotStatus.value);
    });

    API.window.listServer();

    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
      btnStopBot.disabled = false;
      btnStartBot.disabled = true;
    }, 3000);

  }
});

ipcRenderer.on("changeBotName", (event, arg) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `<p>${arg}</p>`;
  document.body.appendChild(popup);
  document.querySelectorAll(".simple-btn").forEach((btn) => {
    btn.disabled = true;
  });
  setTimeout(() => {
    popup.remove();
    document.querySelectorAll(".simple-btn").forEach((btn) => {
      btn.disabled = false;
    });
  }, 3000);
});

ipcRenderer.on("changeGameActivity", (event, arg) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `<p>${arg}</p>`;
  document.body.appendChild(popup);
  document.querySelectorAll(".simple-btn").forEach((btn) => {
    btn.disabled = true;
  });
  setTimeout(() => {
    popup.remove();
    document.querySelectorAll(".simple-btn").forEach((btn) => {
      btn.disabled = false;
    });
  }, 3000);
});

ipcRenderer.on("changeBotStatus", (event, arg) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `<p>${arg}</p>`;
  document.body.appendChild(popup);
  document.querySelectorAll(".simple-btn").forEach((btn) => {
    btn.disabled = true;
  });
  setTimeout(() => {
    popup.remove();
    document.querySelectorAll(".simple-btn").forEach((btn) => {
      btn.disabled = false;
    });
  }, 3000);
});

ipcRenderer.on("listServer", (event, arg) => {
  const serverSection = document.querySelector("#serverSection");

  const title = document.createElement("h3");
  title.id = "serverTitle";
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
    localStorage.setItem("serverID", select.value);
    select.addEventListener("change", () => {
      document.querySelector("#channelSelect").remove();
      document.querySelector("#channelTitle").remove();
      localStorage.setItem("serverID", select.value);
      if (document.querySelector("#divChatSender")) {
        document.querySelector("#divChatSender").remove();
      }
      API.window.listChannel(select.value);
    });
  }

  API.window.listChannel(arg[0].id);
});

ipcRenderer.on("listChannel", (event, arg) => {
  const serverSection = document.querySelector("#serverSection");

  const title = document.createElement("h3");
  title.id = "channelTitle";
  const count = arg.length;
  title.innerHTML = `List of channels ( ${count} )`;
  serverSection.appendChild(title);

  if (count === 0) {
    const noServer = document.createElement("p");
    noServer.innerHTML = `You are not in any channel`;
    serverSection.appendChild(noServer);
  } else {
    const select = document.createElement("select");
    select.id = "channelSelect";
    for (let i = 0; i < count; i++) {
      select.innerHTML += `<option value="${arg[i].id}">${arg[i].name}</option>`;
    }
    localStorage.setItem("channelID", select.value);
    serverSection.appendChild(select);
    select.addEventListener("change", () => {
      localStorage.setItem("channelID", select.value);
    });

    if (
      localStorage.getItem("serverID") !== null &&
      localStorage.getItem("serverID") !== undefined &&
      localStorage.getItem("serverID") !== "" &&
      localStorage.getItem("channelID") !== null &&
      localStorage.getItem("channelID") !== undefined &&
      localStorage.getItem("channelID") !== ""
    ) {
      const divChatSender = document.createElement("div");
      divChatSender.id = "divChatSender";
      serverSection.appendChild(divChatSender);
      const chatInput = document.createElement("input");
      chatInput.id = "chatInput";
      chatInput.placeholder = "Enter your message";
      chatInput.type = "text";
      divChatSender.appendChild(chatInput);
      const chatSend = document.createElement("button");
      chatSend.classList.add("simple-btn");
      chatSend.id = "chatSend";
      chatSend.innerHTML = "Send";
      divChatSender.appendChild(chatSend);
      chatSend.addEventListener("click", () => {
        if (document.querySelector("#chatInput").value !== "" || document.querySelector("#chatInput").value !== null || document.querySelector("#chatInput").value !== undefined) {
          console.log(chatInput.value);
          API.window.sendMessage({
            message: chatInput.value,
            serverID: localStorage.getItem("serverID"),
            channelID: localStorage.getItem("channelID"),
          });
          chatInput.value = "";
          document.querySelector("#chatSend").disabled = true;
        }else{
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `<p>Please enter a message</p>`;
        document.body.appendChild(popup);
        setTimeout(() => {
          popup.remove();
        }, 3000);
        }
      });
    }
  }
});

ipcRenderer.on("sendMessage", (event, arg) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `<p>${arg}</p>`;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
    document.querySelector("#chatSend").disabled = false;
  }, 3000);
});

contextBridge.exposeInMainWorld("app", API);
