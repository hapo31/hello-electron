const { ipcRenderer, remote } = require("electron");

const elem = document.getElementById("app");
const btn = document.getElementById("file");

ipcRenderer.on("file-read-response", (event, args) => {});

btn.onclick = () => {
  // Electron でファイル選択ダイアログを開くときのやり方
  const dirPath = remote.dialog.showOpenDialog(null, {
    properties: ["openDirectory"],
    title: "Select a directory",
    defaultPath: "."
  });

  // メインプロセスに、取得したディレクトリのパスをイベントとして送信
  ipcRenderer.send("file-list-request", dirPath[0]);
};

// IPC通信のイベントハンドラを登録する
ipcRenderer.on("file-list-response", (event, files) => {
  const ul = document.createElement("ul");
  for (const filePath of files) {
    const li = document.createElement("li");
    li.innerText = filePath;
    ul.appendChild(li);
  }

  elem.innerHTML = ul.innerHTML;
});
