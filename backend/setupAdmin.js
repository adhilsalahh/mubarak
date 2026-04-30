const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

const createAdmin = async () => {
  const username = 'admin';
  const password = 'password'; // Change this to a secure password
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO admin (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?';
  db.query(sql, [username, hashedPassword, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error creating admin:', err);
    } else {
      console.log('Admin user created/updated');
    }
    db.end();
  });
};

createAdmin();