const fs = require("fs");
const { BrowserWindow, app, ipcMain } = require("electron");

class MyApp {
  constructor() {
    this.mainWindow = null;
    this.mainURL = `file://${__dirname}/index.html`;

    this.app = app;
    this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    this.app.on("ready", this.create.bind(this));
    this.app.on("activate", this.onActivated.bind(this));
  }

  onWindowAllClosed() {
    this.app.quit();
  }

  create() {
    // メインウインドウを作成
    this.mainWindow = new BrowserWindow({
      x: 0, // ウインドウの初期位置
      y: 0,
      width: 500, // ウインドウのサイズ
      height: 500,
      minWidth: 500, // ウインドウの最低サイズ
      minHeight: 500
    });
    // 最初に表示するファイルのURLを読み込む
    this.mainWindow.loadURL(this.mainURL);

    // IPC通信のイベントハンドラを登録する
    ipcMain.on("file-list-request", (event, directory) => {
      fs.readdir(directory, (_, files) => {
        // fs#readdir を使って、指定されたディレクトリの中にあるファイル一覧を取得して送信
        event.sender.send("file-list-response", files);
      });
    });

    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });
  }

  onReady() {
    this.create();
  }

  onActivated() {
    if (this.mainWindow === null) {
      this.create();
    }
  }
}

const myApp = new MyApp(app);
