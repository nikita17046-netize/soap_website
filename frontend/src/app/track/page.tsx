'use client';

import React, { useState } from 'react';
import styles from './Track.module.css';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrderData(null);
    setIsSearching(true);

    // Simulate API search with localStorage
    setTimeout(() => {
      const allOrders = JSON.parse(localStorage.getItem('aura-orders') || '[]');
      // Search by ID (handles both with and without #)
      const cleanId = orderId.replace('#', '');
      const foundOrder = allOrders.find((o: any) => o.id === cleanId);

      if (foundOrder) {
        setOrderData(foundOrder);
      } else {
        setError('We could not find a ritual with this Order ID. Please check and try again.');
      }
      setIsSearching(false);
    }, 1200);
  };

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'shipped': return styles.statusShipped;
      case 'delivered': return styles.statusDelivered;
      default: return styles.statusPending;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.backgroundElement}></div>
      
      <div className={styles.contentWrapper}>
        <div className={`${styles.header} animate-up`}>
          <h1>Track Your <br/>Ritual</h1>
          <p>Enter your Order ID to follow your botanical journey from our atelier to your doorstep.</p>
        </div>

        <div className={`${styles.glassCard} animate-up`} style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleTrack} className={styles.searchBox}>
            <div className={styles.inputGroup}>
              <label>Ritual Order ID</label>
              <div className={styles.inputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. 1714987654" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className={styles.trackBtn} disabled={isSearching}>
              {isSearching ? 'Locating Ritual...' : 'Track Journey'}
            </button>
          </form>

          {error && <div className={styles.errorBox}>{error}</div>}

          {orderData && (
            <div className={`${styles.resultSection} animate-fade-in`}>
              <div className={styles.statusHeader}>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display', margin: 0 }}>Order #{orderData.id}</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '5px 0 0' }}>Placed on {orderData.date}</p>
                </div>
                <div className={`${styles.statusBadge} ${getStatusClass(orderData.status)}`}>
                  {orderData.status || 'Preparing'}
                </div>
              </div>

              <div className={styles.timeline}>
                <div className={`${styles.timelineItem} ${orderData.status ? styles.active : styles.active}`}>
                  <div className={styles.dot}></div>
                  <div className={styles.timelineContent}>
                    <h4>Ritual Confirmed</h4>
                    <p>Your selection has been registered in our atelier.</p>
                  </div>
                </div>
                
                <div className={`${styles.timelineItem} ${['Shipped', 'Delivered'].includes(orderData.status) ? styles.active : ''}`}>
                  <div className={styles.dot}></div>
                  <div className={styles.timelineContent}>
                    <h4>Artisanal Packaging</h4>
                    <p>Each item is being carefully wrapped for transit.</p>
                  </div>
                </div>

                <div className={`${styles.timelineItem} ${orderData.status === 'Shipped' ? styles.active : (orderData.status === 'Delivered' ? styles.active : '')}`}>
                  <div className={styles.dot}></div>
                  <div className={styles.timelineContent}>
                    <h4>In Transit</h4>
                    <p>Your botanical treasures are on their way to you.</p>
                  </div>
                </div>

                <div className={`${styles.timelineItem} ${orderData.status === 'Delivered' ? styles.active : ''}`}>
                  <div className={styles.dot}></div>
                  <div className={styles.timelineContent}>
                    <h4>Delivered</h4>
                    <p>Your ritual has arrived at its destination.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
