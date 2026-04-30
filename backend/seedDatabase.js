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

const seedDatabase = async () => {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('password', 10);
    await db.promise().query('INSERT IGNORE INTO admin (username, password) VALUES (?, ?)', ['admin', adminPassword]);
    console.log('Admin user created');

    // Insert categories
    const categories = [
      { name: 'Modular Kitchens', description: 'Complete modular kitchen solutions', image: 'modular-kitchen.jpg' },
      { name: 'Custom Cabinets', description: 'Bespoke cabinet designs', image: 'custom-cabinets.jpg' },
      { name: 'Kitchen Accessories', description: 'Essential kitchen accessories and tools', image: 'kitchen-accessories.jpg' },
      { name: 'Countertops', description: 'Premium countertop materials', image: 'countertops.jpg' },
      { name: 'Kitchen Appliances', description: 'Modern kitchen appliances', image: 'appliances.jpg' },
      { name: 'Storage Solutions', description: 'Smart storage systems', image: 'storage.jpg' }
    ];

    for (const category of categories) {
      await db.promise().query('INSERT IGNORE INTO categories (name, description, image) VALUES (?, ?, ?)',
        [category.name, category.description, category.image]);
    }
    console.log('Categories inserted');

    // Insert sample products
    const products = [
      {
        name: 'Luxury Modular Kitchen Set',
        description: 'Complete 6-piece modular kitchen with premium finishes',
        price: 25000.00,
        category_id: 1,
        images: JSON.stringify(['kitchen1.jpg', 'kitchen2.jpg']),
        specifications: JSON.stringify({ material: 'MDF with laminate', warranty: '5 years', dimensions: '3m x 2m' }),
        featured: true,
        in_stock: true
      },
      {
        name: 'Custom Wardrobe System',
        description: 'Tailored wardrobe with sliding doors and internal organizers',
        price: 15000.00,
        category_id: 2,
        images: JSON.stringify(['wardrobe1.jpg']),
        specifications: JSON.stringify({ material: 'Particle board', finish: 'Melamine', doors: 'Sliding' }),
        featured: true,
        in_stock: true
      },
      {
        name: 'Kitchen Utensil Organizer',
        description: 'Stainless steel utensil holder with magnetic strips',
        price: 500.00,
        category_id: 3,
        images: JSON.stringify(['utensil-organizer.jpg']),
        specifications: JSON.stringify({ material: 'Stainless steel', capacity: '20 utensils' }),
        featured: false,
        in_stock: true
      },
      {
        name: 'Granite Countertop',
        description: 'Premium black granite countertop with polished finish',
        price: 8000.00,
        category_id: 4,
        images: JSON.stringify(['granite-counter.jpg']),
        specifications: JSON.stringify({ material: 'Black granite', thickness: '2cm', finish: 'Polished' }),
        featured: true,
        in_stock: true
      },
      {
        name: 'Smart Refrigerator',
        description: 'Energy-efficient smart refrigerator with IoT connectivity',
        price: 12000.00,
        category_id: 5,
        images: JSON.stringify(['smart-fridge.jpg']),
        specifications: JSON.stringify({ capacity: '400L', energy_rating: 'A++', smart_features: 'WiFi, App control' }),
        featured: true,
        in_stock: true
      },
      {
        name: 'Pull-out Storage System',
        description: 'Space-saving pull-out drawers for maximum organization',
        price: 3000.00,
        category_id: 6,
        images: JSON.stringify(['pullout-storage.jpg']),
        specifications: JSON.stringify({ drawers: '4 levels', load_capacity: '50kg per drawer' }),
        featured: false,
        in_stock: true
      }
    ];

    for (const product of products) {
      await db.promise().query('INSERT IGNORE INTO products (name, description, price, category_id, images, specifications, featured, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.category_id, product.images, product.specifications, product.featured, product.in_stock]);
    }
    console.log('Products inserted');

    // Insert gallery images
    const galleryImages = [
      { title: 'Modern Kitchen Design', image: 'gallery1.jpg', category: 'Kitchens', description: 'Contemporary modular kitchen' },
      { title: 'Luxury Cabinetry', image: 'gallery2.jpg', category: 'Cabinets', description: 'Custom built-in cabinets' },
      { title: 'Kitchen Accessories', image: 'gallery3.jpg', category: 'Accessories', description: 'Premium kitchen tools' },
      { title: 'Granite Countertops', image: 'gallery4.jpg', category: 'Countertops', description: 'Natural stone surfaces' },
      { title: 'Smart Appliances', image: 'gallery5.jpg', category: 'Appliances', description: 'Modern kitchen technology' },
      { title: 'Storage Solutions', image: 'gallery6.jpg', category: 'Storage', description: 'Efficient organization systems' }
    ];

    for (const image of galleryImages) {
      await db.promise().query('INSERT IGNORE INTO gallery (title, image, category, description) VALUES (?, ?, ?, ?)',
        [image.title, image.image, image.category, image.description]);
    }
    console.log('Gallery images inserted');

    // Insert sample projects
    const projects = [
      {
        title: 'Luxury Villa Kitchen Renovation',
        description: 'Complete kitchen renovation for a 500sqm villa in Riyadh',
        images: JSON.stringify(['project1-1.jpg', 'project1-2.jpg']),
        client_name: 'Ahmed Al-Rashid',
        completion_date: '2024-03-15'
      },
      {
        title: 'Modern Apartment Kitchen',
        description: 'Compact yet functional kitchen design for downtown Jeddah apartment',
        images: JSON.stringify(['project2-1.jpg']),
        client_name: 'Sara Al-Mansouri',
        completion_date: '2024-02-28'
      }
    ];

    for (const project of projects) {
      await db.promise().query('INSERT IGNORE INTO projects (title, description, images, client_name, completion_date) VALUES (?, ?, ?, ?, ?)',
        [project.title, project.description, project.images, project.client_name, project.completion_date]);
    }
    console.log('Projects inserted');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    db.end();
  }
};

seedDatabase();