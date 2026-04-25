'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './checkout.module.css';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [isOrdered, setIsOrdered] = React.useState(false);

  // Protect the route
  React.useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const shippingInfo = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      address: formData.get('address'),
      paymentMethod: 'Cash on Delivery'
    };

    // Save order to history
    const orderData = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      total: totalPrice,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      userEmail: user?.email || 'guest',
      shippingInfo
    };

    const existingOrders = JSON.parse(localStorage.getItem('aura-orders') || '[]');
    existingOrders.unshift(orderData); // Add to beginning
    localStorage.setItem('aura-orders', JSON.stringify(existingOrders));

    setIsOrdered(true);
    clearCart();
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontStyle: 'italic', opacity: 0.5 }}>Restoring Ritual Session...</p>
      </div>
    );
  }

  if (isOrdered) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.crackersLeft}>
          {[...Array(12)].map((_, i) => <span key={i} className={styles.particle}></span>)}
        </div>
        <div className={styles.crackersRight}>
          {[...Array(12)].map((_, i) => <span key={i} className={styles.particle}></span>)}
        </div>
        
        <div className={`${styles.successCard} animate-up`}>
          <div className={styles.successIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Order Successful!</h1>
          <p>Thank you for choosing AURA. Your botanical ritual is being prepared for its journey.</p>
          <Link href="/" className="btn-primary" style={{ marginTop: '40px', display: 'inline-block' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Your Ritual Bag is Empty</h2>
        <p>Explore our artisanal collection to begin your journey.</p>
        <Link href="/shop" className="btn-primary" style={{ marginTop: '20px' }}>
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>The Checkout</h1>
        
        <div className={styles.layout}>
          {/* Shipping Form */}
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Shipping Information
              </h3>
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input type="text" name="fullName" required placeholder="John Doe" defaultValue={user?.name || ''} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input type="email" name="email" required placeholder="john@example.com" defaultValue={user?.email || ''} />
                </div>
                <div className={styles.inputGroupFull}>
                  <label>Shipping Address</label>
                  <textarea name="address" required placeholder="Where should we send your ritual? (Street, City, State, ZIP)"></textarea>
                </div>
              </div>

              <h3 style={{ marginTop: '40px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Payment Method
              </h3>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentOption}>
                  <input type="radio" name="payment" defaultChecked />
                  <span>Cash on Delivery</span>
                </label>
                <label className={styles.paymentOption}>
                  <input type="radio" name="payment" disabled />
                  <span>Online Payment (Coming Soon)</span>
                </label>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '50px', padding: '22px' }}>
                Finalize Ritual (₹{totalPrice})
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className={styles.summarySection}>
            <div className={styles.card}>
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Order Summary
              </h3>
              <div className={styles.itemList}>
                {cart.map((item) => (
                  <div key={item.id} className={`${styles.item} ${item.isOffer ? styles.offerItem : ''}`}>
                    <div className={styles.itemName}>
                      <div className={styles.nameHeader}>
                        {item.name} <span>{item.quantity}</span>
                      </div>
                      {item.isOffer && <span className={styles.itemOfferBadge}>{item.offerLabel} Applied</span>}
                      {item.offerLabel === 'BUNDLE DEAL' && (
                        <div className={styles.giftNote}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          + Complimentary Lotus Dish Included
                        </div>
                      )}
                    </div>
                    <div className={styles.itemPrice}>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              <div className={styles.totalRow}>
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
