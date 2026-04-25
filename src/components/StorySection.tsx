import React from 'react';
import Image from 'next/image';
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
              Aura was born in a small home kitchen, driven by a passion for natural living 
              and the craft of traditional soap making. Every bar we create is a blend of 
              pure botanical oils, organic herbs, and a lot of love.
            </p>
            <p className={styles.text}>
              We believe that what you put on your body is just as important as what you put in it. 
              Our ritual is one of patience, precision, and respect for nature.
            </p>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display', color: 'var(--accent-primary)', marginTop: '40px', marginBottom: '15px' }}>
              Botanical Integrity
            </h3>
            <p className={styles.text}>
              Our ingredients are sourced from small-scale organic farms that share our commitment 
              to sustainability. No synthetic fragrances, no parabens—only the pure essence 
              of the earth.
            </p>
            <div className={styles.signature}>Handmade in the Aura Valley</div>
          </div>

          <div className={`${styles.imageWrapper} reveal-delayed`}>
            <Image 
              src="/artisanal-workshop.png" 
              alt="Soap Making Craft" 
              fill 
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
