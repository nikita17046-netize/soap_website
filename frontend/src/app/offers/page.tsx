'use client';

import React from 'react';
import styles from './Offers.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const OFFERS = [
  {
    code: "AURA15",
    title: "First Ritual",
    desc: (
      <>
        Receive <span className={styles.highlight}>15% OFF</span> your first curation. <br />
        Experience the essence of botanical luxury.
      </>
    ),
    link: "/shop?redeem=AURA15",
    highlight: "New Client Exclusive"
  },
  {
    code: "BUNDLE",
    title: "The Trio Set",
    desc: (
      <>
        Purchase any three bars and receive a <br />
        <span className={styles.highlight}>COMPLIMENTARY MARBLE DISH</span>.
      </>
    ),
    giftImage: "/images/lotus-dish.png",
    link: "/shop?redeem=BUNDLE",
    highlight: "Most Popular Ritual"
  },
  {
    code: "RITUAL",
    title: "Seasonal Subscription",
    desc: (
      <>
        Join our seasonal ritual and get a limited <br />
        edition bar every month at <span className={styles.highlight}>20% OFF</span>.
      </>
    ),
    link: "/shop?redeem=RITUAL",
    highlight: "Artisan Selection"
  }
];

export default function OffersPage() {
  const router = useRouter();

  const handleRedeem = (code: string) => {
    router.push(`/shop?redeem=${code}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.label}>Exclusive Rewards</span>
          <h1 className={styles.title}>Seasonal Rituals</h1>
          <p className={styles.subtitle}>Curated selections with exceptional value.</p>
        </header>

        <div className={styles.grid}>
          {OFFERS.map((offer) => (
            <div key={offer.code} className={styles.card}>
              <div className={styles.tag}>{offer.highlight}</div>
              
              {offer.giftImage && (
                <div className={styles.giftPreview}>
                  <Image 
                    src={offer.giftImage} 
                    alt="Complimentary Gift" 
                    width={180} 
                    height={120} 
                    className={styles.giftImg}
                  />
                  <span className={styles.giftLabel}>Complimentary Gift</span>
                </div>
              )}

              <span className={styles.offerCode}>{offer.code}</span>
              <h2 className={styles.cardTitle}>{offer.title}</h2>
              <div className={styles.description}>{offer.desc}</div>
              <button 
                className={styles.redeemBtn}
                onClick={() => handleRedeem(offer.code)}
                suppressHydrationWarning
              >
                Redeem Offer
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
