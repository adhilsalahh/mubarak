import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="loading">Loading product details...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="error">Product not found</div>
        <Footer />
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const specifications = product.specifications ? JSON.parse(product.specifications) : {};

  return (
    <div className="product-detail-page">
      <Header />
      <main>
        <motion.div
          className="product-detail-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="product-gallery">
            <motion.div
              className="main-image"
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {images.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${images[selectedImage]}`}
                  alt={product.name}
                />
              ) : (
                <div className="placeholder-image">No Image Available</div>
              )}
            </motion.div>
            <div className="thumbnail-gallery">
              {images.map((image, index) => (
                <motion.img
                  key={index}
                  src={`http://localhost:5000/uploads/${image}`}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {product.name}
            </motion.h1>

            <motion.div
              className="product-meta"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="category">{product.category_name}</span>
              <span className="price">SAR {product.price}</span>
              <span className={`stock ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </motion.div>

            <motion.p
              className="description"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {product.description}
            </motion.p>

            {Object.keys(specifications).length > 0 && (
              <motion.div
                className="specifications"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3>Specifications</h3>
                <ul>
                  {Object.entries(specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div
              className="product-actions"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                className="inquire-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Inquire Now
              </motion.button>
              <motion.button
                className="share-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigator.share?.({
                  title: product.name,
                  text: product.description,
                  url: window.location.href
                })}
              >
                Share
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;