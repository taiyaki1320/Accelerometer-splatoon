// 双方向通信のためのサーバ側プログラム（Node.js で実行）
// 機能(A) https サーバの起動 ①
const ex = require("express"); // express モジュールを使う
const fs = require("fs"); // fs モジュールを使う
// アプリの諸設定
const app = ex(); // express でサーバアプリを作る
app.use(ex.static(__dirname)); // ドキュメントルートへのアクセス許可
app.get("/", (req, res) => { // アクセス要求があったら
res.sendFile(__dirname + "/index_end.html"); // クライアントにindex.html を送る
});
// https サーバを立てる
const opt = { // https のオプション設定
key: fs.readFileSync("../ssl/server.key"), // 秘密鍵ファイルを読み込む
cert: fs.readFileSync("../ssl/server.crt") // 証明書ファイルを読み込む
};
const svr = require("https").Server(opt, app); // https サーバを作成
svr.listen(443); // 443 番ポートへのアクセスを監視
console.log("サーバ起動成功!（終了はCtrl+C）"); // サーバ起動成功の表示
// 機能(B) 双方向通信の処理
const io = require("socket.io")(svr); // socket.io モジュールを使う ②
io.on("connection", (socket) => { // 接続(connection)があったら ③
console.log("ユーザが接続"); // ユーザ接続時の表示
// (B1) 送信者を含む全員向けの配信の処理
socket.on("all", (data) => { // all という名のsocket が届いたら ④
console.log("受信 (all)"); // 受信の表示
io.emit("msg_all", data); // msg_all という名で全員にdata 送信 ⑤
});
// (B2) 送信者以外への配信の処理
socket.on("others", (data) => { // others という名のsocket が届いたら ⑥
console.log("受信 (others)"); // 受信の表示
socket.broadcast.emit("msg_others", data); // msg_others という名で送信者以外にdata 送信 ⑦
});
});