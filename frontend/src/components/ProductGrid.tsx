'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart, Product } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PRODUCTS } from '@/constants/products';
import styles from './ProductGrid.module.css';

const API_URL = 'http://127.0.0.1:8000/api';

const OFFER_PRODUCTS: Record<string, { ids: number[], discountType: string, customPrice?: number }> = {
  'AURA15': { ids: [1, 2, 4], discountType: '15% OFF' },
  'BUNDLE': { ids: [14, 15, 16], discountType: 'BUY 2 GET 1 FREE (Price Adjusted)' },
  'RITUAL': { ids: [8, 9, 13], discountType: 'SEASONAL FLAT PRICE', customPrice: 299 }
};

const OFFER_NAMES: Record<string, string> = {
  'AURA15': 'First Ritual',
  'BUNDLE': 'The Trio Bundle',
  'RITUAL': 'Seasonal Ritual'
};

interface ProductGridProps {
  limit?: number;
  showFilters?: boolean;
  filterType?: 'all' | 'new' | 'offers';
}

const ProductGrid = ({ limit, showFilters = true, filterType = 'all' }: ProductGridProps) => {
  const { addToCart, searchQuery, setSearchQuery, toggleWishlist, isInWishlist } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redeemCode = searchParams.get('redeem');
  
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('featured');
  const [mounted, setMounted] = React.useState(false);
  const [dbProducts, setDbProducts] = React.useState<any[]>([]);


  // Handle URL search parameter and fetch backend products
  React.useEffect(() => {
    setMounted(true);
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (res.ok) setDbProducts(await res.json());
      } catch (err) {
        console.warn('Backend products unavailable, using fallback collection.');
      }
    };
    fetchProducts();
  }, [searchParams, setSearchQuery]);

  const allAvailableProducts = dbProducts.length > 0 ? dbProducts : PRODUCTS;
  const categories = ['All', ...Array.from(new Set(allAvailableProducts.map(p => p.category)))];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (redeemCode) {
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

  const handleWishlistClick = (e: React.MouseEvent, productId: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  let filteredProducts = allAvailableProducts;
  let currentOffer = redeemCode ? OFFER_PRODUCTS[redeemCode] : null;

  if (redeemCode && currentOffer) {
    filteredProducts = allAvailableProducts
      .filter(p => currentOffer!.ids.includes(p.id))
      .map(p => {
        let newPrice = p.price;
        if (redeemCode === 'AURA15') newPrice = Math.round(p.price * 0.85);
        if (redeemCode === 'BUNDLE') newPrice = Math.round(p.price * 0.67);
        if (redeemCode === 'RITUAL') newPrice = currentOffer!.customPrice || p.price;
        return { ...p, price: newPrice, originalPrice: p.price };
      });
  } else {
    filteredProducts = allAvailableProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'new' && (product.isNew || true)) || // Logic below handles 'new' sorting
                           (filterType === 'offers' && product.isOffer);
      
      return matchesSearch && matchesCategory && matchesFilter;
    });
  }

  // Special handling for 'new' filter - sort by creation date
  if (filterType === 'new') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (dateB !== dateA) return dateB - dateA;
      return (b._id || b.id) > (a._id || a.id) ? 1 : -1;
    });
  }


  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

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

        {showFilters && !limit && mounted && !redeemCode && (
          <div className={styles.filterBar}>
            <div className={styles.categories}>
              {categories.map(cat => (
                <button 
                  key={cat as string}
                  className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat as string)}
                  suppressHydrationWarning
                >
                  {cat as string}
                </button>
              ))}
            </div>
            
            <div className={styles.sortWrapper}>
              <select 
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                suppressHydrationWarning
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
                href={`/shop/product/${product._id || product.id}`} 
                key={product._id || product.id} 
                className={`${styles.card} ${redeemCode ? styles.offerCard : ''} card-premium animate-up`}
              >
                <div className={styles.imageWrapper}>
                  <Image 
                    src={product.images?.[0] || product.image || '/soap-1.png'} 
                    alt={product.name} 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.image}
                  />
                  <div 
                    role="button"
                    className={styles.wishlistBtn}
                    onClick={(e) => handleWishlistClick(e, product._id || product.id)}
                    title="Add to Wishlist"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={mounted && isInWishlist(product._id || product.id) ? "var(--accent-secondary)" : "none"} stroke={mounted && isInWishlist(product._id || product.id) ? "var(--accent-secondary)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <div className={styles.categoryBadge}>{product.category}</div>
                  {product.offerLabel ? (
                    <div className={styles.offerBadge}>{product.offerLabel}</div>
                  ) : (
                    product.originalPrice && product.originalPrice > product.price && (
                      <div className={styles.offerBadge}>
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )
                  )}
                  {filterType === 'new' && <div className={styles.newBadge}>NEW ARRIVAL</div>}
                </div>
                <div className={styles.info}>
                  <div className={styles.infoHeader}>
                    <h3 className={styles.name}>{product.name}</h3>
                    <div className={styles.priceContainer}>
                      {(product as any).originalPrice && (
                        <span className={styles.originalPrice}>₹{(product as any).originalPrice}</span>
                      )}
                      <span className={`${styles.price} ${redeemCode ? styles.highlightPrice : ''}`}>₹{product.price}</span>
                    </div>
                  </div>
                  <div 
                    role="button"
                    className={styles.addToCartBtn}
                    onClick={(e) => handleAddToCart(e, product)}
                    suppressHydrationWarning
                  >
                    Add to Cart
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

        {limit && allAvailableProducts.length > limit && (
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
