const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./mubarak_kitchen.db', (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to SQLite database for seeding');
});

// Seed data
const categories = [
  {
    name: 'Modular Kitchens',
    description: 'Complete modular kitchen solutions with customizable cabinets and appliances',
    image_url: '/uploads/placeholder-kitchen.jpg'
  },
  {
    name: 'Custom Cabinets',
    description: 'Bespoke cabinetry designed to fit your space and style perfectly',
    image_url: '/uploads/placeholder-cabinets.jpg'
  },
  {
    name: 'Kitchen Accessories',
    description: 'Essential accessories to complete your kitchen setup',
    image_url: '/uploads/placeholder-accessories.jpg'
  },
  {
    name: 'Countertops',
    description: 'Premium countertops in various materials and finishes',
    image_url: '/uploads/placeholder-countertops.jpg'
  },
  {
    name: 'Kitchen Appliances',
    description: 'High-quality appliances for modern kitchen functionality',
    image_url: '/uploads/placeholder-appliances.jpg'
  },
  {
    name: 'Storage Solutions',
    description: 'Smart storage solutions to maximize your kitchen space',
    image_url: '/uploads/placeholder-storage.jpg'
  }
];

const products = [
  {
    name: 'Premium Modular Kitchen Set',
    description: 'Complete 10x8 ft modular kitchen with island and premium finishes',
    price: 250000,
    category_id: 1,
    image_url: '/uploads/placeholder-kitchen.jpg',
    specifications: 'Size: 10x8 ft, Material: Marine Ply, Finish: Laminate, Warranty: 10 years',
    in_stock: 1,
    featured: 1
  },
  {
    name: 'Corner Cabinet System',
    description: 'Space-saving corner cabinet with pull-out drawers and lazy Susan',
    price: 45000,
    category_id: 2,
    image_url: '/uploads/placeholder-cabinets.jpg',
    specifications: 'Dimensions: 2x2x6 ft, Material: MDF, Finish: Melamine, Capacity: 50kg',
    in_stock: 1,
    featured: 0
  },
  {
    name: 'Stainless Steel Sink Set',
    description: 'Professional grade stainless steel sink with accessories',
    price: 15000,
    category_id: 3,
    image_url: '/uploads/placeholder-accessories.jpg',
    specifications: 'Size: 24x18 inch, Material: 304 Stainless Steel, Drain: 3.5 inch',
    in_stock: 1,
    featured: 0
  },
  {
    name: 'Granite Countertop',
    description: 'Premium black granite countertop with polished finish',
    price: 80000,
    category_id: 4,
    image_url: '/uploads/placeholder-countertops.jpg',
    specifications: 'Thickness: 20mm, Finish: Polished, Edge: Beveled, Warranty: 5 years',
    in_stock: 1,
    featured: 1
  },
  {
    name: 'Built-in Microwave Oven',
    description: 'Convection microwave with grill function and digital controls',
    price: 25000,
    category_id: 5,
    image_url: '/uploads/placeholder-appliances.jpg',
    specifications: 'Power: 900W, Capacity: 25L, Functions: Convection + Grill, Warranty: 2 years',
    in_stock: 1,
    featured: 0
  },
  {
    name: 'Pull-out Storage System',
    description: 'Multi-level pull-out drawers for maximum storage efficiency',
    price: 35000,
    category_id: 6,
    image_url: '/uploads/placeholder-storage.jpg',
    specifications: 'Levels: 3, Load Capacity: 30kg each, Material: Steel, Finish: Chrome',
    in_stock: 1,
    featured: 0
  }
];

const gallery = [
  {
    title: 'Modern Kitchen Design',
    description: 'Contemporary modular kitchen with sleek white cabinets and island',
    image_url: '/uploads/placeholder-gallery1.jpg',
    category: 'Modular Kitchens'
  },
  {
    title: 'Luxury Kitchen Setup',
    description: 'High-end kitchen with premium appliances and granite countertops',
    image_url: '/uploads/placeholder-gallery2.jpg',
    category: 'Luxury Kitchens'
  },
  {
    title: 'Compact Kitchen Solution',
    description: 'Space-efficient kitchen design for urban apartments',
    image_url: '/uploads/placeholder-gallery3.jpg',
    category: 'Compact Kitchens'
  },
  {
    title: 'Traditional Kitchen Style',
    description: 'Classic wooden kitchen with warm finishes and traditional elements',
    image_url: '/uploads/placeholder-gallery4.jpg',
    category: 'Traditional Kitchens'
  },
  {
    title: 'Industrial Kitchen Design',
    description: 'Modern industrial style with stainless steel and concrete elements',
    image_url: '/uploads/placeholder-gallery5.jpg',
    category: 'Industrial Kitchens'
  },
  {
    title: 'Open Kitchen Layout',
    description: 'Open-concept kitchen seamlessly integrated with living space',
    image_url: '/uploads/placeholder-gallery6.jpg',
    category: 'Open Layout'
  }
];

const projects = [
  {
    title: 'Villa Kitchen Renovation',
    description: 'Complete kitchen renovation for a luxury villa with custom cabinetry and premium appliances',
    image_url: '/uploads/placeholder-project1.jpg',
    client_name: 'Ahmed Al-Rashid',
    completion_date: '2024-01-15'
  },
  {
    title: 'Apartment Kitchen Makeover',
    description: 'Modern kitchen transformation in a downtown apartment with space-saving solutions',
    image_url: '/uploads/placeholder-project2.jpg',
    client_name: 'Sarah Johnson',
    completion_date: '2024-02-28'
  }
];

// Seed database
db.serialize(() => {
  console.log('Seeding database...');

  // Insert categories
  const categoryStmt = db.prepare('INSERT OR IGNORE INTO categories (name, description, image_url) VALUES (?, ?, ?)');
  categories.forEach(category => {
    categoryStmt.run(category.name, category.description, category.image_url);
  });
  categoryStmt.finalize();
  console.log('Categories seeded');

  // Insert products
  const productStmt = db.prepare(`INSERT OR IGNORE INTO products
    (name, description, price, category_id, image_url, specifications, in_stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  products.forEach(product => {
    productStmt.run(
      product.name,
      product.description,
      product.price,
      product.category_id,
      product.image_url,
      product.specifications,
      product.in_stock,
      product.featured
    );
  });
  productStmt.finalize();
  console.log('Products seeded');

  // Insert gallery items
  const galleryStmt = db.prepare('INSERT OR IGNORE INTO gallery (title, description, image_url, category) VALUES (?, ?, ?, ?)');
  gallery.forEach(item => {
    galleryStmt.run(item.title, item.description, item.image_url, item.category);
  });
  galleryStmt.finalize();
  console.log('Gallery seeded');

  // Insert projects
  const projectStmt = db.prepare(`INSERT OR IGNORE INTO projects
    (title, description, image_url, client_name, completion_date)
    VALUES (?, ?, ?, ?, ?)`);
  projects.forEach(project => {
    projectStmt.run(
      project.title,
      project.description,
      project.image_url,
      project.client_name,
      project.completion_date
    );
  });
  projectStmt.finalize();
  console.log('Projects seeded');

  console.log('Database seeding completed successfully!');
  db.close();
});