'use client';

import React from 'react';
import ProductGrid from '@/components/ProductGrid';

const NewArrivalsPage = () => {
  return (
    <main style={{ 
      paddingTop: '90px', 
      minHeight: '100vh', 
      background: 'var(--bg-primary)' 
    }}>

      {/* Immersive Editorial Header */}
      <section style={{ 
        padding: '60px 5% 20px', 
        textAlign: 'center', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Decorative Element */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label reveal" style={{ 
            color: 'var(--accent-secondary)', 
            marginBottom: '20px', 
            display: 'block',
            fontSize: '0.85rem',
            letterSpacing: '0.5em',
            fontWeight: 600
          }}>
            LATEST DROPS
          </span>
          <h1 className="reveal-delayed" style={{ 
            fontSize: '7rem', 
            marginBottom: '10px',
            lineHeight: '0.9',
            letterSpacing: '-4px',
            color: 'var(--accent-primary)'
          }}>
            New <br /> <span style={{ 
              fontStyle: 'italic', 
              color: 'var(--accent-secondary)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400
            }}>Arrivals</span>
          </h1>
          <p className="reveal-delayed" style={{ 
            color: 'var(--text-secondary)', 
            maxWidth: '550px', 
            margin: '0 auto', 
            fontSize: '1.2rem',
            lineHeight: '1.8',
            opacity: 0.8
          }}>
            Experience our most recent botanical creations. <br /> 
            Freshly handcrafted and ready for your ritual.
          </p>
        </div>

      </section>

      <div style={{ 
        padding: '40px 5% 100px', 
        maxWidth: '1600px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <ProductGrid filterType="new" />
      </div>

    </main>
  );
};

export default NewArrivalsPage;
