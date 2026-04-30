const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Mubarak Aluminium Kitchen</h3>
          <p>Premium kitchen manufacturing, project support and trade partnerships across Saudi Arabia.</p>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <a href="#contact">Contact</a>
          <a href="#about">Manufacturing</a>
          <a href="#trade">Carcass Spec</a>
          <a href="#why-sinc">Retailer Map</a>
          <a href="#contact">Pay My Bill</a>
        </div>
        <div className="footer-links">
          <h4>Kitchens</h4>
          <a href="#kitchen-ranges">Traditional</a>
          <a href="#range-spotlight">New ranges</a>
          <a href="#kitchen-types">Contemporary</a>
          <a href="#kitchen-types">Classic</a>
          <a href="#kitchen-types">German Style</a>
        </div>
        <div className="footer-newsletter">
          <h4>Signup to our newsletter</h4>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="social-links">
          <a href="#facebook">Facebook</a>
          <a href="#linkedin">LinkedIn</a>
          <a href="#instagram">Instagram</a>
        </div>
        <p>&copy; Mubarak Aluminium Kitchen 2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;