'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

const Footer = () => {
  const pathname = usePathname();

  // Hide Footer on Login, Register, Admin and Checkout pages
  if (['/login', '/register', '/admin', '/checkout'].includes(pathname)) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logo}>AURA</Link>
            <p>
              Elevating daily rituals through the purity of nature 
              and the precision of craft. Hand-poured in the heart 
              of the Botanical District.
            </p>
          </div>

          {/* Navigation Column */}
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Collections</h4>
            <div className={styles.links}>
              <Link href="/shop" className={styles.link}>The Shop</Link>
              <Link href="/shop?category=botanical" className={styles.link}>Botanical Series</Link>
              <Link href="/shop?category=limited" className={styles.link}>Limited Edition</Link>
              <Link href="/shop?category=essential" className={styles.link}>Essential Oils</Link>
            </div>
          </div>

          {/* Info Column */}
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Journal</h4>
            <div className={styles.links}>
              <Link href="/about" className={styles.link}>Our Story</Link>
              <Link href="/contact" className={styles.link}>Concierge</Link>
              <Link href="/shipping" className={styles.link}>Shipping & Returns</Link>
              <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className={styles.newsletterColumn}>
            <h4 className={styles.columnTitle}>The Private List</h4>
            <p>Join for early access to new collection launches and seasonal rituals.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className={styles.newsletterInput} 
                suppressHydrationWarning
              />
              <button type="submit" className={styles.newsletterSubmit} suppressHydrationWarning>Join</button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            &copy; 2026 Aura Nature & Crafts. All Rights Reserved.
          </div>
          
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Pinterest">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="3" x2="6" y2="15"></line>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M18 9a9 9 0 0 1-9 9"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
