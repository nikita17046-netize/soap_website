'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Dashboard.module.css';

const DashboardPage = () => {
  const { user, isLoggedIn, logout, isLoading, isAdmin } = useAuth();
  const { wishlist } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [userReplyText, setUserReplyText] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const handleUserReply = async (id: string) => {
    const text = userReplyText[id];
    if (!text?.trim()) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/messages/${id}/user-reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        setUserReplyText(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        // Refresh inquiries
        const updatedRes = await fetch(`http://127.0.0.1:8000/api/messages/user/${user?.email}?t=${Date.now()}`);
        if (updatedRes.ok) setInquiries(await updatedRes.json());
      }
    } catch (err) {
      console.error('Error sending user follow-up:', err);
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Protect the route and fetch orders
  React.useEffect(() => {
    if (isLoading) return; // Wait for auth to initialize
    
    if (!isLoggedIn) {
      router.push('/login');
    } else if (isAdmin) {
      router.push('/admin');
    } else {
      const fetchUserData = async () => {
        try {
          // Fetch Orders from localStorage (existing logic)
          const allOrders = JSON.parse(localStorage.getItem('aura-orders') || '[]');
          const userOrders = allOrders.filter((o: any) => o.userEmail === user?.email);
          setOrders(userOrders);

          // Fetch Inquiries from API
          const res = await fetch(`http://127.0.0.1:8000/api/messages/user/${user?.email}?t=${Date.now()}`);
          if (res.ok) {
            const data = await res.json();
            setInquiries(data);
          } else {
            // Fallback
            const allMessages = JSON.parse(localStorage.getItem('aura-messages') || '[]');
            const userInquiries = allMessages.filter((m: any) => m.email === user?.email);
            setInquiries(userInquiries);
          }
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
        }
      };

      fetchUserData();
    }
  }, [isLoggedIn, isAdmin, router, user, isLoading]);

  // Mark inquiries as seen when tab is active
  React.useEffect(() => {
    if (activeTab === 'inquiries' && inquiries.length > 0) {
      const anyUnseen = inquiries.some(m => m.reply && !m.userSeen);
      if (anyUnseen) {
        const allMessages = JSON.parse(localStorage.getItem('aura-messages') || '[]');
        const updatedMessages = allMessages.map((m: any) => 
          (m.email === user?.email && m.reply) ? { ...m, userSeen: true } : m
        );
        localStorage.setItem('aura-messages', JSON.stringify(updatedMessages));
        // Update local state to reflect change and trigger Navbar update via storage event if needed
        setInquiries(userInquiries => userInquiries.map((m: any) => ({ ...m, userSeen: true })));
        // Dispatch event for Navbar
        window.dispatchEvent(new Event('storage'));
      }
    }
  }, [activeTab, inquiries, user?.email]);

  const toggleOrderDetails = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (isLoading || !mounted) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontStyle: 'italic', opacity: 0.5 }}>Restoring Ritual Session...</p>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.userInitial}>{user?.name?.charAt(0)}</div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            My Orders
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'inquiries' ? styles.active : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            My Inquiries
          </button>
          
          {isAdmin && (
            <button 
              className={styles.adminLink}
              onClick={() => router.push('/admin')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Admin Panel
            </button>
          )}
        </nav>
        
        <Link href="/" className={styles.backBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Back to Website
        </Link>
        
        <button className={styles.logoutBtn} onClick={logout}>
          Sign Out
        </button>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <h1>
            {activeTab === 'overview' && 'Dashboard'}
            {activeTab === 'orders' && 'My Orders'}
            {activeTab === 'settings' && 'Account Settings'}
            {activeTab === 'inquiries' && 'My Inquiries'}
          </h1>
          <p>Welcome back to your Private Ritual experience.</p>
        </header>

        <div className={styles.tabContent}>
          {mounted && (
            <>
              {activeTab === 'overview' && (
                <>
                  <div className={styles.overviewGrid}>
                    <div className={styles.statsCard}>
                      <div className={styles.statsIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </div>
                      <div className={styles.statsInfo}>
                        <span>Completed Rituals</span>
                        <h2>{orders.length}</h2>
                      </div>
                    </div>
                    <div className={styles.statsCard}>
                      <div className={styles.statsIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <div className={styles.statsInfo}>
                        <span>Total Investment</span>
                        <h2>₹{orders.reduce((sum, o) => sum + (o.total || 0), 0)}</h2>
                      </div>
                    </div>
                    <div className={styles.statsCard}>
                      <div className={styles.statsIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </div>
                      <div className={styles.statsInfo}>
                        <span>Saved Rituals</span>
                        <h2>{wishlist.length}</h2>
                      </div>
                    </div>
                  </div>

                  {/* Loyalty Tier Progress */}
                  <div className={styles.loyaltySection}>
                    <div className={styles.loyaltyHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className={styles.tierIcon}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Artisan Loyalty Tier</h3>
                      </div>
                      <span className={styles.tierStatus}>{orders.length >= 5 ? 'Gold Patron' : 'Artisan Enthusiast'}</span>
                    </div>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar} style={{ width: `${Math.min((orders.length / 10) * 100, 100)}%` }}></div>
                    </div>
                    <p className={styles.loyaltyHint}>
                      {orders.length < 10 
                        ? `You are ${10 - orders.length} rituals away from unlocking "Jade Collector" benefits.` 
                        : "You have reached the pinnacle of SaptAroma loyalty."}
                    </p>
                  </div>

                  <div className={styles.infoSection}>
                    <div className={styles.infoCard} style={{ border: '1px solid #fbbf24', background: 'rgba(251, 191, 36, 0.02)' }}>
                      <h3>Ritual Recommendations</h3>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                        <div className={styles.recItem}>
                          <div className={styles.recImg} style={{ background: '#f8fafc' }}>🌿</div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>Botanical Bliss</span>
                        </div>
                        <div className={styles.recItem}>
                          <div className={styles.recImg} style={{ background: '#fdf2f8' }}>🌸</div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>Rose Ritual</span>
                        </div>
                      </div>
                      <p style={{ marginTop: '15px' }}>Based on your love for earthy scents, we suggest exploring the "Forest Series".</p>
                    </div>
                    <div className={styles.infoCard}>
                      <h3>Account Security</h3>
                      <div className={styles.securityStatus}>
                        <span className={styles.statusDot}></span>
                        Account Verified
                      </div>
                      <p>Your Private Ritual data is protected with end-to-end encryption.</p>
                    </div>
                  </div>
                  
                  <div className={styles.recentActivity}>
                    <div className={styles.sectionHeader}>
                      <h3>Recent Activity</h3>
                      <button onClick={() => setActiveTab('orders')}>View All</button>
                    </div>
                    {orders.length > 0 ? (
                      <div className={styles.ordersCompact}>
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className={styles.orderItemCompact}>
                            <div className={styles.orderInfo}>
                              <span className={styles.orderId}>#{order.id}</span>
                              <span className={styles.orderDate}>{order.date}</span>
                            </div>
                            <div className={styles.orderStatus}>Preparing</div>
                            <div className={styles.orderTotal}>₹{order.total}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <p>No recent ritual orders found.</p>
                      </div>
                    )}
                  </div>
                </>
              )}

          {activeTab === 'orders' && (
            <div className={styles.ordersList}>
              {orders.length > 0 ? (
                <div className={styles.fullOrdersGrid}>
                  {orders.map((order) => (
                    <div key={order.id} className={`${styles.orderCard} ${expandedOrderId === order.id ? styles.expanded : ''}`}>
                      <div className={styles.orderCardHeader}>
                        <div>
                          <span className={styles.orderLabel}>Order ID</span>
                          <h4>#{order.id}</h4>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className={styles.orderLabel}>Placed On</span>
                          <p>{order.date}</p>
                        </div>
                      </div>
                      <div className={styles.orderCardBody}>
                        <div className={styles.orderItems}>
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className={styles.orderSubItem}>
                              {item.name} <span>x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        
                        {expandedOrderId === order.id && (
                          <div className={`${styles.detailedInfo} animate-fade-in`}>
                            <div className={styles.infoGrid}>
                              <div className={styles.infoBlock}>
                                <span className={styles.orderLabel}>Recipient</span>
                                <p>{order.shippingInfo?.fullName || 'Valued Customer'}</p>
                              </div>
                              <div className={styles.infoBlock}>
                                <span className={styles.orderLabel}>Contact Detail</span>
                                <p>{order.shippingInfo?.email || user?.email || 'N/A'}</p>
                              </div>
                              <div className={styles.infoBlockFull}>
                                <span className={styles.orderLabel}>Shipping Destination</span>
                                <p>{order.shippingInfo?.address || 'Standard Delivery Ritual'}</p>
                              </div>
                              <div className={styles.infoBlock}>
                                <span className={styles.orderLabel}>Payment Method</span>
                                <p>{order.shippingInfo?.paymentMethod?.toUpperCase() || 'COD'}</p>
                              </div>
                              <div className={styles.infoBlock}>
                                <span className={styles.orderLabel}>Contact Number</span>
                                <p>{order.shippingInfo?.phone || 'Not Provided'}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className={styles.orderFooter}>
                          <div className={styles.footerLeft}>
                            <div className={styles.orderStatusTag}>Ritual in Progress</div>
                            <div className={styles.orderPrice}>₹{order.total}</div>
                          </div>
                          <button 
                            className={styles.detailsBtn}
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            {expandedOrderId === order.id ? 'Show Less' : 'View More Details'}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedOrderId === order.id ? 'rotate(180deg)' : 'none' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => router.push('/shop')} className={styles.actionBtn}>Explore Collection</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsForm}>
              <div className={styles.formGroup}>
                <label>Display Name</label>
                <input type="text" defaultValue={user?.name} />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input type="email" defaultValue={user?.email} disabled />
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 00000 00000" />
              </div>
              <button className={styles.saveBtn}>Update Profile</button>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className={styles.inquiriesList}>
              {inquiries.length > 0 ? (
                <div className={styles.fullOrdersGrid}>
                  {inquiries.map((inquiry) => (
                    <div key={inquiry._id || inquiry.id} className={styles.orderCard} style={{ padding: '25px' }}>
                      <div className={styles.orderCardHeader} style={{ marginBottom: '15px' }}>
                        <div>
                          <span className={styles.orderLabel}>Subject</span>
                          <h4 style={{ color: 'var(--accent-secondary)' }}>{inquiry.subject}</h4>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className={styles.orderLabel}>Sent On</span>
                          <p style={{ fontSize: '0.85rem' }}>{inquiry.date}</p>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '20px' }}>
                        <span className={styles.orderLabel}>Your Message</span>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '5px' }}>{inquiry.message}</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                        {inquiry.reply && inquiry.reply.split('|NEXT|').map((r: string, idx: number) => {
                          const isAdmin = r.startsWith('ADMIN:');
                          const cleanText = r.replace(/^(ADMIN:|USER:)\s*/, '');
                          
                          return (
                            <div 
                              key={idx} 
                              className="animate-fade-in" 
                              style={{ 
                                background: isAdmin ? 'rgba(156, 126, 93, 0.05)' : 'var(--bg-secondary)', 
                                padding: '15px 20px', 
                                borderRadius: '15px', 
                                borderLeft: isAdmin ? '4px solid var(--accent-secondary)' : '1px solid rgba(0,0,0,0.05)',
                                alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                                maxWidth: '90%',
                                position: 'relative'
                              }}
                            >
                              <span className={styles.orderLabel} style={{ 
                                color: isAdmin ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                                fontSize: '0.65rem',
                                marginBottom: '5px',
                                display: 'block'
                              }}>
                                {isAdmin ? 'Artisan Response' : 'Your Follow-up'}
                              </span>
                              <p style={{ 
                                fontSize: '0.9rem', 
                                color: 'var(--text-primary)', 
                                fontWeight: isAdmin ? '500' : '400',
                                fontStyle: isAdmin ? 'italic' : 'normal'
                              }}>
                                {cleanText}
                              </p>
                            </div>
                          );
                        })}
                        
                        {/* User Reply Toggle */}
                        <div style={{ marginTop: '15px' }}>
                          {activeReplyId !== inquiry._id ? (
                            <button 
                              onClick={() => setActiveReplyId(inquiry._id)}
                              style={{
                                background: 'transparent',
                                border: '1px solid var(--accent-secondary)',
                                color: 'var(--accent-secondary)',
                                padding: '10px 20px',
                                borderRadius: '50px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(156, 126, 93, 0.05)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                              Reply to Artisan
                            </button>
                          ) : (
                            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <textarea
                                placeholder="Share your thoughts with our artisans..."
                                style={{
                                  width: '100%',
                                  padding: '18px',
                                  borderRadius: '16px',
                                  border: '1px solid var(--accent-secondary)',
                                  background: 'var(--bg-primary)',
                                  color: 'var(--text-primary)',
                                  fontFamily: 'Outfit, sans-serif',
                                  fontSize: '0.95rem',
                                  minHeight: '100px',
                                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                  outline: 'none',
                                  resize: 'none'
                                }}
                                value={userReplyText[inquiry._id] || ''}
                                onChange={(e) => setUserReplyText({ ...userReplyText, [inquiry._id]: e.target.value })}
                              ></textarea>
                              <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
                                <button 
                                  onClick={() => setActiveReplyId(null)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    padding: '10px 20px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                                <button 
                                  className={styles.saveBtn}
                                  style={{ 
                                    padding: '12px 30px', 
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, #1a1a1a 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                  }}
                                  onClick={async () => {
                                    await handleUserReply(inquiry._id);
                                    setActiveReplyId(null);
                                  }}
                                >
                                  Send Message
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {!inquiry.reply && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', opacity: 0.7 }}>
                          Waiting for artisan response...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p>You haven't sent any inquiries yet.</p>
                  <button onClick={() => router.push('/contact')} className={styles.actionBtn}>Contact Us</button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  </div>
</div>
  );
};

export default DashboardPage;
