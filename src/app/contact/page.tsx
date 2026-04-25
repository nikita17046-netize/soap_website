import React from 'react';
import Image from 'next/image';
import styles from './Contact.module.css';

const ContactPage = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Background Image */}
      <Image 
        src="/contact-bg.png" 
        alt="Luxury Concierge Background" 
        fill 
        className={styles.pageBg}
        priority
      />
      <div className={styles.pageOverlay}></div>

      <div className={styles.contentWrapper}>
        {/* Left Side: Editorial Info */}
        <div className={`${styles.infoSection} animate-up`}>
          <div>
            <span className="label">Concierge</span>
            <h1>The Aura <br />Connection</h1>
            <p>Our artisans are here to assist you in curating your perfect botanical ritual.</p>
          </div>

          <div className={styles.contactDetails}>
            <div className={styles.detailItem}>
              <span>Atelier Address</span>
              <span>127 Silk Road, Botanical District<br />Aura Valley, AV 90210</span>
            </div>
            
            <div className={styles.detailItem}>
              <span>Direct Inquiry</span>
              <span>concierge@aurasoaps.com</span>
            </div>

            <div className={styles.detailItem}>
              <span>Voice</span>
              <span>+1 (800) AURA-LUV</span>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className={`${styles.glassCard} animate-up`} style={{ animationDelay: '0.2s' }}>
          <form className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="How may we address you?" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="email@example.com" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Subject</label>
              <select style={{ 
                background: 'rgba(0,0,0,0.03)', 
                border: '1px solid transparent', 
                padding: '16px 20px', 
                fontSize: '1rem', 
                borderRadius: '100px', 
                color: 'var(--accent-primary)',
                cursor: 'pointer'
              }}>
                <option>Custom Collection Inquiry</option>
                <option>Shipping & Logistics</option>
                <option>Press & Media</option>
                <option>General Feedback</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Your Message</label>
              <textarea placeholder="Tell us about your ritual needs..." required></textarea>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
