'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PRODUCTS } from '@/constants/products';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProductDetail.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  
  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Ritual Not Found</h1>
        <Link href="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    addToCart(product as any);
  };

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className={styles.current}>{product.name}</span>
        </div>

        <div className={styles.grid}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <Image 
                src={product.image} 
                alt={product.name} 
                fill
                priority
                className={styles.image}
              />
              <div className={styles.badge}>{product.category}</div>
            </div>
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            <div className={styles.header}>
              <span className={styles.brand}>AURA NATURE & CRAFTS</span>
              <h1 className={styles.name}>{product.name}</h1>
              <div className={styles.price}>₹{product.price}</div>
            </div>

            <div className={styles.description}>
              <p>{product.fullDescription || product.description}</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.addBtn} onClick={handleAddToCart}>
                Add to Ritual Bag
              </button>
            </div>

            <div className={styles.details}>
              {product.ingredients && (
                <div className={styles.detailBlock}>
                  <h3>Ingredients</h3>
                  <div className={styles.tags}>
                    {product.ingredients.map(ing => (
                      <span key={ing} className={styles.tag}>{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              {product.benefits && (
                <div className={styles.detailBlock}>
                  <h3>Benefits</h3>
                  <ul className={styles.list}>
                    {product.benefits.map(ben => (
                      <li key={ben}>{ben}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.ritual && (
                <div className={styles.detailBlock}>
                  <h3>The Ritual</h3>
                  <p className={styles.ritualText}>{product.ritual}</p>
                </div>
              )}
            </div>
            
            <div className={styles.trustMarks}>
              <div className={styles.mark}>
                <span>100% Organic</span>
              </div>
              <div className={styles.mark}>
                <span>Cruelty Free</span>
              </div>
              <div className={styles.mark}>
                <span>Handmade</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Section */}
      <section className={styles.related}>
        <div className={styles.container}>
          <h2 className={styles.relatedTitle}>You May Also Like</h2>
          <div className={styles.relatedGrid}>
            {PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map(p => (
              <Link href={`/shop/product/${p.id}`} key={p.id} className={styles.relatedCard}>
                <div className={styles.relatedImage}>
                  <Image src={p.image} alt={p.name} fill />
                </div>
                <h3>{p.name}</h3>
                <span>₹{p.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProductDetailPage;
