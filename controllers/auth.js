const db = require("../connect");
const bcrypt = require("bcrypt");

const login = (req, res) => {
  res.render("login", { clas: "", pesan: "" });
};

const register = (req, res) => {
  res.render("register", { clas: "", pesan: "" });
};

const registrasi = (req, res) => {
  const { username, password, pass_confirm } = req.body;
  const check = `SELECT * FROM user WHERE username = '${username}'`;
  db.query(check, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      return res.render("register", {
        clas: "danger",
        pesan: "username telah terdaftar, anda siapa",
      });
    }
    if (password != pass_confirm) {
      return res.render("register", {
        clas: "danger",
        pesan: "identitas anda beda ulululullu",
      });
    }
    bcrypt.hash(password, 10, (errorhash, hash) => {
      if (errorhash) throw error;
      const sql = `INSERT INTO user(username, password,token) VALUES ('${username}','${hash}','${token}')`;
      db.query(sql, (error, result) => {
        res.render("register", {
          clas: "success",
          pesan: "Registrasi Berhasil",
        });
      });
    });
    const min = 100000;
    const max = 999999;
    const token = Math.floor(Math.random() * (max - min + 1) + min);
  });
};

const auth = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.redirect("/login", {
      class: "danger",
      pesan: "password dan username tidak boleh kosong!",
    });
  }

  const query = `SELECt * FROM user WHERE username = '${username} '`;
  db.query(query, [username], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.render("Login", {
        pesan: "username tidak di temukan awekawek",
        clas: "danger",
        username: req.body.username,
      });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (hashError, hash) => {
      if (hashError) throw hashError;
      if (!hash) {
        res.render("login", {
          pesan: "password salah!",
          clas: "danger",
        });
      }
    });
    req.session.user = {
      id: user.id_user,
      username: user.username,
    };
    res.redirect("/getMarket");
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.render("login", { pesan: "anda telah logout", clas: "success" });
};

module.exports = { login, register, registrasi, auth, logout };