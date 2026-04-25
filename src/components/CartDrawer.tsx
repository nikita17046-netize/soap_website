'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Shopping Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}>&times;</button>
        </div>

        <div className={styles.content}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty.</p>
              <button onClick={() => setIsCartOpen(false)} className={styles.shopBtn}>Start Shopping</button>
            </div>
          ) : (
            <div className={styles.items}>
              {cart.map((item) => (
                <div key={item.id} className={`${styles.item} ${item.isOffer ? styles.offerItem : ''}`}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="100px"
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemNameWrapper}>
                      <h3>{item.name}</h3>
                      {item.isOffer && <span className={styles.offerBadge}>{item.offerLabel} Applied</span>}
                    </div>
                    <p className={styles.itemPrice}>₹{item.price}</p>
                    <div className={styles.quantity}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default CartDrawer;
