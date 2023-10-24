// Saldo
let nominal = 500000000;
let saldo = nominal;

const formatSaldo = (saldo) => {
  return saldo.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};

document.getElementById("saldo").innerHTML = formatSaldo(saldo);

const bayar = (harga) => {
  if (confirm("Apakah yakin?")) {
    if (harga <= saldo) {
      saldo = saldo - harga;
      document.getElementById("saldo").innerHTML = formatSaldo(saldo);
    } else {
      alert("Saldo tidak mencukupi!");
    }
  }
};

function barang(id_barang, harga, stock) {
  const inputBarangId = document.getElementById("id_barang");
  inputBarangId.value = id_barang;
  const inputHarga = document.getElementById("hargaBarang");
  inputHarga.value = harga;
  const inputStock = (document.getElementById("Stock").value = stock);
}

function totalHarga() {
  const harga = document.getElementById("hargaBarang").value;
  const jumlahInput = document.getElementById("jumlah");
  const stock = document.getElementById("Stock").value;
  const jumlah = jumlahInput.value;

  if (jumlah > stock) {
    alert("Stock nya kurang ");
    jumlahInput.value = stock;
    document.getElementById("new_Stock").value =
      stock - jumlahInput.value;
    document.getElementById("total").value = harga * jumlahInput.value;
  } else {
    jumlahInput.value = stock;
    document.getElementById("new_Stock").value =
      stock - jumlahInput.value;
    document.getElementById("total").value = harga * jumlahInput.value;
  }

  // const stockBaru =document.getElementById("new_Stock").value;
  // const new_Stock = stock - jumlah;

  // if (jumlah > stock) {
  //   alert("Jumlah barang tidak boleh melebihi stok yang tersedia.");
  //   document.getElementById("jumlah").value = stock;
  // }

  // const seluruhHarga = harga * jumlah;

  // document.getElementById("total").value = seluruhHarga;
  // document.getElementById("new_Stock").value = Math.max(0, stockBaru);
}

function validasi_modal1() {
  const harga = document.getElementById("harga").value;
  const simpan = document.getElementById("simpan");
  const nama_barang = document.getElementById("nama_barang");
  if (nama_barang.value.length >= 3) {
    if (harga % 500 == 0) {
      if (harga.length >= 3) {
        alert("Harga Berhasil");
        simpan.style.display = "block";
      } else {
        alert("Isi harga Barang");
        simpan.style.display = "none";
      }
    }
  } else {
    alert("Isi nama Barang");
    simpan.style.display = "none";
  }
}
const cancel = (newStock, jumlah, id_barang, idtransaksi) => {
  console.log(newStock, jumlah, id_barang, idtransaksi);
  document.getElementById("barang_id2").value = id_barang;
  document.getElementById("id_transaksi").value = idtransaksi;
  document.getElementById("stockBaru").value = newStock = +jumlah;
};

const bayarAll = (saldo, harga, id, barang, id_transaksi, jumlah, stock) => {
  let total = saldo - harga;
  let t_stock = stock - jumlah
  document.getElementById('info').innerHTML = `Anda Membeli ${barang},dengan ${harga} dan saldo anda adalah ${saldo} , jika anda membeli barang tersebut , maka saldo anda menjadi ${total}`;
  document.getElementById("B_id_barang").value = id
  document.getElementById("B_id_transaksi").value = id_transaksi
  document.getElementById("u_saldo").value = total
  document.getElementById("BT_harga").value = harga
  document.getElementById("B_stock").value = t_stock
}