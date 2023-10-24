const { json } = require("body-parser");
const db = require("../connect");

// ngambil barang dari table jenisbarang
const getMarket = (req, res) => {
  const mainSql = "SELECT * FROM jenisbarang";

  if (req.session.user) {
    const userSql = `SELECT * from user WHERE username = '${req.session.user.username}'`;
    db.query(userSql, (error, result) => {
      if (error) throw error;
      const user = result[0];
      console.log(user);
      const saldo = (rupiah) => {
        return rupiah.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        })
      }
      db.query(mainSql, (error, result) => {
        if (error) throw error;
        const jenisBarang = JSON.parse(JSON.stringify(result));
        res.render('jenisBarang', { jenisBarang, user, saldo });
      });
    });
  } else {
    db.query(mainSql, (error, result) => {
      if (error) throw error;
      const jenisBarang = JSON.parse(JSON.stringify(result));
      res.render('jenisbarang', { jenisBarang, user: '' });
    });
  }
};


// nambahin jenisBarang ke tabel jenisbarang
const tambahJenis = (req, res) => {
  const sql = `INSERT INTO jenisbarang (jenisBarang) VALUES ('${req.body.JenisBarang}' )`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("/");
  });
};

// hapus jenisbarang berdasarkan id_jenisBarang
const hapusJenis = (req, res) => {
  const id = req.params.id_jenisBarang;
  // where itu buat filterisasi 
  const sql = 'DELETE FROM jenisbarang WHERE id_jenisBarang = ? ';
  db.query(sql, id, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};

// Edit Jenis
const editJenis = (req, res) => {
  const sql = `UPDATE jenisBarang SET jenisBarang =' ${req.body.jenis}' WHERE id_jenisBarang = ${req.body.id_jenis} `
  db.query(sql, id, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
}

const pilihBarang = (req, res) => {
  const id = req.params.id_jenisBarang;
  const sql = `SELECT * FROM barang WHERE id_jenisBarang = ${id}`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    const barang = JSON.parse(JSON.stringify(result));

    const uang = (rupiah) => {
      return rupiah.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      });
    };

    if (req.session.user) {
      const userSql = `SELECT * from user WHERE username = '${req.session.user.username}'`;
      db.query(userSql, (error, result) => {
        if (error) throw error;
        const user = result[0];
        const sql2 = `SELECT * FROM transaksi 
        JOIN barang ON transaksi.id_barang = barang.id_barang WHERE status = 0 AND id_user = ${req.session.user.id}`;
        db.query(sql2, (error, result2) => {
          const transaksi = result2
          const sql3 = `SELECT * FROM transaksi 
          JOIN barang ON transaksi.id_barang = barang.id_barang WHERE status = 0 AND id_user = ${req.session.user.id}`;
          db.query(sql3, (error, result3) => {
            if (error) {
              throw error
            }
            total = result3
            console.log(user);
            res.render("pilihBarang", { jenis: barang, id_jenisBarang: id, uang, user, transaksi });
          })
        })
      });
    } else {
      res.render("pilihBarang", { jenis: barang, id_jenisBarang: id, uang, user: '', transaksi });
    }
  });
};


const tambahBarang = (req, res) => {
  const image = req.file ? req.file.filename : null
  const { id_jenisBarang, nama_barang, harga, stock, new_stock } = req.body;
  // nambahin di table barang nya   image
  const sql = `INSERT INTO barang (id_jenisBarang, nama_barang, harga, stock, new_stock,image) VALUES (?, ?, ?, ?, ?,?)`;
  db.query(sql, [id_jenisBarang, nama_barang, harga, stock, new_stock, image], (error, result) => {
    if (error) throw error
    res.redirect(`/pilihBarang/${id_jenisBarang}`);
  });
};

const hapusBarang = (req, res) => {
  const id = req.params.id_barang;
  const disableForeignKeySQL = 'SET FOREIGN_KEY_CHECKS=0';
  db.query(disableForeignKeySQL, (error, result) => {
    if (error) throw error;
    const deleteBarangSQL = 'DELETE FROM barang WHERE id_barang = ?';
    db.query(deleteBarangSQL, id, (error, result) => {
      if (error) throw error;
      const enableForeignKeySQL = 'SET FOREIGN_KEY_CHECKS=1';
      db.query(enableForeignKeySQL, (error, result) => {
        if (error) throw error;
        res.redirect("back");
      });
    });
  });
};


