const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mubarak_kitchen.db', (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  if (err) {
    console.error('Error querying tables:', err);
  } else {
    console.log('Tables in database:');
    rows.forEach(row => {
      console.log('- ' + row.name);
    });
  }
  db.close();
});