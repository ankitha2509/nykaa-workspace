import "./Footer.css";
import { FaEnvelope, FaMobileAlt, FaPhoneAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer>

      <div className="footer-title">
        Nykaa - The Online Beauty Store
      </div>

    
      <div className="footer-top-section">

      
        <div className="footer-box">
          <FaEnvelope className="footer-icon" />

          <div>
            <p className="footer-heading">
              Get special discount on your inbox
            </p>

            <div className="subscribe-box">
              <input type="email" placeholder="Your Email" />
              <button>Send</button>
            </div>
          </div>
        </div>

      
        <div className="footer-box">
          <FaMobileAlt className="footer-icon" />

          <div>
            <p className="footer-heading">
              experience the nykaa mobile app
            </p>

            <div className="app-links">
              <a href="https://nykaa.onelink.me/2573509543/aba6fc39">
                App Store
              </a>
              <a href="https://nykaa.onelink.me/2573509543/aba6fc39">
                Google Play
              </a>
            </div>
          </div>
        </div>

       
        <div className="footer-box">
          <FaPhoneAlt className="footer-icon" />

          <div>
            <p className="footer-heading">
              for any help, you may call us at
            </p>

            <h3 className="phone-number">1800-267-4444</h3>

            <span className="timing">
              (All days, 8 AM to 10 PM)
            </span>
          </div>
        </div>

      </div>

    
<div className="footer-middle">

  <div className="footer-grid">


    <div className="footer-col">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/00/Nykaa_New_Logo.svg"
        alt="Nykaa"
        className="footer-logo"
      />

      <p>Who are we?</p>
      <p>Careers</p>
      <p>Authenticity</p>
      <p>Press</p>
      <p>Testimonials</p>
      <p>Nykaa CSR</p>
      <p>Sustainability</p>
      <p>Responsible Disclosure</p>
      <p>Investor Relations</p>
      <p>Link to Smart ODR</p>
    </div>

   
    <div className="footer-col">
      <h4>Help</h4>
      <p>Contact Us</p>
      <p>Frequently asked questions</p>
      <p>Store Locator</p>
      <p>Cancellation & Return</p>
      <p>Shipping & Delivery</p>
      <p>Sell on Nykaa</p>
    </div>

    <div className="footer-col">
      <h4>Inspire Me</h4>
      <p>Beauty Book</p>
      <p>Games Board</p>
      <p>Buying Guides</p>
    </div>

  
    <div className="footer-col">
      <h4>Quick Links</h4>
      <p>Offer Zone</p>
      <p>New Launches</p>
      <p>Nykaa Man</p>
      <p>Nykaa Fashion</p>
      <p>Nykaa Pro</p>
      <p>Sitemap</p>
    </div>

 
    <div className="footer-col">
      <h4>Top Categories</h4>
      <p>Makeup</p>
      <p>Skin</p>
      <p>Hair</p>
      <p>Bath & Body</p>
      <p>Appliances</p>
      <p>Mom and Baby</p>
      <p>Health & Wellness</p>
      <p>Fragrance</p>
      <p>Natural</p>
      <p>Luxe</p>
    </div>

  </div>

</div>

    </footer>
  );
}

export default Footer;