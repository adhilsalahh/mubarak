import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const KitchenHeroSection = ({ fadeInUp }) => {
  const containerRef = useRef(null);
  const kitchenRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end center']
  });

  // 3D rotation based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 1], [75, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-25, 0]);
  const z = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Kitchen door opening animation on scroll
  const doorLeftX = useTransform(scrollYProgress, [0, 0.8], [-100, 0]);
  const doorRightX = useTransform(scrollYProgress, [0, 0.8], [100, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for background
      gsap.to(kitchenRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom center',
          scrub: 1,
          markers: false
        },
        y: -100,
        ease: 'none'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      ref={containerRef}
      id="home"
      className="kitchen-hero-3d"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 3D Kitchen Scene */}
      <div className="kitchen-3d-scene">
        <motion.div
          ref={kitchenRef}
          className="kitchen-3d-container"
          style={{
            rotateX,
            rotateY,
            z,
            opacity
          }}
        >
          {/* Background Kitchen Image */}
          <motion.div className="kitchen-3d-bg">
            <div className="kitchen-image-wrapper">
              <div className="kitchen-spotlight" />
              <svg className="kitchen-3d-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
                {/* Kitchen Cabinet Base */}
                <defs>
                  <linearGradient id="kitchenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFF8DC', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#FFE4B5', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FFDAB9', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="doorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#D4A574', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#8B6F47', stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="metalShine">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                  </filter>
                </defs>

                {/* Kitchen Counter Base */}
                <rect x="100" y="400" width="1000" height="300" fill="url(#kitchenGrad)" stroke="#888" strokeWidth="2" />

                {/* Left Cabinet Door */}
                <motion.g
                  initial={{ x: 0 }}
                  style={{ x: doorLeftX }}
                >
                  <rect x="150" y="300" width="280" height="350" fill="url(#doorGrad)" stroke="#654321" strokeWidth="3" rx="10" />
                  {/* Door Handle */}
                  <circle cx="400" cy="475" r="8" fill="#FFD700" filter="url(#metalShine)" />
                  {/* Door Panel Detail */}
                  <rect x="180" y="330" width="220" height="290" fill="none" stroke="#A0826D" strokeWidth="2" rx="5" opacity="0.6" />
                </motion.g>

                {/* Right Cabinet Door */}
                <motion.g
                  initial={{ x: 0 }}
                  style={{ x: doorRightX }}
                >
                  <rect x="770" y="300" width="280" height="350" fill="url(#doorGrad)" stroke="#654321" strokeWidth="3" rx="10" />
                  {/* Door Handle */}
                  <circle cx="800" cy="475" r="8" fill="#FFD700" filter="url(#metalShine)" />
                  {/* Door Panel Detail */}
                  <rect x="800" y="330" width="220" height="290" fill="none" stroke="#A0826D" strokeWidth="2" rx="5" opacity="0.6" />
                </motion.g>

                {/* Cooktop */}
                <rect x="450" y="420" width="300" height="80" fill="#C0C0C0" stroke="#808080" strokeWidth="2" rx="5" />
                <circle cx="520" cy="450" r="15" fill="#333" />
                <circle cx="600" cy="450" r="15" fill="#333" />
                <circle cx="680" cy="450" r="15" fill="#333" />
                <circle cx="730" cy="450" r="15" fill="#333" />

                {/* Backsplash */}
                <rect x="100" y="200" width="1000" height="100" fill="#E8DCC8" stroke="#999" strokeWidth="2" />
                {/* Backsplash Tiles */}
                {[...Array(10)].map((_, i) => (
                  <rect key={i} x={150 + i * 90} y="220" width="70" height="70" fill="none" stroke="#CCC" strokeWidth="1" />
                ))}

                {/* Kitchen Light Rays */}
                <defs>
                  <radialGradient id="lightGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{ stopColor: '#FFEB3B', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 0 }} />
                  </radialGradient>
                </defs>
                <ellipse cx="600" cy="150" rx="300" ry="200" fill="url(#lightGlow)" opacity="0.6" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Overlay */}
      <motion.div className="kitchen-hero-content" {...fadeInUp}>
        <motion.div
          className="banner-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ✨ 3D Kitchen Experience
        </motion.div>
        <h1>Premium Kitchen Design & Installation</h1>
        <p>Experience luxury kitchen transformations with our 3D visualization, expert design, and seamless installation. From concept to reality in Jeddah, Riyadh & Dammam.</p>
        
        <motion.div className="hero-cta-row" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}>
          <motion.button
            className="contact-btn-primary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 107, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="contact-btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Gallery
          </motion.button>
        </motion.div>

        <div className="hero-highlights">
          {['3D Design', 'Expert Craft', 'Premium Quality', 'Fast Install'].map((item, index) => (
            <motion.div
              className="hero-highlight"
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="scroll-text">Scroll to Explore</div>
        <svg className="scroll-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.section>
  );
};

export default KitchenHeroSection;
