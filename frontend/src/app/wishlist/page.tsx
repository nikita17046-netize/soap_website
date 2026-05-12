'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/constants/products';
import styles from './Wishlist.module.css';

const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [mounted, setMounted] = React.useState(false);
  const [dbProducts, setDbProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/products');
        if (res.ok) setDbProducts(await res.json());
      } catch (err) {
        console.warn('Backend products unavailable in wishlist.');
      }
    };
    fetchProducts();
  }, []);

  if (!mounted) return null;

  const allProducts = [...PRODUCTS, ...dbProducts];
  const wishlistProducts = allProducts.filter(p => wishlist.includes(p._id || p.id));

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Your Private Collection</h1>
        <p>Curated rituals you've saved for later.</p>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className={styles.list}>
          {wishlistProducts.map((product) => (
            <div key={product._id || product.id} className={`${styles.listItem} animate-up`}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={product.images?.[0] || product.image || '/soap-1.png'} 
                  alt={product.name} 
                  fill
                  sizes="120px"
                  className={styles.image}
                />
              </div>
              
              <div className={styles.info}>
                <span className={styles.categoryBadge}>{product.category}</span>
                <Link href={`/shop/product/${product._id || product.id}`} className={styles.nameLink}>
                  <h3 className={styles.name}>{product.name}</h3>
                </Link>
                <span className={styles.price}>₹{product.price}</span>
              </div>

              <div className={styles.actions}>
                <button 
                  className={styles.addToCartBtn}
                  onClick={() => addToCart(product)}
                >
                  Move to Cart
                </button>
                <button 
                  className={styles.wishlistBtn}
                  onClick={(e) => { e.preventDefault(); toggleWishlist(product._id || product.id); }}
                  title="Remove from Wishlist"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h2>Your Collection is Empty</h2>
          <p>You haven't liked any products yet. Explore our rituals and find your favorites.</p>
          <Link href="/shop" className="btn-primary" style={{ marginTop: '20px' }}>
            Discover Rituals
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
