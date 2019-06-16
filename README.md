# electron_sample



>>>

## 自己紹介
![顔](myface.jpg)

>>>

- フロントエンドエンジニア4年ちょっと
- ゲーム会社で会員向けコンテンツのフロント開発業務
- html / css / js / python
- 好きなエディタはVScode
- ゲームが好き

>>>

## 話したいこと

>>>

Electronでツール開発するのが  
簡単でフロントエンドエンジニアでも  
開発できるからいいぞ　いいぞ  
という話をしたい

>>>

## electronって何
前々回位に紹介されていたそうなので簡単に

>>>

- GitHubが開発したオープンソースのソフトウェアフレームワーク（Wikiより）
- html + CSS + JS + node.jsでデスクトップアプリが簡単に開発できる
- windows/mac/linuxの開発が全て1つのコードで可能（1つのOSで全てのOSの開発ができるわけではない）

>>>

- node.jsで開発するがパッケージ化した後のアプリはnode.js未インストールでも使える
- レンダリングにはChromiumが使われている、Chromiumは内臓型なので各OSでも問題無く使える
- MITライセンス　実際安心
- メジャーなアプリ：VScode Atom(元はAtom-Shell) Discord slack

>>>

## 常駐先で作ってみた話
よくあるありきたりな機能ですが  
画像の透明度を操作してブラウザに重ねて  
デザインズレが無いか確認するツールを作成  
セキュリティ的に外で作られたものは少し怖かったので自作を決定  

>>>

そこそこ好評でした  
見せてみる　メインの機能は調べながらでも2時間くらいで実装できました

>>>

## 簡単な仕組み解説

>>>

### メインプロセスとレンダラープロセス

>>>

- メインプロセス  
node.jsを使ってウィンドウ自体を制御するプロセス  
ローカルのファイルを読み込んだりアプリ起動時ウィンドウのセットアップ、  
レンダラープロセスで使うhtmlファイルの指定  

>>>

- レンダラープロセス  
ウィンドウ（Chromium）の中身を制御するプロセス  
html/css/jsはこっちで使用する  

>>>

#### 注意
- レンダラーとメインは直接値の共有はできない  
IPC通信（プロセス間通信）を行う  

>>>

## ミニマムな導入
ここからはエンジニアライクな話  
紹介する内容はgithubで共有するのでサクサクいきます

>>>

### node.jsの導入
- windows
    - nodist ⇒ node.js(npm)
- mac
    - homebrew ⇒ nodebrew ⇒ node.js(npm)
- linux
    - n ⇒ node.js(npm)

>>>

### electronの導入
#### クイックスタートしたい場合
![クイックスタート](quickstart.png)
https://github.com/electron/electron-quick-start#user-content-to-use

>>>

#### 自力で入れたい場合
githubの共有用意しとくか QRコードと短縮URL
npm init -y
npm i -D electron
npm i -D electron-builder

>>>

### 内部ファイルの用意
- index.js
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

>>>

- render.html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>render</title>
    </head>
    <body>
        <p>Hello! Electron!</p>
    </body>
</html>

>>>

- package.json
scriptに
"dev": "electron ."
追加

>>>

・テスト起動
ターミナルで npm run dev
⇒Hello
以降render.htmlを編集したら アプリ内でctrl+Rすると更新できる

>>>

・パッケージのビルド
scriptに追加 -wがwin -mがmac
"build": "electron-builder -w",
"build": "electron-builder -m",
⇒インストール用のexeとかがdistに作成される
任意の場所に配置できるように書き出ししたかったら
"build": "electron-builder -w zip",
とする
詳しくは
https://h3poteto.hatenablog.com/entry/2018/04/14/234353

>>>

# デメリット
- Chromiumが丸々入っているのでインストーラーやzip書き出しのファイルサイズが大きい

>>>

- Chromiumが丸々入っているので（part2）メモリ消費量がネイティブアプリと比べると多い（4GB程度なら問題ないレベル）

>>>

- 各OSに対応したビルドをするのにそれぞれのOSが必要（mac⇒winはwineという拡張を使えば可能とのこと※用意がかなり面倒）

>>>

ファイル変換
画像処理（透過や合成）
チャットシステム
