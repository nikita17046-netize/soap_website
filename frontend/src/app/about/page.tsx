import React from 'react';
import StorySection from '@/components/StorySection';
import styles from './About.module.css';

export const metadata = {
  title: 'Our Story | PureNature Soaps',
  description: 'Learn about the heart of the craft and our commitment to botanical integrity.',
};

const AboutPage = () => {
  return (
    <main className={styles.aboutPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.label}>Est. 2024</span>
          <h1 className={styles.title}>The Art of Ritual</h1>
        </div>
      </header>
      
      <StorySection />
      
      <section className={styles.philosophy}>
        <div className={styles.container}>
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyItem}>
              <h3>Natural Purity</h3>
              <p>We source only the finest organic ingredients, ensuring every bar is a testament to nature's healing power.</p>
            </div>
            <div className={styles.philosophyItem}>
              <h3>Timeless Craft</h3>
              <p>Our traditional cold-process method preserves the integrity of botanical oils for a truly luxury experience.</p>
            </div>
            <div className={styles.philosophyItem}>
              <h3>Sustainable Soul</h3>
              <p>From farm to bath, every step of our process is designed to honor and protect our environment.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
