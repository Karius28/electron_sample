const electron = require('electron');

// ウィンドウが全て閉じたらアプリ終了
electron.app.on('window-all-closed', function() {
    // darwinはMacOS macの場合はいらないらしい
    if (process.platform !== 'darwin') {
        electron.app.quit();
    }
});

// electronが準備完了になったら
electron.app.on('ready', function() {
    // ブラウザ(Chromium)の起動, 初期画面のロード
    let mainWindow = new electron.BrowserWindow();
    // レンダラープロセスで使うhtmlファイルの読み込み
    mainWindow.loadURL('file://' + __dirname + '/render.html');
    // ウィンドウ閉じたときの処理
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});