'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; path: string; isSpecial?: boolean }[];
  isLoggedIn: boolean;
  user: any;
  logout: () => void;
  theme: string;
  toggleTheme: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navLinks,
  isLoggedIn,
  user,
  logout,
  theme,
  toggleTheme
}) => {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.menu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <span className={styles.brand}>SaptAroma</span>
              <button className={styles.closeBtn} onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.userSection}>
                {isLoggedIn ? (
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div className={styles.userMeta}>
                      <span className={styles.userName}>{user?.name}</span>
                      <button className={styles.logoutBtn} onClick={logout}>Logout</button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className={styles.loginBanner} onClick={onClose}>
                    Join the SaptAroma Ritual
                    <span>Login / Register</span>
                  </Link>
                )}
              </div>

              <nav className={styles.nav}>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`${styles.navLink} ${pathname === link.path ? styles.active : ''} ${link.isSpecial ? styles.special : ''}`}
                    onClick={onClose}
                  >
                    {link.name}
                    {pathname === link.path && <motion.div layoutId="activeDot" className={styles.dot} />}
                  </Link>
                ))}
              </nav>

              <div className={styles.footer}>
                <button className={styles.themeToggle} onClick={toggleTheme}>
                  {theme === 'light' ? 'Switch to Midnight Mode' : 'Switch to Artisan Mode'}
                </button>
                <div className={styles.socials}>
                  {/* Social icons could go here */}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
