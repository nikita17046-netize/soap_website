'use client';

import React from 'react';
import styles from './Glossary.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

const INGREDIENTS = [
  {
    name: 'Organic Lavender',
    benefit: 'Calming & Soothing',
    description: 'High-altitude lavender essential oil helps reduce stress and soothe skin irritation. Perfect for a relaxing evening ritual.',
    icon: '🪻',
    query: 'Lavender'
  },
  {
    name: 'Activated Charcoal',
    benefit: 'Deep Detoxification',
    description: 'Acts like a magnet to draw out impurities and toxins from deep within the pores, leaving skin clear and balanced.',
    icon: '🌑',
    query: 'Charcoal'
  },
  {
    name: 'Raw Wild Honey',
    benefit: 'Natural Humectant',
    description: 'A powerhouse for moisture. Honey locks in hydration and provides antibacterial benefits for healthy skin.',
    icon: '🍯',
    query: 'Honey'
  },
  {
    name: 'Colloidal Oats',
    benefit: 'Gentle Exfoliation',
    description: 'Provides a silky, soothing layer that buffs away dead skin cells while calming inflammation.',
    icon: '🌾',
    query: 'Oat'
  },
  {
    name: 'Pink Himalayan Salt',
    benefit: 'Mineral Rich',
    description: 'Packed with 84 minerals, it detoxifies the skin while providing gentle exfoliation and improving circulation.',
    icon: '🧂',
    query: 'Salt'
  },
  {
    name: 'Shea Butter',
    benefit: 'Intense Nourishment',
    description: 'Rich in vitamins A and E, it provides deep hydration and improves skin elasticity.',
    icon: '🥜',
    query: 'Shea'
  }
];

const GlossaryPage = () => {
  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.label}>The Aura Library</span>
          <h1 className={styles.title}>Ingredients Glossary</h1>
          <p className={styles.subtitle}>Discover the botanical power behind every ritual.</p>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {INGREDIENTS.map((item, index) => (
              <Link 
                href={`/shop?search=${item.query}`}
                key={item.name} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <motion.div 
                  className={styles.card}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.icon}>{item.icon}</div>
                  <div className={styles.info}>
                    <span className={styles.benefit}>{item.benefit}</span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      
      <section className={styles.promise}>
        <div className={styles.container}>
          <div className={styles.promiseBox}>
            <h2>Our Pure Promise</h2>
            <p>Every ingredient is ethically sourced, organic where possible, and chosen with intention. No synthetics. No compromises.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default GlossaryPage;
