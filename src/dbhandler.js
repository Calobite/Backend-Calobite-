const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',     // Host database kamu
    user: 'root',          // User database
    password: '',  // Password database
    database: 'calobite' // Nama database
});

module.exports = db;