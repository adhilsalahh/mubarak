const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// SQLite database setup
const db = new sqlite3.Database('./mubarak_kitchen.db', (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

// Create tables
const createTables = () => {
  const enquiriesTable = `
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const categoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const productsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2),
      category_id INTEGER,
      image_url TEXT,
      specifications TEXT,
      in_stock BOOLEAN DEFAULT 1,
      featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `;

  const galleryTable = `
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const projectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      client_name TEXT,
      completion_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const adminTable = `
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.serialize(() => {
    db.run(enquiriesTable);
    db.run(categoriesTable);
    db.run(productsTable);
    db.run(galleryTable);
    db.run(projectsTable);
    db.run(adminTable, (err) => {
      if (!err) {
        // Create default admin user
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.run('INSERT OR IGNORE INTO admin (username, password) VALUES (?, ?)',
          ['admin', hashedPassword]);
      }
    });
  });
};

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API Routes

// Enquiries
app.post('/api/enquiries', (req, res) => {
  const { name, phone, message } = req.body;
  db.run('INSERT INTO enquiries (name, phone, message) VALUES (?, ?, ?)',
    [name, phone, message], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, message: 'Enquiry submitted successfully' });
    }
  });
});

app.get('/api/enquiries', (req, res) => {
  db.all('SELECT * FROM enquiries ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/categories', upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  db.run('INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
    [name, description, image_url], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, message: 'Category created successfully' });
    }
  });
});

// Products
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let query = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  let params = [];

  if (category && category !== 'all') {
    query += ' WHERE c.name = ?';
    params.push(category);
  }

  query += ' ORDER BY p.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get(`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
});

app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, description, price, category_id, specifications, in_stock, featured } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(`INSERT INTO products (name, description, price, category_id, image_url, specifications, in_stock, featured)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, price, category_id, image_url, specifications, in_stock ? 1 : 0, featured ? 1 : 0],
    function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, message: 'Product created successfully' });
    }
  });
});

// Gallery
app.get('/api/gallery', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM gallery';
  let params = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/gallery', upload.single('image'), (req, res) => {
  const { title, description, category } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  db.run('INSERT INTO gallery (title, description, image_url, category) VALUES (?, ?, ?, ?)',
    [title, description, image_url, category], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, message: 'Gallery item created successfully' });
    }
  });
});

// Projects
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/projects', upload.single('image'), (req, res) => {
  const { title, description, client_name, completion_date } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(`INSERT INTO projects (title, description, image_url, client_name, completion_date)
          VALUES (?, ?, ?, ?, ?)`,
    [title, description, image_url, client_name, completion_date], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, message: 'Project created successfully' });
    }
  });
});

// Admin authentication
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM admin WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, 'mubarak_kitchen_jwt_secret_2024');
      res.json({ token, message: 'Login successful' });
    });
  });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'mubarak_kitchen_jwt_secret_2024', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Protected routes
app.get('/api/admin/dashboard', verifyToken, (req, res) => {
  // Get dashboard stats
  const stats = {};

  db.get('SELECT COUNT(*) as total FROM enquiries', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.enquiries = result.total;

    db.get('SELECT COUNT(*) as total FROM products', (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.products = result.total;

      db.get('SELECT COUNT(*) as total FROM gallery', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.gallery = result.total;

        db.get('SELECT COUNT(*) as total FROM projects', (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.projects = result.total;

          res.json(stats);
        });
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Development server running on port ${PORT}`);
});