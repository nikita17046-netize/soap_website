'use client';

import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import styles from './Shop.module.css';

const ShopPage = () => {
  return (
    <main className={styles.shopMain}>

      {/* Immersive Editorial Header */}
      <section className={styles.headerSection}>
        {/* Subtle Decorative Element */}
        <div className={styles.decorativeElement}></div>

        <div className={styles.headerContent}>
          {/* Background Brand Text */}
          <div className={styles.bgText}>
            AURA
          </div>

          <span className={`${styles.label} reveal`}>
            ESTABLISHED 2026
          </span>
          <h1 className={`${styles.headline} reveal-delayed`}>
            The Botanical <br /> <span className={styles.italic}>Curation</span>
          </h1>
          <p className={`${styles.description} reveal-delayed`}>
            A sensory journey through 20 handcrafted bars, <br /> 
            designed for the modern ritualist.
          </p>
        </div>

      </section>

      <div className={styles.gridContainer}>
        <ProductGrid />
      </div>

    </main>
  );
};

export default ShopPage;
