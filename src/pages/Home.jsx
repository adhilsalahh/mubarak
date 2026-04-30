import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import KitchenHeroSection from '../components/KitchenHeroSection';
import axios from 'axios';

const Home = () => {
  const [gallery, setGallery] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [submitMessage, setSubmitMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/gallery')
      .then(response => setGallery(response.data))
      .catch(error => console.error('Error fetching gallery:', error));

    // Show modal after 3 seconds
    const timer = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', contactForm);
      setSubmitMessage('Thank you for your enquiry. We will contact you soon!');
      setContactForm({ name: '', phone: '', message: '' });
    } catch (error) {
      setSubmitMessage('Error submitting enquiry. Please try again.');
    }
  };

  const animatedRef = useRef(null);
  const defaultGalleryImages = [
    { id: 'home-1', image: '/luxury-kitchen-demo.jpg', title: 'Luxury kitchen installation', category: 'Kitchens' },
    { id: 'home-2', image: '/sinks-hoods.jpg', title: 'Premium appliances', category: 'Accessories' },
    { id: 'home-3', image: '/modular-kitchen.jpg', title: 'Contemporary kitchen style', category: 'Design' },
    { id: 'home-4', image: '/custom-kitchen.jpg', title: 'Custom door finishes', category: 'Doors' },
    { id: 'home-5', image: '/manufacturing1.jpg', title: 'In-house manufacturing', category: 'Production' },
    { id: 'home-6', image: '/vision-2030.jpg', title: 'Designed for Saudi living', category: 'Vision' }
  ];

  const galleryPreview = gallery.length > 0 ? gallery.slice(0, 6) : defaultGalleryImages;

  const shopCategories = [
    {
      title: 'Complete Kitchens',
      description: 'Luxury modular, shaker and matt-finish kitchens tailored for modern Saudi homes.',
      image: '/luxury-kitchen.jpg',
      link: '/products'
    },
    {
      title: 'Door Ranges',
      description: 'Elegant handleless doors, grooved shaker styles and premium oak finishes.',
      image: '/custom-kitchen.jpg',
      link: '/products'
    },
    {
      title: 'Windows & Panels',
      description: 'High-performance glazing, custom panels and coordinated kitchen cladding.',
      image: '/kitchen-banner.jpg',
      link: '/products'
    },
    {
      title: 'Accessories',
      description: 'Sinks, hoods, pantries and hardware designed to complete your kitchen project.',
      image: '/pantry-internals.jpg',
      link: '/products'
    }
  ];

  const demoCards = [
    {
      title: 'Modern Kitchen Suites',
      description: 'Curated modern kitchens with seamless storage, ambient lighting and quality finishes.',
      color: '#22c55e',
      button: 'Shop Kitchen Collections'
    },
    {
      title: 'Premium Door Finishes',
      description: 'Soft-touch matt doors, lacquer gloss and timber-effect designs for every style.',
      color: '#38bdf8',
      button: 'Explore Door Ranges'
    },
    {
      title: 'Smart Accessories',
      description: 'Built-in hoods, sinks, pantry internals and hardware for a premium kitchen fit-out.',
      color: '#fb7185',
      button: 'View Accessories'
    },
    {
      title: 'Bespoke Project Support',
      description: 'Full design, manufacture and install services for homes, villas and commercial spaces.',
      color: '#fbbf24',
      button: 'Request a Quote'
    }
  ];

  const demoImages = [
    '/luxury-kitchen.jpg',
    '/custom-kitchen.jpg',
    '/modular-kitchen.jpg',
    '/kitchen-banner.jpg'
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!animatedRef.current) return;

    const images = gsap.utils.toArray(animatedRef.current.querySelectorAll('.arch__right .img-wrapper'));

    const ctx = gsap.context(() => {
      gsap.set(images, { autoAlpha: 0, y: 50, scale: 1.04 });
      images.forEach((img) => {
        gsap.to(img, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        });
      });
    }, animatedRef);

    return () => ctx.revert();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const rangeCards = [
    { title: 'Newcombe', label: 'CONTEMPORARY', description: 'Timeless narrow shaker design with premium matte woodgrain texture.', image: '/newcombe.jpg' },
    { title: 'Mila - Matte', label: 'CONTEMPORARY', description: 'Contemporary grooved door with elegant 25mm spacing for modern kitchens.', image: '/mila-matte.jpg' },
    { title: 'Belsay - Beaded', label: 'TRADITIONAL', description: 'Affordable shaker with decorative inner bead detailing for a refined finish.', image: '/belsay.jpg' },
    { title: 'Morgan', label: 'CONTEMPORARY', description: 'Bold contemporary design with premium texture and seamless handle detail.', image: '/contemporary-morgan.jpg' },
    { title: 'Signature Oak', label: 'LUXURY', description: 'Rich oak effect cabinet doors with custom brass trim and luxury hardware.', image: '/luxury-kitchen.jpg' },
    { title: 'Smart Slate', label: 'MODERN', description: 'Deep matte finish and smart storage engineered for everyday living.', image: '/smart-kitchen.jpg' }
  ];

  const accessoryCards = [
    {
      title: 'Pantry Internals',
      description: 'Compliment your kitchen with pantry internals and hardware, crafted with oak and MFC in-house.',
      image: '/pantry-internals.jpg',
      button: 'Explore accessories'
    },
    {
      title: 'Sinks & Cooker Hoods',
      description: 'Add the latest extraction and water tech with Faber hoods and Blanco sinks and taps.',
      image: '/sinks-hoods.jpg',
      button: 'View sinks & hoods'
    }
  ];

  const benefitCards = [
    { title: 'Expert Support', description: 'Experienced dedicated account agents and fully trained quoters.' },
    { title: 'Complete Kitchens', description: 'Rigid built, complete kitchens manufactured in-house for premium delivery.' },
    { title: 'Communications', description: 'Electronic email/text alerts, sales analytics and web portal support.' },
    { title: 'Leading Brands', description: 'The UK & Ireland leading door brands, components and door specs.' }
  ];

  return (
    <div className="home">
      <Header />
      <main>
        {/* 3D Kitchen Opening Hero Section */}
        <KitchenHeroSection fadeInUp={fadeInUp} />

        <motion.section id="shop" className="shop-categories" {...fadeInUp} viewport={{ once: true }}>
          <div className="section-header">
            <h2>Shop by category</h2>
            <p>Discover kitchens, doors, windows and premium accessories for every scale of interior project.</p>
          </div>
          <div className="category-grid">
            {shopCategories.map((item, index) => (
              <motion.div
                className="category-card"
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <img src={item.image} alt={item.title} />
                <div className="category-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link to={item.link} className="view-all-btn">Explore {item.title}</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="demo-arch"
          className="demo-arch"
          {...fadeInUp}
          viewport={{ once: true }}
          ref={animatedRef}
        >
          <div className="arch">
            <div className="arch__left">
              {demoCards.map((card, index) => (
                <motion.div
                  className="arch__info"
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ borderColor: card.color }}
                >
                  <div className="content">
                    <h2 className="header">{card.title}</h2>
                    <p className="desc">{card.description}</p>
                    <a className="link" href="#contact" style={{ backgroundColor: card.color }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none">
                        <path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                      </svg>
                      <span>{card.button}</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="arch__right">
              {demoImages.map((src, index) => (
                <div className="img-wrapper" key={src} data-index={demoImages.length - index}>
                  <img src={src} alt="Demo architecture" />
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          id="about"
          className="about"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          <h2>About Us</h2>
          <p>Our expert team delivers high-quality, stylish, and functional kitchen designs tailored to meet the needs of homes and businesses in cities like Jeddah, Riyadh, and Dammam. We use top-grade materials, advanced technology, and elegant finishes to create kitchens that combine beauty, durability, and performance. From contemporary designs to classic Arabic-style kitchens, we offer complete solutions including design consultation, manufacturing, and installation.</p>
          <p>Our goal is to transform your space into a sophisticated and comfortable kitchen environment.</p>
          <motion.button
            className="learn-more-btn"
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More About Our 2030 Vision
          </motion.button>
        </motion.section>

        {/* Trade Focus */}
        <motion.section
          id="trade"
          className="trade-section"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          <div className="trade-copy">
            <p className="eyebrow">Raise your expectations.</p>
            <h2>200+ premium trade partners across Saudi Arabia</h2>
            <p>We supply complete rigid built kitchens to trade customers and premium projects across Saudi Arabia with industry-leading doors, cabinets and hardware fully assembled in-house.</p>
            <div className="trade-points">
              <div>
                <strong>6 New Ranges</strong>
                <span>Latest kitchen collections for contemporary and classic buyers.</span>
              </div>
              <div>
                <strong>100s of Styles</strong>
                <span>Door ranges and finishes from the UK & Ireland top suppliers.</span>
              </div>
              <div>
                <strong>1000+ Options</strong>
                <span>Cabinet and panel options ready for utility rooms, boot rooms and pantries.</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Superior Products */}
        <motion.section
          id="services"
          className="services"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          <h2>Superior Kitchen Products</h2>
          <p>Industry-leading doors, cabinets and hardware with premium manufacture in-house.</p>
          <div className="service-cards">
            <motion.div className="service-card" whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300 }}>
              <img src="/modular-kitchen.jpg" alt="Rigid Built Kitchen" />
              <h3>Rigid Built Kitchens</h3>
              <p>Complete kitchens manufactured with precision, ready for seamless installation.</p>
              <Link to="/products?category=Rigid Kitchens" className="service-link">Browse Rigid Kitchens</Link>
            </motion.div>
            <motion.div className="service-card" whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300 }}>
              <img src="/custom-kitchen.jpg" alt="Door Ranges" />
              <h3>Door Ranges</h3>
              <p>100s of door styles and premium finishes sourced from the UK & Ireland.</p>
              <Link to="/products?category=Door Ranges" className="service-link">Browse Door Ranges</Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Kitchen Ranges */}
        <motion.section
          id="kitchen-ranges"
          className="ranges"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          <div className="section-header">
            <h2>Kitchen Ranges</h2>
            <p>100s of door ranges and styles from the UK & Ireland's leading suppliers. Industry-leading cabinet specs available in 15 colours.</p>
          </div>
          <div className="range-grid">
            {rangeCards.map((range, index) => (
              <motion.div
                className="range-card"
                key={range.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <img src={range.image} alt={range.title} />
                <span className="range-label">{range.label}</span>
                <h3>{range.title}</h3>
                <p>{range.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.div className="view-all-services" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
            <Link to="/products" className="view-all-btn">See what you can do</Link>
          </motion.div>
        </motion.section>

        {/* Range Spotlight */}
        <motion.section id="range-spotlight" className="range-spotlight" {...fadeInUp} viewport={{ once: true }}>
          <div className="section-header">
            <h2>Latest Kitchen Ranges</h2>
            <p>New ranges in Apr 2026 at Sinc Kitchens. For 100s of kitchen ranges and colours, check out our kitchen search page.</p>
          </div>
          <div className="feature-grid">
            {rangeCards.slice(0, 3).map((range, index) => (
              <motion.div
                className="feature-card"
                key={range.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img src={range.image} alt={range.title} />
                <div>
                  <span>{range.label}</span>
                  <h3>{range.title}</h3>
                  <p>{range.description}</p>
                  <Link to="/products" className="feature-link">More details</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Accessories */}
        <motion.section id="accessories" className="accessory-collections" {...fadeInUp} viewport={{ once: true }}>
          <div className="section-header">
            <h2>Accessories</h2>
            <p>Compliment your kitchen with pantry internals, kitchen hardware, sinks and cooker hoods from premium brands.</p>
          </div>
          <div className="accessory-grid">
            {accessoryCards.map((item, idx) => (
              <motion.div className="accessory-card" key={item.title} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 280 }}>
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button onClick={() => window.location.href = '/products'}>{item.button}</button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* More than just kitchens */}
        <motion.section id="more-than-kitchens" className="more-than-kitchens" {...fadeInUp} viewport={{ once: true }}>
          <div>
            <h2>More than just kitchens</h2>
            <p>Talk to our team about utility rooms, boot rooms, cloak rooms and pantries. We deliver thoughtful design for every service area.</p>
          </div>
          <div className="more-grid">
            {['Utility Rooms', 'Boot Rooms', 'Cloak Rooms', 'Pantries'].map((item, idx) => (
              <motion.div key={item} className="more-item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.08 }} viewport={{ once: true }}>
                <h3>{item}</h3>
                <p>Design, manufacture and install elegant solutions to match your kitchen and home flow.</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Sinc */}
        <motion.section id="why-sinc" className="why-sinc" {...fadeInUp} viewport={{ once: true }}>
          <div className="section-header">
            <h2>Why Sinc?</h2>
            <p>Decades of trade knowledge meets unparalleled customer service for kitchen partners across Saudi Arabia.</p>
          </div>
          <div className="why-grid">
            {benefitCards.map((item, idx) => (
              <motion.div key={item.title} className="benefit-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.08 }} viewport={{ once: true }}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.div className="retailer-cta" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <p>Join 100s of retailers and trade customers enjoying great prices and exceptional service.</p>
            <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>More about becoming a retailer</button>
          </motion.div>
        </motion.section>

        {/* Gallery */}
        <motion.section
          id="gallery"
          className="gallery"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          <h2>Gallery</h2>
          <div className="gallery-grid">
            {galleryPreview.map((image, index) => {
              const src = image.image.startsWith('/') ? image.image : `http://localhost:5000/uploads/${image.image}`;
              return (
                <motion.img
                  key={image.id}
                  src={src}
                  alt={image.title || 'Kitchen'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                />
              );
            })}
          </div>
          <motion.div
            className="view-gallery"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/gallery" className="view-gallery-btn">
              View Full Gallery
            </Link>
          </motion.div>
        </motion.section>

        {/* Contact */}
        <motion.section
          id="contact"
          className="contact"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          <h2>Contact Us</h2>
          <p>Contact us today for free consultation, affordable pricing, and professional kitchen design services in Saudi Arabia.</p>
          <motion.form
            onSubmit={handleContactSubmit}
            className="contact-form"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.input
              type="text"
              placeholder="Name"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              required
              whileFocus={{ scale: 1.02 }}
            />
            <motion.input
              type="tel"
              placeholder="Phone"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              required
              whileFocus={{ scale: 1.02 }}
            />
            <motion.textarea
              placeholder="Message"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              required
              whileFocus={{ scale: 1.02 }}
            ></motion.textarea>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          </motion.form>
          {submitMessage && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{submitMessage}</motion.p>}
        </motion.section>
      </main>
      <Footer />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="vision-modal">
          <h2>Saudi 2030 Vision: Best Kitchen Design</h2>
          <p>As part of Saudi Arabia's Vision 2030, we are committed to delivering the best kitchen designs that embody innovation, sustainability, and luxury. Our kitchens are designed to meet the highest standards of modern living, incorporating smart technology, eco-friendly materials, and timeless elegance.</p>
          <p>Join us in creating kitchens that are not just functional, but visionary spaces for the future.</p>
          <img src="/vision-2030.jpg" alt="Saudi 2030 Vision" />
        </div>
      </Modal>
    </div>
  );
};

export default Home;