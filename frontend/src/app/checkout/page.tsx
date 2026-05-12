'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './checkout.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft,
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Search, 
  Navigation,
  X,
  ShoppingBag,
  RefreshCcw,
  RotateCcw,
  Lock
} from 'lucide-react';
import { INDIAN_CITIES } from './cities';

const API_URL = 'http://127.0.0.1:8000/api';

const STEPS = [
  { id: 1, title: 'Address', icon: <MapPin size={20} /> },
  { id: 2, title: 'Policies', icon: <ShieldCheck size={20} /> },
  { id: 3, title: 'Review', icon: <ShoppingBag size={20} /> },
  { id: 4, title: 'Payment', icon: <CreditCard size={20} /> }
];

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  
  const SHIPPING_FEE = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + SHIPPING_FEE;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    phone: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [suggestions, setSuggestions] = useState<{city: string, state: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');
  const [upiId, setUpiId] = useState('');
  const [showOnlinePopup, setShowOnlinePopup] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    userBankName: '',
    transactionId: ''
  });

  // Persistence: Load from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem('checkout_step');
    const savedInfo = localStorage.getItem('checkout_info');
    
    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedInfo) setShippingInfo(JSON.parse(savedInfo));
  }, []);

  // Persistence: Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('checkout_step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('checkout_info', JSON.stringify(shippingInfo));
  }, [shippingInfo]);

  // Protect the route
  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));

    if (name === 'city') {
      if (value.length > 0) {
        const filtered = INDIAN_CITIES.filter(c => 
          c.city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 8);
        setSuggestions(filtered);
        setShowSuggestions(true);

        const exactMatch = INDIAN_CITIES.find(c => c.city.toLowerCase() === value.toLowerCase());
        if (exactMatch) {
          setShippingInfo(prev => ({ ...prev, state: exactMatch.state }));
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const data = await response.json();
        
        if (data.address) {
          const city = data.address.city || data.address.town || data.address.village || '';
          const state = data.address.state || '';
          const fullAddress = `${data.address.road || ''} ${data.address.suburb || ''} ${data.address.neighbourhood || ''}`.trim();
          
          setShippingInfo(prev => ({
            ...prev,
            city,
            state,
            address: data.display_name || prev.address
          }));
        }
      } catch (error) {
        console.error("Location error:", error);
        alert("Could not detect location automatically.");
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      console.error(error);
      setIsLocating(false);
      alert("Please enable location access to use this feature.");
    });
  };

  const selectCity = (city: string, state: string) => {
    setShippingInfo(prev => ({ ...prev, city, state }));
    setShowSuggestions(false);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (paymentMethod === 'Online Payment') {
      const res = await loadRazorpay();

      if (!res) {
        alert('Payment SDK failed to load. Are you online?');
        setIsSubmitting(false);
        return;
      }

      // In a real app, you would fetch order_id from your backend here
      // For now, we'll simulate the Razorpay options
      const options = {
        key: "rzp_test_7f3lE1p9W7xL2Z", // Generic test key placeholder
        amount: finalTotal * 100,
        currency: "INR",
        name: "SaptAroma Rituals",
        description: "Botanical Ritual Purchase",
        image: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        handler: async function (response: any) {
          console.log("Razorpay Success:", response);
          await saveOrderToDatabase(response.razorpay_payment_id);
        },
        prefill: {
          name: shippingInfo.fullName,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        notes: {
          address: shippingInfo.address
        },
        theme: {
          color: "#9c7e5d",
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Razorpay Open Error:", err);
        alert("Failed to open Razorpay modal. Please check your internet connection.");
        setIsSubmitting(false);
      }
    } else {
      await saveOrderToDatabase('COD');
    }
  };

  const saveOrderToDatabase = async (paymentId: string) => {
    const orderData = {
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        product: item._id || null,
        image: item.image || null
      })),
      total: finalTotal,
      shippingInfo: {
        ...shippingInfo,
        paymentMethod,
        paymentId,
        upiId: paymentMethod === 'UPI' ? upiId : null,
        bankTransferDetails: paymentMethod === 'Bank Transfer' ? bankInfo : null
      },
      userEmail: user?.email
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setIsOrdered(true);
        clearCart();
        localStorage.removeItem('checkout_step');
        localStorage.removeItem('checkout_info');
      } else {
        setIsOrdered(true);
        clearCart();
        localStorage.removeItem('checkout_step');
        localStorage.removeItem('checkout_info');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setIsOrdered(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontStyle: 'italic', opacity: 0.5 }}>Restoring Ritual Session...</p>
      </div>
    );
  }

  if (isOrdered) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.crackersLeft}>
          {[...Array(12)].map((_, i) => <span key={i} className={styles.particle}></span>)}
        </div>
        <div className={styles.crackersRight}>
          {[...Array(12)].map((_, i) => <span key={i} className={styles.particle}></span>)}
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={styles.successCard}
        >
          <div className={styles.successIcon}>
            <CheckCircle2 size={60} />
          </div>
          <h1>Ritual Initiated!</h1>
          <p>Thank you for choosing <strong>SaptAroma</strong>. Your botanical ritual is being prepared for its journey to you.</p>
          
          <div className={styles.successActions}>
            <button onClick={() => router.push('/track')} className={styles.btnTrack}>
              <Truck size={20} /> Track Order
            </button>
            <button onClick={() => router.push('/shop')} className={styles.btnShop}>
              Continue Shopping <ChevronRight size={20} />
            </button>
          </div>

          <div className={styles.orderRecap}>
             <div className={styles.recapItem}>
                <label>Paid Amount</label>
                <span>₹{finalTotal}</span>
             </div>
             <div className={styles.recapItem}>
                <label>Delivery To</label>
                <span>{shippingInfo.city}, {shippingInfo.state}</span>
             </div>
          </div>
          
          <div className={styles.successFooter}>
            <p>A confirmation email has been sent to your inbox.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Your Ritual Bag is Empty</h2>
        <p>Explore our artisanal collection to begin your journey.</p>
        <Link href="/shop" className="btn-primary" style={{ marginTop: '20px' }}>
          Explore Shop
        </Link>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.stepContent}
          >
            <div className={styles.form}>
              <h3>
                <MapPin /> Shipping Information
                <button 
                  onClick={detectLocation} 
                  className={styles.locateBtn}
                  disabled={isLocating}
                  title="Detect my location"
                >
                  <Navigation size={14} className={isLocating ? styles.spin : ''} />
                  {isLocating ? 'Locating...' : 'Auto-detect Location'}
                </button>
              </h3>
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    required 
                    placeholder="John Doe" 
                    value={shippingInfo.fullName} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="john@example.com" 
                    value={shippingInfo.email} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    placeholder="+91 98765 43210" 
                    value={shippingInfo.phone} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputGroup} style={{ position: 'relative' }}>
                  <label>City</label>
                  <div className={styles.inputWithIcon}>
                    <input 
                      type="text" 
                      name="city" 
                      required 
                      placeholder="Type city (e.g. Mumbai, Delhi)"
                      value={shippingInfo.city} 
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                    <Search size={16} className={styles.searchIcon} />
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className={styles.suggestions}>
                      {suggestions.map((s, i) => (
                        <div 
                          key={i} 
                          className={styles.suggestionItem}
                          onClick={() => selectCity(s.city, s.state)}
                        >
                          <span className={styles.sCity}>{s.city}</span>
                          <span className={styles.sState}>{s.state}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <label>State</label>
                  <input 
                    type="text" 
                    name="state" 
                    required 
                    placeholder={shippingInfo.city ? "Enter state manually" : "Auto-filled"}
                    value={shippingInfo.state} 
                    onChange={handleInputChange}
                    style={shippingInfo.state && INDIAN_CITIES.some(c => c.city.toLowerCase() === shippingInfo.city.toLowerCase()) ? { background: '#f5f5f5', cursor: 'not-allowed' } : {}}
                    readOnly={INDIAN_CITIES.some(c => c.city.toLowerCase() === shippingInfo.city.toLowerCase())}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Zip Code</label>
                  <input 
                    type="text" 
                    name="zipCode" 
                    required 
                    placeholder="110001"
                    value={shippingInfo.zipCode} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputGroupFull}>
                  <label>Shipping Address</label>
                  <textarea 
                    name="address" 
                    required 
                    placeholder="Street, Landmark, Apartment number..."
                    value={shippingInfo.address} 
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.stepContent}
          >
            <div className={styles.card}>
              <h3><ShieldCheck /> Return & Exchange Policy</h3>
              <div className={styles.policyCard}>
                <div className={styles.policyItem}>
                  <h4><RefreshCcw size={18} /> 7-Day Easy Returns</h4>
                  <p>Not satisfied with your botanical ritual? Return it within 7 days of delivery for a full refund. Items must be in original packaging and unused condition.</p>
                </div>
                <div className={styles.policyItem}>
                  <h4><RotateCcw size={18} /> Hassle-Free Exchange</h4>
                  <p>Received a damaged product or want a different scent? Contact our support team for a priority exchange. We'll pick up the item from your doorstep.</p>
                </div>
                <div className={styles.policyItem}>
                  <h4><Truck size={18} /> Secure Transit</h4>
                  <p>Every order is insured during transit. If your package arrives damaged, please take a photo and let us know immediately for a swift resolution.</p>
                </div>
              </div>
              <div className={styles.agreementGroup}>
                <label className={styles.checkboxContainer}>
                  <input 
                    type="checkbox" 
                    checked={policyAccepted} 
                    onChange={(e) => setPolicyAccepted(e.target.checked)} 
                  />
                  <span className={styles.checkmark}></span>
                  <span className={styles.agreementText}>
                    I have read and agree to the <strong>Return & Exchange Policy</strong>
                  </span>
                </label>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '20px' }}>
                * By proceeding, you agree to our standard terms and conditions regarding returns and exchanges.
              </p>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.stepContent}
          >
            <div className={styles.card}>
              <h3><ShoppingBag /> Order Review</h3>
              <div className={styles.itemList}>
                {cart.map((item) => (
                  <div key={item._id || item.id} className={styles.reviewItem}>
                    <div className={styles.reviewItemImage}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <ShoppingBag opacity={0.2} />
                      )}
                    </div>
                    <div className={styles.reviewItemInfo}>
                      <div className={styles.reviewItemName}>{item.name}</div>
                      <div className={styles.reviewItemMeta}>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.summaryBreakdown}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery Charges</span>
                  <span className={SHIPPING_FEE === 0 ? styles.freeText : ''}>
                    {SHIPPING_FEE === 0 ? 'FREE' : `₹${SHIPPING_FEE}`}
                  </span>
                </div>
              </div>

              <div className={styles.totalRow}>
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.stepContent}
          >
            <div className={styles.form}>
              <h3><CreditCard /> Payment Method</h3>
              <div className={styles.paymentGrid}>
                <label className={`${styles.paymentOption} ${paymentMethod === 'Online Payment' ? styles.activePayment : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'Online Payment'} 
                    onChange={() => {
                      setPaymentMethod('Online Payment');
                      setShowOnlinePopup(true);
                    }}
                  />
                  <div className={styles.paymentIcon}>
                    <CreditCard size={20} />
                  </div>
                  <div className={styles.paymentText}>
                    <span>Online Payment</span>
                    <small>UPI, Cards, Netbanking</small>
                  </div>
                </label>

                <label className={`${styles.paymentOption} ${paymentMethod === 'Cash on Delivery' ? styles.activePayment : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'Cash on Delivery'} 
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                  />
                  <div className={styles.paymentIcon}>
                    <Truck size={20} />
                  </div>
                  <div className={styles.paymentText}>
                    <span>Cash on Delivery</span>
                    <small>Pay on arrival</small>
                  </div>
                </label>

                <label className={`${styles.paymentOption} ${paymentMethod === 'UPI' ? styles.activePayment : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'UPI'} 
                    onChange={() => setPaymentMethod('UPI')}
                  />
                  <div className={styles.paymentIcon}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div className={styles.paymentText}>
                    <span>UPI</span>
                    <small>Google Pay, PhonePe, Paytm</small>
                  </div>
                </label>

                <label className={`${styles.paymentOption} ${paymentMethod === 'Bank Transfer' ? styles.activePayment : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'Bank Transfer'} 
                    onChange={() => setPaymentMethod('Bank Transfer')}
                  />
                  <div className={styles.paymentIcon}>
                    <ShieldCheck size={20} />
                  </div>
                  <div className={styles.paymentText}>
                    <span>Bank Transfer</span>
                    <small>Direct Manual Transfer</small>
                  </div>
                </label>
              </div>

              {paymentMethod === 'UPI' && (
                <motion.div 
                  key="upi-details"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={styles.upiInputWrapper}
                >
                  <div className={styles.upiFlex}>
                    <div className={styles.qrCodeSection}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=saptaroma@okaxis%26pn=SaptAroma%26am=${finalTotal}%26cu=INR`} 
                        alt="UPI QR Code" 
                      />
                      <span>Scan to Pay</span>
                    </div>
                    <div className={styles.upiFormSection}>
                      <label>Enter your UPI ID after paying</label>
                      <input 
                        type="text" 
                        placeholder="username@bankname" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <small>So we can verify your payment manually.</small>
                    </div>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <motion.div 
                  key="bank-details-input"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={styles.bankDetailsWrapper}
                >
                  <div className={styles.bankHeader}>
                    <ShieldCheck size={18} />
                    <span>Official Bank Details</span>
                  </div>
                  <div className={styles.bankGrid}>
                    <div className={styles.bankInfoItem}>
                      <label>Bank Name</label>
                      <p>HDFC BANK LTD</p>
                    </div>
                    <div className={styles.bankInfoItem}>
                      <label>Account Holder</label>
                      <p>SaptAroma Rituals Pvt Ltd</p>
                    </div>
                    <div className={styles.bankInfoItem}>
                      <label>Account Number</label>
                      <p>50200012345678</p>
                    </div>
                    <div className={styles.bankInfoItem}>
                      <label>IFSC Code</label>
                      <p>HDFC0001234</p>
                    </div>
                  </div>
                  
                  <div className={styles.bankInputForm}>
                    <h4>Your Transfer Details</h4>
                    <div className={styles.bankInputGrid}>
                      <div className={styles.inputGroup}>
                        <label>From Bank Name</label>
                        <input 
                          type="text" 
                          placeholder="Your Bank Name" 
                          value={bankInfo.userBankName}
                          onChange={(e) => setBankInfo(prev => ({ ...prev, userBankName: e.target.value }))}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Transaction ID / UTR</label>
                        <input 
                          type="text" 
                          placeholder="12-digit UTR Number" 
                          value={bankInfo.transactionId}
                          onChange={(e) => setBankInfo(prev => ({ ...prev, transactionId: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <small>* Please share the transaction screenshot with our support team after payment.</small>
                </motion.div>
              )}

              <AnimatePresence>
                {showOnlinePopup && (
                  <motion.div 
                    key="online-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.modalOverlay}
                    onClick={() => setShowOnlinePopup(false)}
                  >
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className={styles.paymentModal}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className={styles.modalHeader}>
                        <div className={styles.secureBadge}><ShieldCheck size={14} /> Secure Gateway</div>
                        <button onClick={() => setShowOnlinePopup(false)} className={styles.closeBtn}><X size={20} /></button>
                      </div>
                      <div className={styles.modalBody}>
                        <div className={styles.gatewayIcon}><CreditCard size={40} /></div>
                        <h3>Proceed to Secure Payment</h3>
                        <p>You will be redirected to our secure partner (Razorpay) to complete your transaction via UPI, Card, or Netbanking.</p>
                        <button 
                          className={styles.modalActionBtn}
                          onClick={() => {
                            setShowOnlinePopup(false);
                            handleSubmit();
                          }}
                        >
                          Pay Now (₹{finalTotal})
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(156, 126, 93, 0.05)', borderRadius: '15px', border: '1px solid rgba(156, 126, 93, 0.1)' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  Order Summary: ₹{finalTotal} for {cart.length} items.
                </p>
                <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Shipping to: {shippingInfo.city}, {shippingInfo.state}
                </p>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left Sidebar - Progress */}
          <div className={styles.progressWrapper}>
            <div className={styles.checkoutBrand}>
              <h2>SaptAroma</h2>
              <p>The Ritual Checkout</p>
            </div>
            
            <div className={styles.progressBar}>
              {STEPS.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`${styles.progressStep} ${currentStep === step.id ? styles.activeStep : ''} ${currentStep > step.id ? styles.completedStep : ''}`}
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                >
                  <div className={styles.stepIcon}>
                    {currentStep > step.id ? <CheckCircle2 size={18} /> : step.icon}
                  </div>
                  <div className={styles.stepInfo}>
                    <span className={styles.stepNumber}>Step 0{index + 1}</span>
                    <span className={styles.stepLabel}>{step.title}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.sidebarFooter}>
              <p>© 2026 SaptAroma Rituals.<br />Secure Botanical Journey.</p>
            </div>
          </div>

          {/* Right Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.formSection}>
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>

              <div className={styles.navigation}>
                {currentStep > 1 && (
                  <button onClick={prevStep} className={styles.btnBack} disabled={isSubmitting}>
                    <ChevronLeft size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    Back
                  </button>
                )}
                
                <div style={{ flex: 1 }}></div>
                
                {currentStep < 4 ? (
                  <button 
                    onClick={nextStep} 
                    className={`${styles.btnNext} ${currentStep === 2 && !policyAccepted ? styles.btnLocked : ''}`}
                    disabled={
                      (currentStep === 1 && (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city)) ||
                      (currentStep === 2 && !policyAccepted) ||
                      (currentStep === 4 && paymentMethod === 'UPI' && !upiId.includes('@')) ||
                      (currentStep === 4 && paymentMethod === 'Bank Transfer' && (!bankInfo.userBankName || !bankInfo.transactionId))
                    }
                  >
                    {currentStep === 2 && !policyAccepted ? (
                      <Lock size={18} style={{ marginRight: '10px' }} />
                    ) : null}
                    Continue to {STEPS[currentStep].title}
                    <ChevronRight size={20} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit} 
                    className={styles.btnNext} 
                    disabled={
                      isSubmitting || 
                      (paymentMethod === 'UPI' && !upiId.includes('@')) ||
                      (paymentMethod === 'Bank Transfer' && (!bankInfo.userBankName || !bankInfo.transactionId))
                    }
                  >
                    {isSubmitting ? (
                      'Processing...'
                    ) : (
                      <>
                        {paymentMethod === 'Online Payment' ? 'Pay & Place Order' : 'Place Order'}
                        <span>(₹{finalTotal})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
