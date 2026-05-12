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
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeImage, setActiveImage] = React.useState(0);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          // Fallback to static data
          const staticProd = PRODUCTS.find(p => p.id === Number(id));
          setProduct(staticProd);
        }
      } catch (err) {
        const staticProd = PRODUCTS.find(p => p.id === Number(id));
        setProduct(staticProd);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading Ritual...</div>;
  if (!product) return (
    <div className={styles.notFound}>
      <h1>Ritual Not Found</h1>
      <Link href="/shop" className="btn-primary">Return to Shop</Link>
    </div>
  );

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    addToCart({
      ...product,
      id: product._id || product.id
    } as any);
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
              src={product.images?.[activeImage] || product.image || '/soap-1.png'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className={styles.image}
            />
            <div className={styles.badge}>{product.category}</div>
          </div>

          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className={styles.gallery}>
              {product.images.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className={`${styles.galleryThumb} ${activeImage === idx ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <span className={styles.brand}>AURA NATURE & CRAFTS</span>
            <h1 className={styles.name}>{product.name}</h1>
            <div className={styles.priceContainer}>
              {product.originalPrice && (
                <span className={styles.oldPrice}>₹{product.originalPrice}</span>
              )}
              <span className={styles.newPrice}>₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && !product.offerLabel && (
                <span className={styles.discountBadge}>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
              {product.offerLabel && (
                <span className={styles.discountBadge}>
                  {product.offerLabel}
                </span>
              )}
            </div>
          </div>

          <div className={styles.description}>
            <p>{product.fullDescription || product.description}</p>
          </div>

          <div className={styles.actions}>
            <button className={styles.addBtn} onClick={handleAddToCart}>
              Add to Ritual Bag
            </button>
            <button
              className={styles.wishlistIconBtn}
              onClick={() => toggleWishlist(product._id || product.id)}
              title="Add to Wishlist"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isInWishlist(product._id || product.id) ? "var(--accent-secondary)" : "none"} stroke={isInWishlist(product._id || product.id) ? "var(--accent-secondary)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <div className={styles.details}>
            {/* Description Fallback */}
            {(!product.fullDescription && !product.description) && (
              <p style={{ opacity: 0.5, fontStyle: 'italic' }}>No detailed description provided for this ritual.</p>
            )}

            {(product.ingredients && product.ingredients.trim().length > 0) && (
              <div className={styles.detailBlock}>
                <h3>Ingredients</h3>
                <div className={styles.tags}>
                  {Array.isArray(product.ingredients) ? (
                    product.ingredients.map(ing => (
                      <span key={ing} className={styles.tag}>{ing}</span>
                    ))
                  ) : (
                    product.ingredients.split(',').map((ing: string) => (
                      <span key={ing.trim()} className={styles.tag}>{ing.trim()}</span>
                    ))
                  )}
                </div>
              </div>
            )}

            {(product.benefits && product.benefits.trim().length > 0) && (
              <div className={styles.detailBlock}>
                <h3>Benefits</h3>
                <ul className={styles.list}>
                  {Array.isArray(product.benefits) ? (
                    product.benefits.map(ben => (
                      <li key={ben}>{ben}</li>
                    ))
                  ) : (
                    product.benefits.split(',').map((ben: string) => (
                      <li key={ben.trim()}>{ben.trim()}</li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {(product.ritual && product.ritual.trim().length > 0) && (
              <div className={styles.detailBlock}>
                <h3>The Ritual</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  {product.ritual}
                </p>
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
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" />
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
