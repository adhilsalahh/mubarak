const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Create tables
const createTables = () => {
  const enquiriesTable = `
    CREATE TABLE IF NOT EXISTS enquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const categoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const productsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2),
      category_id INT,
      images JSON,
      specifications JSON,
      featured BOOLEAN DEFAULT FALSE,
      in_stock BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `;

  const galleryTable = `
    CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      image VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const projectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      images JSON,
      client_name VARCHAR(255),
      completion_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const adminTable = `
    CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

  db.query(enquiriesTable, (err) => {
    if (err) console.error('Error creating enquiries table:', err);
  });

  db.query(categoriesTable, (err) => {
    if (err) console.error('Error creating categories table:', err);
  });

  db.query(productsTable, (err) => {
    if (err) console.error('Error creating products table:', err);
  });

  db.query(galleryTable, (err) => {
    if (err) console.error('Error creating gallery table:', err);
  });

  db.query(projectsTable, (err) => {
    if (err) console.error('Error creating projects table:', err);
  });

  db.query(adminTable, (err) => {
    if (err) console.error('Error creating admin table:', err);
  });
};

createTables();

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes

// Contact form
app.post('/api/contact', (req, res) => {
  const { name, phone, message } = req.body;
  const sql = 'INSERT INTO enquiries (name, phone, message) VALUES (?, ?, ?)';
  db.query(sql, [name, phone, message], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Enquiry submitted successfully' });
    }
  });
});

// Get enquiries for admin
app.get('/api/enquiries', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM enquiries ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get gallery images
app.get('/api/gallery', (req, res) => {
  const sql = 'SELECT * FROM gallery ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Upload gallery image
app.post('/api/gallery', authenticateToken, upload.single('image'), (req, res) => {
  const image = req.file.filename;
  const sql = 'INSERT INTO gallery (image) VALUES (?)';
  db.query(sql, [image], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Image uploaded successfully' });
    }
  });
});

// Delete gallery image
app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM gallery WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Image deleted successfully' });
    }
  });
});

// Get dashboard stats
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const enquiriesSql = 'SELECT COUNT(*) as total FROM enquiries';
  const productsSql = 'SELECT COUNT(*) as total FROM products';
  const categoriesSql = 'SELECT COUNT(*) as total FROM categories';

  db.query(enquiriesSql, (err, enquiriesResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.query(productsSql, (err, productsResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      db.query(categoriesSql, (err, categoriesResult) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          totalEnquiries: enquiriesResult[0].total,
          totalProducts: productsResult[0].total,
          totalCategories: categoriesResult[0].total
        });
      });
    });
  });
});

// Categories API
app.get('/api/categories', (req, res) => {
  const sql = 'SELECT * FROM categories ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/categories', authenticateToken, upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? req.file.filename : null;
  const sql = 'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)';
  db.query(sql, [name, description, image], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Category created successfully', id: result.insertId });
    }
  });
});

// Products API
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
  const params = [];

  if (category) {
    sql += ' WHERE c.name = ?';
    params.push(category);
  }

  sql += ' ORDER BY p.created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(results[0]);
    }
  });
});

app.post('/api/products', authenticateToken, upload.array('images', 10), (req, res) => {
  const { name, description, price, category_id, specifications, featured, in_stock } = req.body;
  const images = req.files ? req.files.map(file => file.filename) : [];

  const sql = 'INSERT INTO products (name, description, price, category_id, images, specifications, featured, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, description, price, category_id, JSON.stringify(images), specifications, featured === 'true', in_stock === 'true'], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Product created successfully', id: result.insertId });
    }
  });
});

// Enhanced Gallery API
app.get('/api/gallery', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM gallery';
  const params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/gallery', authenticateToken, upload.single('image'), (req, res) => {
  const { title, category, description } = req.body;
  const image = req.file.filename;
  const sql = 'INSERT INTO gallery (title, image, category, description) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, image, category, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Image added to gallery successfully' });
    }
  });
});

// Projects API
app.get('/api/projects', (req, res) => {
  const sql = 'SELECT * FROM projects ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/projects', authenticateToken, upload.array('images', 10), (req, res) => {
  const { title, description, client_name, completion_date } = req.body;
  const images = req.files ? req.files.map(file => file.filename) : [];

  const sql = 'INSERT INTO projects (title, description, images, client_name, completion_date) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description, JSON.stringify(images), client_name, completion_date], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Project created successfully', id: result.insertId });
    }
  });
});

// Admin login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admin WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token });
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});