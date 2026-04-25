'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Login.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin Override
    if (email === 'admin@soap.com' && password === 'radheradhe') {
      login(email, 'Administrator');
      router.push('/admin');
      return;
    }

    // Simulate database lookup
    const registeredUsers = JSON.parse(localStorage.getItem('aura-registered-users') || '[]');
    const user = registeredUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      login(email, user.name);
      router.push('/');
    } else {
      setError('Invalid credentials or user not registered.');
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
      
      <div className={styles.centeredCard}>
        <div className={`${styles.glassCard} animate-up`}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>Private Collection</span>
            <h1>The Ritual</h1>
            <p>Access your curated experience</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form className={styles.loginForm} onSubmit={handleSubmit}>
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
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className={styles.signInBtn}>
              Enter Gallery
            </button>
          </form>
          
          <div className={styles.cardFooter}>
            <p>New to Aura? <Link href="/register">Create an Account</Link></p>
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

export default LoginPage;
