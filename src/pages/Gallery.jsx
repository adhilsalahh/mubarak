import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'All'
        ? 'http://localhost:5000/api/gallery'
        : `http://localhost:5000/api/gallery?category=${selectedCategory}`;
      const response = await axios.get(url);
      setGalleryImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery');
      const uniqueCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="gallery-page">
      <Header />
      <main>
        <motion.section
          className="gallery-hero"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Our Gallery</h1>
          <p>Explore our portfolio of stunning kitchen designs and transformations</p>
        </motion.section>

        <section className="gallery-filters">
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
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </section>

        <section className="gallery-grid">
          {loading ? (
            <div className="loading">Loading gallery...</div>
          ) : (
            <motion.div
              className="gallery-container"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="gallery-item"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                    zIndex: 10
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={`http://localhost:5000/uploads/${image.image}`}
                    alt={image.title}
                  />
                  <div className="gallery-overlay">
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                    <span className="category-tag">{image.category}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
      <Footer />

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`http://localhost:5000/uploads/${selectedImage.image}`}
                alt={selectedImage.title}
              />
              <div className="lightbox-info">
                <h2>{selectedImage.title}</h2>
                <p>{selectedImage.description}</p>
                <span className="lightbox-category">{selectedImage.category}</span>
              </div>
              <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;