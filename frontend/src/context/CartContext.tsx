'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = 'http://127.0.0.1:8000/api';

export interface Product {
  id: number | string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
  isOffer?: boolean;
  offerLabel?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: any) => void;
  updateQuantity: (productId: any, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlist: any[];
  toggleWishlist: (productId: any) => void;
  isInWishlist: (productId: any) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<Product | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear cart and wishlist when not logged in
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      setCart([]);
      setWishlist([]);
      localStorage.removeItem('soap-cart');
      localStorage.removeItem('soap-wishlist');
      setIsInitialized(true); // Even for guest, we are "initialized"
    }
  }, [isLoggedIn, isLoading]);

  // Load cart and wishlist from localStorage
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      const savedCart = localStorage.getItem('soap-cart');
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      }
      const savedWishlist = localStorage.getItem('soap-wishlist');
      if (savedWishlist) {
        try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { console.error(e); }
      }
      setIsInitialized(true);
    }
  }, [isLoggedIn, isLoading]);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      localStorage.setItem('soap-cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized, isLoggedIn]);

  // Sync wishlist to backend and localStorage if logged in
  useEffect(() => {
    if (!isInitialized || !isLoggedIn) return;

    localStorage.setItem('soap-wishlist', JSON.stringify(wishlist));
    
    const syncWishlist = async () => {
      if (user?.token) {
        try {
          await fetch(`${API_URL}/users/wishlist`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ wishlist })
          });
        } catch (err) {
          console.error('Failed to sync wishlist:', err);
        }
      }
    };

    syncWishlist();
  }, [wishlist, isInitialized, isLoggedIn, user]);

  const toggleWishlist = (productId: any) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: any) => wishlist.includes(productId);

  const addToCart = (product: Product) => {
    const productId = product._id || product.id;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => (item._id || item.id) === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          (item._id || item.id) === productId 
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                // Update offer info if the new addition has it
                isOffer: product.isOffer || item.isOffer,
                offerLabel: product.offerLabel || item.offerLabel
              } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    // Show premium notification with product info
    setNotification(product);
    setTimeout(() => setNotification(null), 3500);
  };

  const removeFromCart = (productId: any) => {
    setCart((prevCart) => prevCart.filter((item) => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId: any, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
      
      {/* Ultra-Premium Notification Toast */}
      {mounted && notification && (
        <div className="cart-ritual-toast animate-bounce-up">
          <div className="toast-image">
            <img src={notification.image} alt={notification.name} />
          </div>
          <div className="toast-content">
            <span className="toast-tag">Added to Ritual</span>
            <span className="toast-name">{notification.name}</span>
          </div>
          <div className="toast-check">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

