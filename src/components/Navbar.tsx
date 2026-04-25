'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen, searchQuery, setSearchQuery } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hideOnPaths = ['/login', '/register', '/admin', '/checkout'];
  if (hideOnPaths.includes(pathname)) return null;

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push('/shop');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Offers', path: '/offers', isSpecial: true },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Left: Brand */}
        <div className={styles.navLeft}>
          <Link href="/" className={styles.logo}>
            AURA
            <span className={styles.logoSub}>Nature & Crafts</span>
          </Link>
        </div>

        {/* Center: Main Links */}
        <div className={styles.navCenter}>
          <div className={styles.mainLinks}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path} 
                className={`${styles.navLink} ${pathname === link.path || (link.path !== '/' && pathname.includes(link.path)) ? styles.active : ''} ${link.isSpecial ? styles.offersLink : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className={styles.navRight}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search Rituals..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              suppressHydrationWarning
            />
          </div>
          
          <div className={styles.actions}>
            {isLoggedIn ? (
              <div className={styles.userSection}>
                <Link href="/dashboard" className={styles.actionItem} title="Dashboard">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span className={styles.actionText}>Dashboard</span>
                </Link>
                <button onClick={logout} className={styles.actionItem} title="Logout">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span className={styles.actionText}>Logout</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.actionItem} title="Account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className={styles.actionText}>Login</span>
              </Link>
            )}

            <button 
              className={styles.cartButton} 
              onClick={() => setIsCartOpen(true)} 
              title="Bag"
              suppressHydrationWarning
            >
              <div className={styles.cartIconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className={styles.cartBadge}>{totalItems}</span>
                )}
              </div>
              <span className={styles.actionText}>Bag</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
