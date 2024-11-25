const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.MYSQL_HOST || '34.128.92.233',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '123calobite123',
  database: process.env.MYSQL_DATABASE || 'calobite',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