const tambahTransaksi = (req, res) => {
  if (!req.session.user) {
    return res.render('login', {
      pesan: 'Login Dulu',
      clas: 'danger',
      username: ''
    })
  } else {
    const jumlah = req.body.jumlah
    const total = req.body.total
    const sql = `INSERT INTO transaksi(id_barang ,jumlah,total_harga,status,id_user) VALUES ('${req.body.id_barang}','${jumlah}','${total}','0','${req.session.user.id}')`
    db.query(sql, (error, result) => {
      if (error) throw error;
      const sql2 = `UPDATE barang SET new_stock = ${req.body.new_Stock} WHERE id_barang =  ${req.body.id_barang}`
      db.query(sql2, (error, result) => {
        if (error) throw error;
        res.redirect('back')
      })
    })
  }
}

const cancel = (req, res) => {
  const { stockBaru, barang_id2, id_transaksi } = req.body;
  const updateSql = 'UPDATE barang SET new_stock = ? WHERE id_barang = ?';
  db.query(updateSql, [stockBaru, barang_id2], () => {
    const deleteSql = 'DELETE FROM transaksi WHERE id_transaksi = ?';
    db.query(deleteSql, [id_transaksi], () => {
      res.redirect('back');
    });
  });
};

const transaksi = (req, res) => {
  if (req.session.user) {
    const sql2 = `SELECT * FROM transaksi 
  JOIN barang ON transaksi.id_barang = barang.id_barang WHERE status = 0 AND id_user = ${req.session.user.id}`
    db.query(sql2, (error, result) => {
      const id = req.params.id_jenisBarang
      const transaksi = JSON.parse(JSON.stringify(result));
      // jumlahin total_harga dari tabel transaksi
      const sql3 = `SELECT SUM(total_harga) AS 'total_harga' FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang  WHERE status = 0 AND id_user = ${req.session.user.id}`;
      db.query(sql3, (error, result) => {
        const totalHarga = `SELECT total_harga FROM transaksi;`
        const total = JSON.parse(JSON.stringify(result))
        const uang = (rupiah) => {
          // mengubah data currency ke bentuk IDR
          return rupiah.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          })
        }
        res.render("transaksi", { id_jenisBarang: id, transaksi, total, uang, totalHarga });
      })
    });
  }
  else {
    res.redirect('back')
  }
}
const shop = (req, res) => {
  const id = req.params.id_jenisBarang
  // pilih semua yang di barang berdasarkan id_jenisBarang
  const sql = `SELECT * FROM barang WHERE id_jenisBarang = ${id}`;
  db.query(sql, (error, result) => {
    // json.parse = itu ngubah objek ke bentuk json lalu kembali menjadi objek 
    const barang = JSON.parse(JSON.stringify(result));
    if (error) throw error;
    // gabungin tabel dari transaksi ke tabel barang yang nyatuin nya itu si id_barang
    const uang = (rupiah) => {
      // mengubah data currency ke bentuk IDR
      return rupiah.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      })
    }
    res.render("shop", { jenis: barang, id_jenisBarang: id, uang });
  })
}

const bayar = (req, res) => {
  if (req.session.user) {
    const sql = `UPDATE user SET saldo = '${req.body.u_saldo} WHERE id_user = ${req.session.user.id}`
    db.query(sql, (error, result) => {
      if (error) throw error
      res.redirect('back')
      const sql2 = `UPDATE transaksi AS t INNER JOIN barang AS b ON t.id_barang = b.id_barang SET t.status ='1',b.stock = ${req.body.B_stock} WHERE
    tambahBarang.id_transaksi = ${req.body.B_id_transaksi} `
      db.query(sql2, (error, result) => {
        if (error) throw error
      })
    })
  }
}
module.exports = { getMarket, shop, tambahJenis, hapusJenis, pilihBarang, hapusBarang, tambahBarang, tambahTransaksi, cancel, editJenis, transaksi,bayar };