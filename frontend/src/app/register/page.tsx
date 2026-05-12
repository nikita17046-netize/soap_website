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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register(name, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Full Page Background */}
      <Image 
        src="/login-bg-v4.png" 
        alt="Rustic Lavender Soap Background" 
        fill 
        sizes="100vw"
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

          {error && <div className={styles.errorMessage}>{error}</div>}
          
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
              <label>Password</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className={styles.toggleBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button type="submit" className={styles.signInBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Joining...' : 'Join the Ritual'}
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
