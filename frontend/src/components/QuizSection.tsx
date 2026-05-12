'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/constants/products';
import styles from './QuizSection.module.css';

const QUESTIONS = [
  {
    id: 'skin',
    question: 'What is your primary skin concern?',
    options: [
      { label: 'Dryness & Dehydration', icon: '💧', value: 'dry' },
      { label: 'Oiliness & Blemishes', icon: '✨', value: 'oily' },
      { label: 'Sensitivity', icon: '🌸', value: 'sensitive' },
    ]
  },
  {
    id: 'scent',
    question: 'What scent profile elevates your spirit?',
    options: [
      { label: 'Floral & Sweet', icon: '🌺', value: 'floral' },
      { label: 'Earthy & Woody', icon: '🌲', value: 'earthy' },
      { label: 'Fresh & Citrus', icon: '🍋', value: 'fresh' },
    ]
  }
];

const getRecommendation = (answers: Record<string, string>) => {
  const { skin, scent } = answers;
  if (skin === 'dry' && scent === 'floral') return 6; // Rose Petal Glow
  if (skin === 'dry' && scent === 'earthy') return 12; // Vanilla Bean Cream
  if (skin === 'dry' && scent === 'fresh') return 10; // Aloe Vera Cool
  
  if (skin === 'oily' && scent === 'floral') return 14; // Jasmine Bloom
  if (skin === 'oily' && scent === 'earthy') return 2; // Midnight Charcoal
  if (skin === 'oily' && scent === 'fresh') return 11; // Tea Tree Purify

  if (skin === 'sensitive' && scent === 'floral') return 1; // Calm Lavender
  if (skin === 'sensitive' && scent === 'earthy') return 7; // Sandalwood Serenity
  if (skin === 'sensitive' && scent === 'fresh') return 3; // Honey & Oat

  return 1; // Fallback
};

const QuizSection = () => {
  const [step, setStep] = useState(0); // 0: Start, 1: Q1, 2: Q2, 3: Result
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => setStep(1);

  const handleOptionClick = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1); // Go to result
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setStep(0);
  };

  const renderContent = () => {
    if (step === 0) {
      return (
        <motion.div 
          key="start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={styles.resultContainer}
        >
          <h3 className={styles.questionTitle}>Discover Your Perfect Match</h3>
          <p className={styles.description}>
            Take our 2-step sensory quiz to find the artisan soap crafted specifically for your skin's needs and your spirit's desires.
          </p>
          <button className="btn-primary" onClick={handleStart}>
            Start The Journey
          </button>
        </motion.div>
      );
    }

    if (step <= QUESTIONS.length) {
      const q = QUESTIONS[step - 1];
      return (
        <motion.div 
          key={q.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <h3 className={styles.questionTitle}>{q.question}</h3>
          <div className={styles.optionsGrid}>
            {q.options.map(opt => (
              <button 
                key={opt.value}
                className={styles.optionBtn}
                onClick={() => handleOptionClick(q.id, opt.value)}
              >
                <span className={styles.optionIcon}>{opt.icon}</span>
                <span className={styles.optionText}>{opt.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      );
    }

    // Result Step
    const recommendedId = getRecommendation(answers);
    const recommendedProduct = PRODUCTS.find(p => p.id === recommendedId) || PRODUCTS[0];

    return (
      <motion.div 
        key="result"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.resultContainer}
      >
        <span className={styles.subtitle}>Your Personalized Ritual</span>
        <h3 className={styles.resultTitle}>We found your match.</h3>
        
        <div className={styles.productCard}>
          <Image 
            src={recommendedProduct.image} 
            alt={recommendedProduct.name}
            width={120} height={120}
            className={styles.productImage}
          />
          <div className={styles.productInfo}>
            <h3>{recommendedProduct.name}</h3>
            <p>{recommendedProduct.description}</p>
            <div className={styles.actions}>
              <button 
                className="btn-primary"
                onClick={() => addToCart(recommendedProduct)}
              >
                Add to Cart - ₹{recommendedProduct.price}
              </button>
              <Link href={`/shop/product/${recommendedProduct.id}`} className="btn-secondary">
                View Details
              </Link>
            </div>
          </div>
        </div>
        
        <button className={styles.restartBtn} onClick={resetQuiz}>
          Retake Quiz
        </button>
      </motion.div>
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Bespoke Experience</span>
          <h2 className={styles.title}>Find Your Ritual</h2>
        </div>

        <div className={styles.quizBox}>
          {mounted && (
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
