'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart, Product } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './ProductGrid.module.css';


const products: Product[] = [
  { id: 1, name: 'Calm Lavender', price: 350, image: '/lavender.png', category: 'Floral', description: 'Infused with organic lavender oil and dried buds for a soothing bath experience.' },
  { id: 2, name: 'Midnight Charcoal', price: 400, image: '/charcoal.png', category: 'Detox', description: 'Deep cleansing activated charcoal with a refreshing peppermint scent.' },
  { id: 3, name: 'Honey & Oat Scrub', price: 380, image: '/honey-oats.png', category: 'Exfoliating', description: 'Gentle exfoliation with natural oats and moisturizing wild honey.' },
  { id: 4, name: 'Citrus Burst', price: 320, image: '/citrus.png', category: 'Citrus', description: 'Zesty orange and lemon essential oils for an energizing morning wash.' },
  { id: 5, name: 'Eucalyptus Mint', price: 360, image: '/eucalyptus.png', category: 'Refreshing', description: 'Cooling eucalyptus and fresh mint to clear your senses.' },
  { id: 6, name: 'Rose Petal Glow', price: 450, image: '/rose.png', category: 'Floral', description: 'Luxurious rosehip oil and real rose petals for a radiant complexion.' },
  { id: 7, name: 'Sandalwood Serenity', price: 480, image: '/sandalwood.png', category: 'Woody', description: 'Ancient sandalwood extract for a meditative and calming experience.' },
  { id: 8, name: 'Turmeric & Neem', price: 340, image: '/turmeric.png', category: 'Herbal', description: 'Traditional Ayurvedic blend for healthy, blemish-free skin.' },
  { id: 9, name: 'Coffee Bean Blast', price: 390, image: '/coffee.png', category: 'Exfoliating', description: 'Real ground coffee beans to wake up your skin and senses.' },
  { id: 10, name: 'Aloe Vera Cool', price: 330, image: '/aloe.png', category: 'Soothing', description: 'Pure aloe vera gel to hydrate and soothe sensitive skin.' },
  { id: 11, name: 'Tea Tree Purify', price: 370, image: '/teatree.png', category: 'Detox', description: 'Powerful tea tree oil to naturally purify and balance your skin.' },
  { id: 12, name: 'Vanilla Bean Cream', price: 420, image: '/vanilla.png', category: 'Sweet', description: 'Warm vanilla pod extract and shea butter for ultimate softness.' },
  { id: 13, name: 'Sea Salt & Kelp', price: 410, image: '/seasalt.png', category: 'Refreshing', description: 'Mineral-rich sea salt for a spa-like oceanic cleanse.' },
  { id: 14, name: 'Jasmine Bloom', price: 460, image: '/jasmine.png', category: 'Floral', description: 'Intoxicating night-blooming jasmine for a romantic bath.' },
  { id: 15, name: 'Cedarwood Spice', price: 390, image: '/cedar.png', category: 'Woody', description: 'Deep forest cedarwood with a hint of warm clove spice.' },
  { id: 16, name: 'Patchouli Earth', price: 430, image: '/patchouli.png', category: 'Woody', description: 'Grounded patchouli essential oil for a deep, earthy aroma.' },
  { id: 17, name: 'Green Tea Zen', price: 350, image: '/greentea.png', category: 'Refreshing', description: 'Antioxidant-rich green tea leaves for a rejuvenating wash.' },
  { id: 18, name: 'Coconut Milk Silk', price: 380, image: '/coconut.png', category: 'Soothing', description: 'Creamy coconut milk for a silky smooth and hydrated feel.' },
  { id: 19, name: 'Lemongrass Zest', price: 320, image: '/lemongrass.png', category: 'Citrus', description: 'Sharp lemongrass oil to uplift your mood and refresh your body.' },
  { id: 20, name: 'Hibiscus Pink', price: 440, image: '/hibiscus.png', category: 'Floral', description: 'Vitamin C rich hibiscus petals for a bright and youthful glow.' }
];

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

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleAddToCart = (product: Product) => {
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

  let filteredProducts = products;
  let currentOffer = redeemCode ? OFFER_PRODUCTS[redeemCode] : null;

  // Filter and Apply Special Offer Prices
  if (redeemCode && currentOffer) {
    filteredProducts = products
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
    filteredProducts = products.filter(product => {
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
              <div key={product.id} className={`${styles.card} ${redeemCode ? styles.offerCard : ''} card-premium animate-up`}>
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
                      onClick={() => handleAddToCart(product)}
                      suppressHydrationWarning
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
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
        {limit && products.length > limit && (
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
