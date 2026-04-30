import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const Products = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'All';
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'All'
        ? 'http://localhost:5000/api/products'
        : `http://localhost:5000/api/products?category=${selectedCategory}`;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="products-page">
      <Header />
      <main>
        <motion.section
          className="products-hero"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Our Products</h1>
          <p>Discover our comprehensive range of premium kitchen solutions</p>
        </motion.section>

        <section className="categories-filter">
          <motion.div
            className="filter-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className={selectedCategory === 'All' ? 'active' : ''}
              onClick={() => setSelectedCategory('All')}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={selectedCategory === category.name ? 'active' : ''}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </section>

        <section className="products-grid">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <motion.div
              className="products-container"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="product-card"
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="product-image">
                    {product.images && JSON.parse(product.images).length > 0 ? (
                      <img
                        src={`http://localhost:5000/uploads/${JSON.parse(product.images)[0]}`}
                        alt={product.name}
                      />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                    {product.featured && <span className="featured-badge">Featured</span>}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="category">{product.category_name}</p>
                    <p className="description">{product.description.substring(0, 100)}...</p>
                    <div className="product-footer">
                      <span className="price">SAR {product.price}</span>
                      <Link to={`/products/${product.id}`} className="view-details">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;