'use client';

import React, { useState } from 'react';
import styles from './FAQSection.module.css';

const faqCategories = [
  {
    category: "Shipping & Delivery",
    items: [
      {
        question: "How long does shipping take?",
        answer: "Each ritual is hand-packed with care. Shipping typically takes 3-5 business days within the country. International orders may take 7-12 business days."
      },
      {
        question: "How can I track my ritual order?",
        answer: "Once your package is dispatched from the Aura Valley, you will receive a tracking link via email to follow its journey to your home."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we bring Aura rituals to selected countries worldwide. Shipping costs and delivery times are calculated at checkout."
      }
    ]
  },
  {
    category: "Product & Ingredients",
    items: [
      {
        question: "Are your soaps 100% organic?",
        answer: "Absolutely. All AURA soaps are crafted with 100% botanical ingredients and essential oils. We never use synthetic fragrances or parabens."
      },
      {
        question: "Are Aura products vegan and cruelty-free?",
        answer: "Yes, all our products are 100% vegan and we never test on animals. We believe in harmony with all living beings."
      },
      {
        question: "Do you use synthetic fragrances?",
        answer: "Never. We only use pure, therapeutic-grade essential oils to create our signature ritual scents."
      }
    ]
  },
  {
    category: "Ritual & Care",
    items: [
      {
        question: "How should I store my artisan soap?",
        answer: "To ensure your ritual lasts, store the bar in a well-draining soap dish (like our Marble Lotus Dish) away from a direct water stream to let it dry between uses."
      },
      {
        question: "How long does a single bar last?",
        answer: "With proper care in a draining dish, a standard AURA bar typically lasts for 3-4 weeks of daily rituals."
      },
      {
        question: "Are these soaps suitable for sensitive skin?",
        answer: "Yes, our cold-process method preserves natural glycerin, making our soaps extremely gentle and nourishing for sensitive skin types."
      }
    ]
  }
];

const FAQSection = () => {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [activeItemIdx, setActiveItemIdx] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveItemIdx(activeItemIdx === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Curated Wisdom</span>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
        </div>

        <div className={styles.faqLayout}>
          {/* Sidebar Categories */}
          <aside className={styles.sidebar}>
            {faqCategories.map((cat, idx) => (
              <button 
                key={idx}
                suppressHydrationWarning
                className={`${styles.categoryBtn} ${activeCategoryIdx === idx ? styles.activeCategory : ''}`}
                onClick={() => {
                  setActiveCategoryIdx(idx);
                  setActiveItemIdx(0); // Reset accordion for new category
                }}
              >
                {cat.category}
              </button>
            ))}
          </aside>

          {/* FAQ Content */}
          <div className={styles.content}>
            <div className={styles.faqList}>
              {faqCategories[activeCategoryIdx].items.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.faqItem} ${activeItemIdx === idx ? styles.activeItem : ''}`}
                  onClick={() => toggleFAQ(idx)}
                >
                  <div className={styles.questionRow}>
                    <h4>{faq.question}</h4>
                    <span className={styles.icon}>
                      {activeItemIdx === idx ? '−' : '+'}
                    </span>
                  </div>
                  <div className={styles.answerRow}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
