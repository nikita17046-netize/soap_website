'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart, Product } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PRODUCTS, Product as ProductType } from '@/constants/products';
import styles from './ProductGrid.module.css';

const OFFER_PRODUCTS: Record<string, { ids: number[], discountType: string, customPrice?: number }> = {
  'AURA15': { ids: [1, 6, 10], discountType: '15% OFF' },
  'BUNDLE': { ids: [2, 4, 5], discountType: 'BUY 2 GET 1 FREE (Price Adjusted)' },
  'RITUAL': { ids: [7, 14, 20], discountType: 'SEASONAL FLAT PRICE', customPrice: 299 }
};

const OFFER_NAMES: Record<string, string> = {
  'AURA15': 'First Ritual',
  'BUNDLE': 'The Trio Bundle',
  'RITUAL': 'Seasonal Ritual'
};

interface ProductGridProps {
  limit?: number;
  showFilters?: boolean;
}

const ProductGrid = ({ limit, showFilters = true }: ProductGridProps) => {
  const { addToCart, searchQuery, setSearchQuery } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redeemCode = searchParams.get('redeem');
  
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('featured');

  // Handle URL search parameter
  React.useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams, setSearchQuery]);

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (redeemCode) {
      // If an offer is active, tag the product with the offer info
      const offerLabel = redeemCode === 'AURA15' ? '15% OFF' : 
                         redeemCode === 'BUNDLE' ? 'BUNDLE DEAL' : 
                         redeemCode === 'RITUAL' ? '20% OFF' : 'OFFER';
      
      addToCart({
        ...product,
        isOffer: true,
        offerLabel: offerLabel
      });
    } else {
      addToCart(product);
    }
  };

  let filteredProducts = PRODUCTS;
  let currentOffer = redeemCode ? OFFER_PRODUCTS[redeemCode] : null;

  // Filter and Apply Special Offer Prices
  if (redeemCode && currentOffer) {
    filteredProducts = PRODUCTS
      .filter(p => currentOffer!.ids.includes(p.id))
      .map(p => {
        let newPrice = p.price;
        if (redeemCode === 'AURA15') newPrice = Math.round(p.price * 0.85);
        if (redeemCode === 'BUNDLE') newPrice = Math.round(p.price * 0.67); // Effectively 1 free out of 3
        if (redeemCode === 'RITUAL') newPrice = currentOffer!.customPrice || p.price;
        return { ...p, price: newPrice, originalPrice: p.price };
      });
  } else {
    // Normal filtering
    filteredProducts = PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }


  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  // Apply limit if provided
  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  return (
    <section id="shop" className={styles.section}>
      <div className={styles.container}>
        {limit && (
          <div className={styles.header}>
            <h2 className={styles.title}>
              Featured Collection
            </h2>
            <p className={styles.subtitle}>Purely natural, ethically sourced.</p>
          </div>
        )}

        {/* Offer Applied Banner */}
        {redeemCode && currentOffer && (
          <div className={`${styles.offerBanner} reveal`}>
            <div className={styles.bannerInfo}>
              <span className={styles.bannerTag}>{currentOffer.discountType} APPLIED</span>
              <h2 className={styles.bannerTitle}>{OFFER_NAMES[redeemCode]}</h2>
              <p className={styles.bannerDesc}>Enjoy exclusive pricing for this curated selection.</p>
            </div>
            <Link href="/shop" className="btn-secondary" style={{ padding: '12px 30px' }}>
              Reset Filters
            </Link>
          </div>
        )}

        {/* Filters and Sorting (Only show if enabled and not in limited mode and NOT in redeem mode) */}

        {showFilters && !limit && !redeemCode && (
          <div className={styles.filterBar}>
            <div className={styles.categories}>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat as string)}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className={styles.sortWrapper}>
              <select 
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}
        
        <div className={styles.grid}>
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <Link 
                href={`/shop/product/${product.id}`} 
                key={product.id} 
                className={`${styles.card} ${redeemCode ? styles.offerCard : ''} card-premium animate-up`}
              >
                <div className={styles.imageWrapper}>
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    width={400} 
                    height={redeemCode ? 350 : 500} 
                    className={styles.image}
                  />
                  <div className={styles.categoryBadge}>{product.category}</div>
                  {redeemCode && <div className={styles.offerBadge}>SPECIAL OFFER</div>}
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <div className={styles.footer}>
                    <div className={styles.priceContainer}>
                      {(product as any).originalPrice && (
                        <span className={styles.originalPrice}>₹{(product as any).originalPrice}</span>
                      )}
                      <span className={`${styles.price} ${redeemCode ? styles.highlightPrice : ''}`}>₹{product.price}</span>
                    </div>
                    <button 
                      className="btn-primary"
                      onClick={(e) => handleAddToCart(e, product)}
                      suppressHydrationWarning
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>✧</span>
              <h3 className={styles.noResultsTitle}>No Rituals Found</h3>
              <p className={styles.noResultsText}>
                We couldn't find any products matching "{searchQuery}". <br />
                Try adjusting your search or explore our curated categories.
              </p>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* View All Button for Homepage */}
        {limit && PRODUCTS.length > limit && (
          <div className={styles.viewAllWrapper}>
            <Link href="/shop" className="btn-secondary">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};



export default ProductGrid;
