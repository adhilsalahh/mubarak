import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/#contact' }
];

const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    // Play ringing sound on mount with a slight delay to sync with animation
    const playKitchenBellSound = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const now = audioContext.currentTime;
        
        // First bell tone (higher pitch)
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        
        osc1.frequency.setValueAtTime(850, now);
        osc1.frequency.exponentialRampToValueAtTime(620, now + 0.5);
        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        
        osc1.start(now);
        osc1.stop(now + 0.8);
        
        // Second bell tone (lower pitch) - delayed
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.frequency.setValueAtTime(620, now + 0.1);
        osc2.frequency.exponentialRampToValueAtTime(420, now + 0.6);
        gain2.gain.setValueAtTime(0.25, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 1);
        
        osc2.start(now + 0.1);
        osc2.stop(now + 1);
        
        // Add reverb effect with delay
        const delay = audioContext.createDelay();
        const delayGain = audioContext.createGain();
        delay.delayTime.value = 0.15;
        delayGain.gain.value = 0.3;
        
        gain1.connect(delay);
        gain2.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(audioContext.destination);
      } catch (error) {
        console.log('Web Audio API not available or user interaction required:', error);
      }
    };

    const timer = setTimeout(playKitchenBellSound, 400);
    return () => clearTimeout(timer);
  }, []);

  // Floating animation for elements
  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <motion.header
      ref={headerRef}
      className="header-3d"
      initial={{ y: -130, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
    >
        {/* 3D Background Animation */}
        <div className="header-3d-bg">
          <motion.div 
            className="kitchen-door-left"
            initial={{ rotateY: 80 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
          />
          <motion.div 
            className="kitchen-door-right"
            initial={{ rotateY: -80 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
          />
          <motion.div className="kitchen-light-glow" />
        </div>

        {/* Main Navigation */}
        <motion.nav
          className="nav"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="nav-left">
            <Link to="/" className="logo">
              <motion.span 
                className="logo-text"
                whileHover={{ scale: 1.08 }} 
                transition={{ type: 'spring', stiffness: 400 }}
              >
                🏠 Mubarak Aluminium Kitchen
              </motion.span>
            </Link>
          </div>
          <div className="nav-right">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                className="nav-item-wrapper"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.08, duration: 0.35 }}
                whileHover={{ scale: 1.07 }}
              >
                {item.to.startsWith('#') || item.to.startsWith('/#') ? (
                  <a href={item.to} className="nav-link">{item.label}</a>
                ) : (
                  <Link to={item.to} className="nav-link">{item.label}</Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.nav>

        {/* Floating Decorative Elements */}
        <motion.div 
          className="floating-element element-1"
          animate={floatingVariants.animate}
          initial={floatingVariants.initial}
        />
        <motion.div 
          className="floating-element element-2"
          animate={floatingVariants.animate}
          initial={floatingVariants.initial}
        />
        <motion.div 
          className="floating-element element-3"
          animate={floatingVariants.animate}
          initial={floatingVariants.initial}
        />
      </motion.header>
  );
};

export default Header;