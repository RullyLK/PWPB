var express = require("express");
var app = express()
const bodyparser = require('body-parser')
const port = 3000
var router = require("./routes/router")
var path = require('path');
// waktu periode (nyimpen data sementara)
const session = require("express-session");
const db = require("./connect");
// ketika login terdeteksi siapa saja yang login
const MySQLStore = require('express-mysql-session')(session);
// menjalankan req.body
app.use(bodyparser.json())
// menjalankan post
app.use(bodyparser.urlencoded({ extended: true }))

const sessionStore = new MySQLStore({
  expiration: 24 * 60 * 60 * 1000,
  clearExpired: true,
  createDatabaseTable: true,
}, db);

app.use(session({
  secret: 'secret-key',
  store: sessionStore
}))

app.set("view engine", "ejs");
app.set("views", "view");
// berfungsi untuk menggabungkan folder dgn folder public dan untuk mengakases folder public
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'Text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript')
    }
  }
}))

app.use(router);
app.listen(port, () => {
  console.log("server ini sudah berjalan");
});