const express = require('express')
const multer = require('multer')
const router = express.Router()
const { register, registrasi, login, auth, logout } = require('../controllers/auth.js')
const { getMarket, tambahJenis,bayar    , shop, hapusJenis, pilihBarang, hapusBarang, tambahBarang, tambahTransaksi, cancel, editJenis, transaksi } = require('../controllers/market.js')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })


router.get('/', getMarket)
router.get('/hapusJenis/:id_jenisBarang', hapusJenis)
router.post('/tambahJenisBarang', tambahJenis)
router.post('/editJenis/:id_jenisBarang', editJenis)
// 
router.get('/pilihBarang/:id_jenisBarang', pilihBarang)
router.get('/hapusBarang/:id_barang', hapusBarang)
router.post('/tambahBarang', upload.single("photo"), tambahBarang)
// 
router.post('/tambahTransaksi', tambahTransaksi);
router.post('/cancelTransaksi', cancel);
// 
router.get('/transaksi', transaksi)
router.get('/shop/:id_jenisBarang', shop)
// 
router.get('/register', register)
router.post('/registrasi', registrasi)
// 
router.get('/login',login)
// 
router.post('/auth',auth)
router.get('/getMarket', getMarket)
// 
router.post("/bayar",bayar)
router.get('/logout',logout)


module.exports = router