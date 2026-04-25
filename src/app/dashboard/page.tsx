'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

const DashboardPage = () => {
  const { user, isLoggedIn, logout, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Protect the route and fetch orders
  React.useEffect(() => {
    if (isLoading) return; // Wait for auth to initialize
    
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      const allOrders = JSON.parse(localStorage.getItem('aura-orders') || '[]');
      const userOrders = allOrders.filter((o: any) => o.userEmail === user?.email);
      setOrders(userOrders);
    }
  }, [isLoggedIn, router, user, isLoading]);

  const toggleOrderDetails = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (isLoading) {
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
        </nav>
        
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
          </h1>
          <p>Welcome back to your Private Ritual experience.</p>
        </header>

        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewGrid}>
              <div className={styles.statsCard}>
                <span>Total Orders</span>
                <h2>{orders.length}</h2>
              </div>
              <div className={styles.statsCard}>
                <span>Loyalty Points</span>
                <h2>{150 + (orders.length * 50)}</h2>
              </div>
              <div className={styles.statsCard}>
                <span>Wishlist Items</span>
                <h2>4</h2>
              </div>
              
              <div className={styles.recentActivity}>
                <h3>Recent Activity</h3>
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
            </div>
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
                                <p>{order.shippingInfo?.fullName || 'Guest User'}</p>
                              </div>
                              <div className={styles.infoBlock}>
                                <span className={styles.orderLabel}>Contact</span>
                                <p>{order.shippingInfo?.email}</p>
                              </div>
                              <div className={styles.infoBlockFull}>
                                <span className={styles.orderLabel}>Shipping Destination</span>
                                <p>{order.shippingInfo?.address || 'No address provided'}</p>
                              </div>
                              <div className={styles.infoBlock}>
                                <span className={styles.orderLabel}>Payment Method</span>
                                <p>{order.shippingInfo?.paymentMethod || 'COD'}</p>
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
