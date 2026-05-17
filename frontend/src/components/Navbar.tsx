'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';
import MegaMenu from './MegaMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { PRODUCTS } from '@/constants/products';
import MobileMenu from '@mobile/MobileMenu';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen, searchQuery, setSearchQuery, wishlist } = useCart();
  const { isLoggedIn, logout, user, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [siteNotifications, setSiteNotifications] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };



  useEffect(() => {
    setMounted(true);
    setTheme('light');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('aura-theme', 'light');

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const checkNotifications = async () => {
      let totalCount = 0;

      // 1. Fetch User Messages (Replies)
      if (isLoggedIn && user?.email) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/messages/user/${user.email}`);
          if (res.ok) {
            const data = await res.json();
            const unread = data.filter((m: any) => m.reply && !m.userSeen);
            setUnreadMessages(unread);
            totalCount += unread.length;
          }
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      } else {
        setUnreadMessages([]);
      }

      // 2. Fetch Site-wide Notifications (New Products, etc.)
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/notifications`);
        if (res.ok) {
          const data = await res.json();
          setSiteNotifications(data);
          const unreadSite = data.filter((n: any) => !n.isRead).length;
          totalCount += unreadSite;
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }

      setNotificationCount(totalCount);
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    window.addEventListener('storage', checkNotifications);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkNotifications);
      clearInterval(interval);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [isLoggedIn, user]);

  // Close dropdown on path change
  useEffect(() => {
    setShowNotifications(false);
    setIsMenuOpen(false);
    setActiveMenu(null);
    setShowSuggestions(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme('light');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('aura-theme', 'light');
  };

  const hideOnPaths = ['/login', '/register', '/admin', '/checkout'];
  if (hideOnPaths.includes(pathname)) return null;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 1) {
      const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.category.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSuggestions(false);
      router.push('/shop');
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support voice search.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);

      if (transcript.trim().length > 1) {
        const filtered = PRODUCTS.filter((p: any) =>
          p.name.toLowerCase().includes(transcript.toLowerCase()) ||
          p.category.toLowerCase().includes(transcript.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(true);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Offers', path: '/offers', isSpecial: true },
    { name: 'Ingredients', path: '/glossary' },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' },
    ...(isAdmin ? [{ name: 'Admin Panel', path: '/admin', isSpecial: true }] : [])
  ];

  const mobileNavLinks = [
    ...navLinks,
    { name: 'Track Order', path: '/track' },
    { name: 'Wishlist', path: '/wishlist' }
  ];

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
        {/* Top Bar - Logo, Search, Actions */}
        <div className={styles.topBar}>

          {/* Left: Brand */}
          <div className={styles.navLeft}>
            <Link href="/" className={styles.logo} suppressHydrationWarning>
              <Image
                src="/logo.png"
                alt="SaptAroma Logo"
                width={52}
                height={52}
                className={styles.logoIcon}
                priority
              />
              <span className={styles.brandName}>SaptAroma</span>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search rituals..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
              onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
              suppressHydrationWarning
            />

            <AnimatePresence mode="wait">
              {mounted && showSuggestions && suggestions.length > 0 && (
                <motion.div
                  key="suggestions-dropdown"
                  className={styles.suggestionsDropdown}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {suggestions.map((p) => (
                    <Link
                      key={p._id || p.id}
                      href={`/shop/product/${p._id || p.id}`}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className={styles.suggestionImage}>
                        <Image src={p.images?.[0] || p.image} alt={p.name} width={40} height={40} />
                      </div>
                      <div className={styles.suggestionInfo}>
                        <span className={styles.suggestionName}>{p.name}</span>
                        <span className={styles.suggestionCategory}>{p.category}</span>
                      </div>
                      <span className={styles.suggestionPrice}>₹{p.price}</span>
                    </Link>
                  ))}
                  <Link href="/shop" className={styles.viewAllResults} onClick={() => setShowSuggestions(false)}>
                    View all results
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <svg
              className={`${styles.micIcon} ${isListening ? styles.listening : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={startListening}
              style={{
                cursor: 'pointer',
                color: isListening ? 'var(--accent, #eab308)' : 'inherit',
                transform: isListening ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              <title>Voice Search</title>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </div>

          {/* Right: Action Icons */}
          <div className={styles.navRight}>
            <div className={styles.actions}>



              {/* Account */}
              {mounted && (isLoggedIn ? (
                <Link href={isAdmin ? "/admin" : "/dashboard"} className={styles.actionItem} title="Account">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className={styles.actionText}>{user?.name?.split(' ')[0] || 'Account'}</span>
                </Link>
              ) : (
                <Link href="/login" className={styles.actionItem} title="Account">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className={styles.actionText}>Login</span>
                </Link>
              ))}

              {/* Notifications */}
              <div className={styles.notificationWrapper}>
                <div
                  className={styles.actionItem}
                  title="Notifications"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const newState = !showNotifications;
                    setShowNotifications(newState);
                    if (newState) {
                      // Mark all as read when opening
                      try {
                        await fetch('http://127.0.0.1:8000/api/notifications/read-all', { method: 'PUT' });
                        setNotificationCount(unreadMessages.length);
                        setSiteNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                      } catch (err) {
                        console.error("Error marking as read:", err);
                      }
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {mounted && isLoggedIn && notificationCount > 0 && (
                      <span className={styles.badge}>{notificationCount}</span>
                    )}
                  </div>
                  <span className={styles.actionText}>Alerts</span>
                </div>

                <AnimatePresence mode="wait">
                  {showNotifications && (
                    <motion.div
                      key="notifications-dropdown"
                      className={styles.notificationDropdown}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.dropdownContentWrapper}>
                        <div className={styles.dropdownHeader}>
                          <h4>Notifications & Updates</h4>
                          <span style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>{notificationCount} New</span>
                        </div>
                        <div className={styles.dropdownList}>
                          {/* Recently Added Section */}
                          {siteNotifications.filter(n => n.type === 'PRODUCT_ADD').length > 0 && (
                            <div className={styles.recentSection}>
                              <div className={styles.sectionTitle}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                Recently Added Rituals
                              </div>
                              {siteNotifications.filter(n => n.type === 'PRODUCT_ADD').map((n: any) => (
                                <Link
                                  key={n._id}
                                  href={n.link || '#'}
                                  className={`${styles.notificationItem} ${styles.recentItem} ${!n.isRead ? styles.unread : ''}`}
                                  onClick={() => setShowNotifications(false)}
                                >
                                  <div className={styles.recentContent}>
                                    {n.image && (
                                      <div className={styles.recentImageWrapper}>
                                        <img src={n.image} alt="" className={styles.recentImage} />
                                        {!n.isRead && <span className={styles.newPulse} />}
                                      </div>
                                    )}
                                    <div className={styles.recentInfo}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className={styles.recentTitle}>{n.title}</span>
                                        <span className={styles.newBadgeMini}>NEW</span>
                                      </div>
                                      <p className={styles.recentMessage}>{n.message}</p>
                                      <span className={styles.recentTime}>Recently added</span>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Other Site Notifications (non-product) */}
                          {siteNotifications.filter(n => n.type !== 'PRODUCT_ADD').length > 0 && (
                            <div className={styles.otherSection}>
                              {siteNotifications.filter(n => n.type !== 'PRODUCT_ADD').map((n: any) => (
                                <Link
                                  key={n._id}
                                  href={n.link || '#'}
                                  className={`${styles.notificationItem} ${!n.isRead ? styles.unread : ''}`}
                                  onClick={() => setShowNotifications(false)}
                                >
                                  <div className={styles.itemHeader}>
                                    <span className={styles.itemSubject}>{n.title}</span>
                                  </div>
                                  <p className={styles.itemMessage}>{n.message}</p>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Artisan Replies */}
                          {unreadMessages.length > 0 && (
                            <div className={styles.repliesSection}>
                              <div className={styles.sectionTitle}>Artisan Replies</div>
                              {unreadMessages.map((msg) => (
                                <Link
                                  key={msg._id || msg.id}
                                  href="/dashboard?tab=inquiries"
                                  className={styles.notificationItem}
                                  onClick={() => setShowNotifications(false)}
                                >
                                  <div className={styles.itemHeader}>
                                    <span className={styles.itemSubject}>{msg.subject}</span>
                                    <span className={styles.itemDate}>{msg.date ? msg.date.split(',')[0] : 'Today'}</span>
                                  </div>
                                  <p className={styles.itemMessage}>{msg.message}</p>
                                  <div className={styles.itemReply}>
                                    <strong>Reply:</strong> {msg.reply}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {siteNotifications.length === 0 && unreadMessages.length === 0 && (
                            <div className={styles.emptyNotifications}>No new updates or replies.</div>
                          )}
                        </div>
                        <div className={styles.dropdownFooter}>
                          <Link href="/dashboard?tab=inquiries" className={styles.viewAllBtn}>View All Inquiries</Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className={styles.actionItem} title="Wishlist">
                <div className={styles.iconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {mounted && wishlist.length > 0 && (
                    <span className={styles.badge}>{wishlist.length}</span>
                  )}
                </div>
                <span className={styles.actionText}>Wishlist</span>
              </Link>

              {/* Cart */}
              <button
                className={styles.cartButton}
                onClick={() => setIsCartOpen(true)}
                title="Cart"
                suppressHydrationWarning
              >
                <div className={styles.iconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {mounted && totalItems > 0 && (
                    <span className={styles.badge}>{totalItems}</span>
                  )}
                </div>
                <span className={styles.actionText}>Cart</span>
              </button>

              {/* Track Order */}
              <Link href="/track" className={styles.actionItem} title="Track Order">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span className={styles.actionText}>Track Order</span>
              </Link>

              {/* Mobile Menu Toggle (Moved here for better mobile layout) */}
              <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)} suppressHydrationWarning>
                {isMenuOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Bottom Bar - Categories / Links (Desktop) */}
        <div className={`${styles.bottomBar} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <div className={styles.mainLinks}>
            {navLinks.map((link) => (
              <div
                key={link.name}
                className={styles.navLinkWrapper}
                onMouseEnter={() => link.name === 'Shop' && handleMouseEnter(link.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.path}
                  className={`${styles.navLink} ${pathname === link.path || (link.path !== '/' && pathname.includes(link.path)) ? styles.active : ''} ${link.isSpecial ? styles.offersLink : ''}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveMenu(null);
                  }}
                >
                  {link.name}
                  {link.name === 'Shop' && (
                    <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeMenu === 'Shop' && (
              <motion.div
                key="megamenu-dropdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseEnter={() => handleMouseEnter('Shop')}
                onMouseLeave={handleMouseLeave}
              >
                <MegaMenu
                  isVisible={activeMenu === 'Shop'}
                  onClose={() => setActiveMenu(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      {/* Mobile Menu Integration */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navLinks={mobileNavLinks}
        isLoggedIn={isLoggedIn}
        user={user}
        logout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </>
  );
};

export default Navbar;
