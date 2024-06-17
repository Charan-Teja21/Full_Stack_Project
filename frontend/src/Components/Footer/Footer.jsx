import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li><a href="/about">Company Info</a></li>
              <li><a href="/team">Our Team</a></li>
              <li><a href="/careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="/help">Help & FAQs</a></li>
              <li><a href="/returns">Returns</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com"><FaFacebook /></a>
              <a href="https://www.twitter.com"><FaTwitter /></a>
              <a href="https://www.instagram.com"><FaInstagram /></a>
              <a href="https://www.linkedin.com"><FaLinkedin /></a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Contact Us</h4>
            <ul>
              <li>Email: contact@feasto.com</li>
              <li>Phone: +970 417 6019</li>
              <li>Address: 123 Main Street, Hyderabad, India</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Feasto. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
