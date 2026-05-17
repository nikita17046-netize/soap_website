import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './StorySection.module.css';

const StorySection = () => {
  return (
    <section className={styles.section} id="story">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={`${styles.content} reveal`}>
            <span className={styles.label}>Our Story</span>
            <h2 className={styles.title}>The Heart <br />of the Craft</h2>
            <p className={styles.text}>
              SaptAroma was born in a small home kitchen, driven by a passion for natural living 
              and the craft of traditional soap making. Every bar we create is a blend of 
              pure botanical oils, organic herbs, and a lot of love.
            </p>
            <p className={styles.text}>
              We believe that what you put on your body is just as important as what you put in it. 
              Our ritual is one of patience, precision, and respect for nature.
            </p>
            
            <Link href="/about" className={styles.ctaButton}>
              Discover Our Story & Quests
              <svg className={styles.ctaArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          <div className={`${styles.imageWrapper} reveal-delayed`}>
            <Image 
              src="/artisanal-workshop.png" 
              alt="Soap Making Craft" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
