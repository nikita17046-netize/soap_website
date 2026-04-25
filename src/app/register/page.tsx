'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from '../login/Login.module.css'; // Reusing some styles

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && name) {
      // Simulate saving to a database
      const existingUsers = JSON.parse(localStorage.getItem('aura-registered-users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === email);
      
      if (userExists) {
        alert('User already exists. Please login.');
        router.push('/login');
        return;
      }

      const newUser = { name, email, password };
      existingUsers.push(newUser);
      localStorage.setItem('aura-registered-users', JSON.stringify(existingUsers));

      login(email, name);
      router.push('/');
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Full Page Background */}
      <Image 
        src="/login-bg-v4.png" 
        alt="Rustic Lavender Soap Background" 
        fill 
        className={`${styles.pageBg} animate-zoom`}
        priority
      />


      <div className={styles.pageOverlay}></div>
      
      <div className={`${styles.centeredCard} ${styles.wide}`}>

        <div className={`${styles.glassCard} animate-up`}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>Private Collection</span>
            <h1>The Journey</h1>
            <p>Begin your botanical ritual</p>
          </div>
          
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.inputField}>
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputField}>
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="you@aura.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputField}>
              <label>Phone Number</label>
              <input type="tel" placeholder="+91 00000 00000" />
            </div>
            
            <div className={styles.inputField}>
              <label>Preferred Collection</label>
              <select style={{ 
                background: 'rgba(0,0,0,0.03)', 
                border: '1px solid transparent', 
                padding: '16px 24px', 
                fontSize: '1rem', 
                borderRadius: 'var(--radius-full)', 
                color: 'var(--accent-primary)',
                fontFamily: 'inherit',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none'
              }}>
                <option value="botanical">Botanical Series</option>
                <option value="essential">Essential Oils</option>
                <option value="luxury">Limited Edition Luxury</option>
                <option value="all">Discover All</option>
              </select>
            </div>
            
            <div className={styles.inputField}>
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
              <input type="checkbox" id="newsletter" style={{ width: 'auto' }} />
              <label htmlFor="newsletter" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, textTransform: 'none', letterSpacing: 'normal' }}>
                Join the Private List for early access & seasonal rituals
              </label>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px', fontStyle: 'italic' }}>
              By joining, you agree to our Terms and Private Policy.
            </p>
            
            <button type="submit" className={styles.signInBtn}>
              Join the Ritual
            </button>

          </form>

          
          <div className={styles.cardFooter}>
            <p>Already have an account? <Link href="/login">Sign In</Link></p>
            <Link href="/" className={styles.backHome}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
