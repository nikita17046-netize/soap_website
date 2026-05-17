"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './OffersCarousel.module.css';

const OFFERS_DATA = [
  {
    code: 'AURA15',
    badge: 'NEW CLIENT EXCLUSIVE',
    title: 'First Ritual',
    description: 'Receive 15% OFF your first curation. Experience the essence of luxury.',
    highlight: '15% OFF',
    image: '/offer1.png',
  },
  {
    code: 'BUNDLE',
    badge: 'MOST POPULAR RITUAL',
    title: 'The Trio Set',
    description: 'Purchase any three bars and receive a complimentary marble dish.',
    highlight: 'COMPLIMENTARY GIFT',
    image: '/offer2.png',
  },
  {
    code: 'RITUAL',
    badge: 'ARTISAN SELECTION',
    title: 'Seasonal Subscription',
    description: 'Join our seasonal ritual and get a limited edition bar every month at 20% OFF.',
    highlight: '20% OFF',
    image: '/offer3.png',
  }
];

// Duplicate offers multiple times to create a seamless infinite scrolling marquee
const duplicatedOffers = [...OFFERS_DATA, ...OFFERS_DATA, ...OFFERS_DATA, ...OFFERS_DATA];

const OffersCarousel: React.FC = () => {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchOffers = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/products');
        if (res.ok) {
          const products = await res.json();
          const dbOffers = products
            .filter((p: any) => p.isOffer)
            .map((p: any) => ({
              code: p._id || p.id,
              badge: 'ARTISAN SELECTION',
              title: p.name,
              description: p.description || p.fullDescription || 'Exclusive promotional offer.',
              image: p.images?.[0] || p.image || '/offer1.png',
              highlight: p.offerLabel || 'SPECIAL OFFER'
            }));

          if (dbOffers.length > 0) {
            setOffers(dbOffers);
          } else {
            setOffers(OFFERS_DATA);
          }
        } else {
          setOffers(OFFERS_DATA);
        }
      } catch (err) {
        setOffers(OFFERS_DATA);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    if (!mounted || offers.length === 0) return;
    const carousel = carouselRef.current;
    if (!carousel) return;
    const inner = carousel.querySelector(`.${styles.inner}`) as HTMLElement;
    if (!inner) return;

    // Calculate dynamic speed
    const totalWidth = inner.scrollWidth / 4;
    const speed = 50; // pixels per second
    const duration = totalWidth / speed;
    carousel.style.setProperty('--animation-duration', `${duration}s`);
  }, [mounted, offers]);

  const handleOfferClick = (code: string) => {
    router.push(`/?redeem=${code}#shop`);
    setTimeout(() => {
      const shopSection = document.getElementById('shop');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  const showOffers = mounted && offers.length > 0;
  const listToRender = offers.length > 0 ? [...offers, ...offers, ...offers, ...offers] : duplicatedOffers;

  return (
    <section 
      className={styles.fullSection} 
      style={{ display: showOffers ? 'block' : 'none' }} 
      aria-label="Special Offers" 
      suppressHydrationWarning
    >
      {showOffers && (
        <>
          <div className={styles.headerContainer}>
            <span className={styles.subtitle}>SaptAroma Sanctuary</span>
            <h2 className={styles.heading}>Curated Ritual Deals</h2>
            <p className={styles.descriptionText}>
              Explore our handcrafted apothecary offers. Click on any card below to scroll and filter its exclusive products in the shop.
            </p>
          </div>

          <div className={styles.carousel} ref={carouselRef}>
            <div className={styles.inner}>
              {listToRender.map((offer, idx) => (
                <div 
                  key={`${offer.code}-${idx}`} 
                  className={`${styles.offerCard} card-premium`}
                  onClick={() => handleOfferClick(offer.code)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      sizes="(max-width: 768px) 80vw, 30vw"
                      className={styles.offerImage}
                      priority
                    />
                    <span className={styles.highlightBadge}>{offer.highlight}</span>
                  </div>
                  <div className={styles.offerInfo}>
                    <span className={styles.badge}>{offer.badge}</span>
                    <h3 className={styles.title}>{offer.title}</h3>
                    <p className={styles.description}>{offer.description}</p>
                    <button className={styles.ctaButton}>
                      View Offer Products
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default OffersCarousel;
