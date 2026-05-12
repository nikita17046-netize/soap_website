'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Contact.module.css';

const API_URL = 'http://127.0.0.1:8000/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Custom Collection Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: 'Custom Collection Inquiry', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Background Image */}
      <Image 
        src="/contact-bg.png" 
        alt="Luxury Concierge Background" 
        fill 
        sizes="100vw"
        className={styles.pageBg}
        priority
      />
      <div className={styles.pageOverlay}></div>

      <div className={styles.contentWrapper}>
        {/* Left Side: Editorial Info */}
        <div className={`${styles.infoSection} animate-up`}>
          <div>
            <span className="label">Concierge</span>
            <h1>The Aura <br /> <span>Connection</span></h1>
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
          {isSuccess ? (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✨</div>
              <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--accent-primary)', marginBottom: '10px' }}>Ritual Recorded</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Your message has been safely delivered to our artisans. We will reach out shortly.</p>
            </div>
          ) : (
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input 
                  name="name"
                  type="text" 
                  placeholder="How may we address you?" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ 
                    background: 'var(--white)', 
                    border: '1px solid rgba(0,0,0,0.05)', 
                    padding: '16px 20px', 
                    fontSize: '1rem', 
                    borderRadius: '100px', 
                    color: 'var(--accent-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Custom Collection Inquiry">Custom Collection Inquiry</option>
                  <option value="Shipping & Logistics">Shipping & Logistics</option>
                  <option value="Press & Media">Press & Media</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Your Message</label>
                <textarea 
                  name="message"
                  placeholder="Tell us about your ritual needs..." 
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Delivering...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
