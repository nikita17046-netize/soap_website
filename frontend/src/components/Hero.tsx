import React from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.editorialContent}>
          <span className={`${styles.label} reveal`}>Artisanal Collection 2026</span>
          <h1 className={`${styles.headline} reveal-delayed`}>
            Handcrafted <br /> <span>with</span> <br /> Nature's
          </h1>
          <div className={`${styles.bottomHero} reveal-delayed`}>
            <p className={styles.heroText}>
              Meticulously handcrafted in small batches, our soaps are a blend of
              botanical wisdom and modern luxury.
            </p>
            <div className={styles.heroActions}>
              <a href="#shop" className="btn-primary">Explore Shop</a>
            </div>
          </div>
        </div>

        <div className={`${styles.mainImage} reveal`}>
          <Image
            src="/artisanal-workshop.png"
            alt="Artisanal Workshop"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.heroImage}
            priority
          />
          <div className={styles.imageOverlay}></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
