const mysql = require('mysql')

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password :'',
    database :'market_pwpb'
}
)

db.connect(function(error){
    if (error) throw error;
    console.log('connect');
})

module.exports = db