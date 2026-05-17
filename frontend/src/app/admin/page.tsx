'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, Ticket, MessageSquare, LogOut, Plus, Edit2, Trash2, CheckCircle, Package, Send,
  AlertTriangle, TrendingUp, Activity, BarChart3, Filter, Search, FileText, Heart, RefreshCw, Sparkles, Zap, Smile
} from 'lucide-react';
import { PRODUCTS } from '@/constants/products';
import styles from './Admin.module.css';

const API_URL = 'http://127.0.0.1:8000/api';

const AdminPanel = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isAiWidgetOpen, setIsAiWidgetOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);
  const [aiKeywords, setAiKeywords] = useState('');
  const [generatedAiContent, setGeneratedAiContent] = useState('');
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState<any[]>([
    { role: 'ai', text: 'Namaste! I am your AI Business Consultant. How can I help you grow SaptAroma today?' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<any>(null);

  // About Details Management State
  const [aboutDetails, setAboutDetails] = useState<any[]>([]);
  const [editingAbout, setEditingAbout] = useState<any>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedAboutTab, setSelectedAboutTab] = useState<'all' | 'milestone' | 'stage' | 'botanical' | 'quest'>('all');
  const [aboutFormData, setAboutFormData] = useState({
    type: 'milestone',
    title: '',
    subtitle: '',
    value: '',
    description: ''
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    weight: '100g',
    stock: '',
    image1: '/soap-1.png',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
    description: '',
    fullDescription: '',
    ingredients: '',
    benefits: '',
    ritual: '',
    isOffer: false,
    offerLabel: '',
    originalPrice: ''
  });

  const displayProducts = React.useMemo(() => {
    const combined = [...products];
    PRODUCTS.forEach(staticProd => {
      const exists = products.find(p => p.name === staticProd.name || (p._id && p._id === staticProd.id));
      if (!exists) combined.push(staticProd);
    });
    // Final deduplication by ID just in case
    const unique = [];
    const seen = new Set();
    for (const p of combined) {
      const key = p._id || p.id;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }
    return unique;
  }, [products]);

  const fetchData = async () => {
    if (!user?.token) return;
    const headers = { 'Authorization': `Bearer ${user.token}` };

    try {
      const [prodRes, ordRes, usrRes, msgRes, abtRes] = await Promise.all([
        fetch(`${API_URL}/products?t=${Date.now()}`),
        fetch(`${API_URL}/orders`, { headers }),
        fetch(`${API_URL}/users`, { headers }),
        fetch(`${API_URL}/messages?t=${Date.now()}`, { headers }),
        fetch(`${API_URL}/about?t=${Date.now()}`)
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (usrRes.ok) setUsers(await usrRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
      if (abtRes.ok) setAboutDetails(await abtRes.json());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  // About CRUD Actions
  const openAboutModal = (detail: any = null) => {
    if (detail) {
      setEditingAbout(detail);
      setAboutFormData({
        type: detail.type,
        title: detail.title,
        subtitle: detail.subtitle || '',
        value: detail.value || '',
        description: detail.description
      });
    } else {
      setEditingAbout(null);
      setAboutFormData({
        type: 'milestone',
        title: '',
        subtitle: '',
        value: '',
        description: ''
      });
    }
    setIsAboutModalOpen(true);
  };

  const handleSaveAboutDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    };

    try {
      const isMock = editingAbout && (
        editingAbout._id.startsWith('m') ||
        editingAbout._id.startsWith('s') ||
        editingAbout._id.startsWith('b') ||
        editingAbout._id.startsWith('q')
      );
      const url = (editingAbout && !isMock) ? `${API_URL}/about/${editingAbout._id}` : `${API_URL}/about`;
      const method = (editingAbout && !isMock) ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(aboutFormData)
      });

      if (response.ok) {
        alert(editingAbout ? 'About detail updated!' : 'New detail added successfully!');
        setIsAboutModalOpen(false);
        setEditingAbout(null);
        await fetchData();
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error('Error saving about detail:', err);
      alert('Network error while saving about detail.');
    }
  };

  const handleDeleteAboutDetail = async (id: string) => {
    if (!confirm('Are you sure you want to delete this detail?')) return;
    try {
      const response = await fetch(`${API_URL}/about/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (response.ok) {
        alert('Detail deleted successfully!');
        await fetchData();
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/login');
    }
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, isLoading, router, user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Product Actions
  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        weight: product.weight || '100g',
        stock: product.stock.toString(),
        description: product.description || '',
        fullDescription: product.fullDescription || '',
        ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : (product.ingredients || ''),
        benefits: Array.isArray(product.benefits) ? product.benefits.join(', ') : (product.benefits || ''),
        ritual: product.ritual || '',
        image1: product.images?.[0] || product.image || '/soap-1.png',
        image2: product.images?.[1] || '',
        image3: product.images?.[2] || '',
        image4: product.images?.[3] || '',
        image5: product.images?.[4] || '',
        isOffer: product.isOffer || false,
        offerLabel: product.offerLabel || '',
        originalPrice: product.originalPrice?.toString() || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: '', category: 'Soap', weight: '100g', stock: '50',
        description: '', fullDescription: '', ingredients: '', benefits: '', ritual: '',
        image1: '', image2: '', image3: '', image4: '', image5: '',
        isOffer: false, offerLabel: '', originalPrice: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    };

    // Critical: If it doesn't have a MongoDB _id, it's a new entry for our database
    const isNewForDB = !editingProduct?._id;
    const productId = editingProduct?._id;

    try {
      const url = isNewForDB ? `${API_URL}/products` : `${API_URL}/products/${productId}`;
      const method = isNewForDB ? 'POST' : 'PUT';

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        weight: formData.weight,
        stock: parseInt(formData.stock),
        description: formData.description,
        fullDescription: formData.fullDescription,
        ingredients: formData.ingredients,
        benefits: formData.benefits,
        ritual: formData.ritual,
        isOffer: formData.isOffer,
        offerLabel: formData.offerLabel,
        images: [formData.image1, formData.image2, formData.image3, formData.image4, formData.image5].filter(img => img !== '')
      };

      console.log('Saving product with payload:', payload);

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedData = await response.json();
        console.log('Server response:', savedData);
        alert(editingProduct ? 'Ritual updated successfully!' : 'New ritual created!');
        
        // Update local state immediately for responsiveness
        setProducts(prev => {
          if (editingProduct) {
            return prev.map(p => (p._id === savedData._id || p.id === savedData.id) ? savedData : p);
          } else {
            return [...prev, savedData];
          }
        });

        await fetchData(); // Refresh everything else
        setIsModalOpen(false);
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.message || 'Failed to save ritual'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Network error. Please check if backend is running.');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this ritual?')) {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        
        if (response.ok) {
          alert('Product deleted successfully!');
          // Update local state immediately
          setProducts(prev => prev.filter(p => (p._id || p.id.toString()) !== id));
          await fetchData();
        } else {
          const errData = await response.json();
          alert(`Error: ${errData.message || 'Failed to delete product'}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Network error while deleting product.');
      }
    }
  };

  // Order Actions
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Message Actions
  const handleReplyMessage = async (id: string) => {
    const text = replyText[id];
    if (!text?.trim()) return;

    try {
      const response = await fetch(`${API_URL}/messages/${id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ reply: text })
      });
      if (response.ok) {
        fetchData();
        setReplyText(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        alert('Reply sent successfully!');
      }
    } catch (error) {
      console.error('Error replying to message:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderImageSlot = (num: number, field: string, required = false) => (
    <div className={styles.imageSlot}>
      <div className={styles.imageSlotHeader}>
        <label>Image {num} {required && '(Required)'}</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, field)}
          id={`file-${field}`}
          className={styles.fileInput}
        />
        <label htmlFor={`file-${field}`} className={styles.fileLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Upload
        </label>
      </div>
      <input
        type="text"
        value={(formData as any)[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        placeholder="Paste Image URL"
        required={required}
      />
      {(formData as any)[field] && (
        <div className={styles.imagePreview}>
          <img src={(formData as any)[field]} alt={`Preview ${num}`} />
          <button type="button" onClick={() => setFormData({ ...formData, [field]: '' })} className={styles.removeImg}>×</button>
        </div>
      )}
    </div>
  );

  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + parseFloat(o.total) : sum, 0);
  const categories = ['All', ...Array.from(new Set(displayProducts.map(p => p.category)))];

  const generateAiMarketing = async () => {
    if (!aiKeywords.trim()) return;
    setIsAiLoading(true);
    // Simulate AI Generation
    setTimeout(() => {
      const content = `✨ New Ritual Unveiled: ${aiKeywords} ✨\n\nExperience the essence of nature with our latest artisanal creation. Hand-poured with love and botanical wisdom. 🌿\n\n💎 Key Benefits:\n- Pure Organic Ingredients\n- Sustainable Craftsmanship\n- Sensory Bliss\n\nElevate your daily ritual today. Shop now at SaptAroma. 🕯️\n\n#SaptAroma #ArtisanalSoap #BotanicalRitual #SustainableLuxury #HandmadeInIndia`;
      setGeneratedAiContent(content);
      setIsAiLoading(false);
    }, 1500);
  };

  const filteredProducts = displayProducts.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(adminSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const offerProducts = displayProducts.filter(p => p.isOffer);

  const refreshAllData = () => {
    fetchData();
  };

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div style={{ background: 'white', padding: '10px', borderRadius: '15px', display: 'inline-block', marginBottom: '15px' }}>
            <img src="/logo.png" alt="SaptAroma Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
          </div>
          <br />
          SaptAroma<br /><span>ADMIN</span>
        </div>
        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.activeNav : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'products' ? styles.activeNav : ''}`} onClick={() => setActiveTab('products')}>
            <ShoppingBag size={20} />
            <span>Products</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'orders' ? styles.activeNav : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={20} />
            <span>Orders</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'users' ? styles.activeNav : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={20} /> <span>Users</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'wishlists' ? styles.activeNav : ''}`} onClick={() => setActiveTab('wishlists')}>
            <Heart size={20} /> <span>Wishlists</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'offers' ? styles.activeNav : ''}`} onClick={() => setActiveTab('offers')}>
            <Ticket size={20} /> <span>Offers</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'ai' ? styles.activeNav : ''}`} onClick={() => setActiveTab('ai')}>
            <Sparkles size={20} /> <span>AI Hub</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'messages' ? styles.activeNav : ''}`} onClick={() => setActiveTab('messages')}>
            <MessageSquare size={20} />
            <span>Messages</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'about' ? styles.activeNav : ''}`} onClick={() => setActiveTab('about')}>
            <FileText size={20} />
            <span>About Details</span>
          </button>
        </nav>

        <div className={styles.sidebarBox} onClick={() => setIsDiagnosticsOpen(true)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Store Health</h4>
            <span style={{ fontSize: '0.6rem', color: 'var(--accent-secondary)', opacity: 0.8 }}>DETAILS →</span>
          </div>
          <p>System operational & synced with cloud database.</p>
          <div className={styles.statusIndicator}>
            <div className={styles.statusDot}></div>
            Live Status
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} style={{ marginRight: '10px' }} />
          Sign Out
        </button>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>
            {activeTab === 'dashboard' && 'Market Analytics'}
            {activeTab === 'products' && 'Product Gallery'}
            {activeTab === 'orders' && 'Fulfillment Hub'}
            {activeTab === 'users' && 'User Directory'}
            {activeTab === 'wishlists' && 'Wishlist Intelligence'}
            {activeTab === 'offers' && 'Promotional Offers'}
            {activeTab === 'messages' && 'Customer Inquiries'}
            {activeTab === 'about' && 'About Us Manager'}
          </h1>
          <button className={styles.refreshBtn} onClick={refreshAllData} title="Refresh Latest Data">
            <RefreshCw size={18} /> Sync Data
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <div key="dashboard-tab" className="animate-fade-in" suppressHydrationWarning>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}><span>Revenue</span><h2>₹{totalRevenue.toLocaleString()}</h2></div>
              <div className={styles.statCard}><span>Total Orders</span><h2>{orders.length}</h2></div>
              <div className={styles.statCard}><span>Registered Users</span><h2>{users.length}</h2></div>
              <div className={styles.statCard}><span>Live Offers</span><h2>{offerProducts.length}</h2></div>
            </div>

            {/* Main Analytics Row */}
            <div className={styles.dashboardGrid}>
              <div className={styles.chartWrapper}>
                <div className={styles.chartHeader}>
                  <h3>Ritual Activity</h3>
                  <p>Order frequency and customer engagement (7-Day Area)</p>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      data={[
                        { day: 'Mon', orders: 12 },
                        { day: 'Tue', orders: 25 },
                        { day: 'Wed', orders: 15 },
                        { day: 'Thu', orders: 48 },
                        { day: 'Fri', orders: 32 },
                        { day: 'Sat', orders: 65 },
                        { day: 'Sun', orders: 54 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorOrders)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.chartWrapper}>
                <div className={styles.chartHeader}>
                  <h3>Category Mix</h3>
                  <p>Revenue distribution by ritual type</p>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Botanical', value: 400 },
                          { name: 'Essential', value: 300 },
                          { name: 'Limited', value: 200 },
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                        <Cell fill="#fbbf24" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Smart Inventory Radar */}
              <div className={styles.chartWrapper} style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className={styles.chartHeader}>
                  <h3 style={{ color: '#fbbf24' }}>Inventory Smart Radar</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>AI Predicted Restock Priorities</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  {products.filter(p => p.stock < 15).slice(0, 3).map((p, i) => (
                    <div key={i} style={{ padding: '15px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Est. Depletion: **3 Days**</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ef4444' }}>{p.stock} units</div>
                        <div style={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 800 }}>RESTOCK BY MAY 22</div>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => p.stock < 15).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                      <Package size={30} style={{ marginBottom: '10px', opacity: 0.3 }} />
                      <p>All rituals are optimally stocked.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Insights Row */}
            <div className={styles.secondaryGrid}>
              {/* Stock Alerts */}
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <h3>Critical Stock Alerts</h3>
                  <AlertTriangle size={20} color="#ef4444" />
                </div>
                <div className={styles.dataList}>
                  {products.filter(p => p.stock < 15).slice(0, 4).map(p => (
                    <div key={p._id} className={styles.dataItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemIcon} style={{ background: '#fef2f2', color: '#ef4444' }}>
                          <Package size={18} />
                        </div>
                        <div className={styles.itemText}>
                          <span className={styles.itemName}>{p.name}</span>
                          <span className={styles.itemSub}>{p.category}</span>
                        </div>
                      </div>
                      <span className={`${styles.itemValue} ${styles.stockLow}`}>{p.stock} Left</span>
                    </div>
                  ))}
                  {products.filter(p => p.stock < 15).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>All rituals are well-stocked.</div>
                  )}
                </div>
              </div>

              {/* Top Products */}
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <h3>Top Performing Rituals</h3>
                  <TrendingUp size={20} color="#10b981" />
                </div>
                <div className={styles.dataList}>
                  {products.slice(0, 4).map(p => (
                    <div key={p._id} className={styles.dataItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemIcon} style={{ background: '#f0fdf4', color: '#10b981' }}>
                          <ShoppingBag size={18} />
                        </div>
                        <div className={styles.itemText}>
                          <span className={styles.itemName}>{p.name}</span>
                          <span className={styles.itemSub}>{p.price} Ritual Credits</span>
                        </div>
                      </div>
                      <span className={styles.itemValue}>{(Math.random() * 50 + 10).toFixed(0)} Sales</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Latest Orders Table */}
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}>
                <h3>Real-time Fulfillment Hub</h3>
                <Activity size={20} color="#3b82f6" />
              </div>
              <table className={styles.adminTable}>
                <thead><tr><th>Order ID</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8)}</td>
                      <td>{order.shippingInfo?.fullName || 'Guest'}</td>
                      <td><span className={`${styles.statusTag} ${styles['status' + (order.status || 'Pending')]}`}>{order.status || 'Pending'}</span></td>
                      <td>₹{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div key="products-tab" className="animate-fade-in" suppressHydrationWarning>
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <h3>Inventory Control</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage your collection of {displayProducts.length} rituals</p>
                </div>
                <button className={styles.addBtn} onClick={() => openModal()}>
                  <Plus size={18} style={{ marginRight: '8px' }} />
                  Add Ritual
                </button>
              </div>

              {/* Category Filter Bar */}
              <div className={styles.adminFilterBar}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '20px' }}>
                  <div className={styles.adminSearchInputWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search by ritual name..." 
                      value={adminSearchQuery}
                      onChange={(e) => setAdminSearchQuery(e.target.value)}
                      className={styles.adminSearchInput}
                    />
                  </div>
                  <div className={styles.categoryScroll}>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        className={`${styles.filterChip} ${selectedCategory === cat ? styles.activeChip : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <table className={styles.adminTable}>
                <thead><tr><th>Ritual</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p._id || p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.images?.[0] || p.image || '/soap-1.png'} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 700 }}>{p.name}</div>
                            {p.isOffer && <span className={styles.offerMiniBadge}>Live Deal</span>}
                          </div>
                        </div>
                      </td>
                      <td><span className={styles.categoryTag}>{p.category}</span></td>
                      <td>₹{p.price}</td>
                      <td>
                        <span className={`${styles.stockCount} ${p.stock < 15 ? styles.low : ''}`}>
                          {p.stock || 50}
                        </span>
                      </td>
                      <td>
                        <button className={styles.actionBtn} onClick={() => openModal(p)} title="Edit Ritual">
                          <Edit2 size={16} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => deleteProduct(p._id || p.id.toString())} title="Delete Ritual">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div key="orders-tab" className="animate-fade-in" suppressHydrationWarning>
            {/* Order Quick Stats */}
            <div className={styles.orderStatsRow}>
              <div className={`${styles.orderStatMini} ${styles.statPending}`}>
                <span className={styles.statLabel}>Pending</span>
                <span className={styles.statValue}>{orders.filter(o => o.status === 'Pending' || !o.status).length}</span>
              </div>
              <div className={`${styles.orderStatMini} ${styles.statShipped}`}>
                <span className={styles.statLabel}>Shipped</span>
                <span className={styles.statValue}>{orders.filter(o => o.status === 'Shipped').length}</span>
              </div>
              <div className={`${styles.orderStatMini} ${styles.statDelivered}`}>
                <span className={styles.statLabel}>Delivered</span>
                <span className={styles.statValue}>{orders.filter(o => o.status === 'Delivered').length}</span>
              </div>
              <div className={`${styles.orderStatMini} ${styles.statTotal}`}>
                <span className={styles.statLabel}>Total Orders</span>
                <span className={styles.statValue}>{orders.length}</span>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div>
                    <h3>Customer Fulfillment</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage active shipments and deliveries</p>
                  </div>
                  <div className={styles.adminSearchInputWrapper} style={{ maxWidth: '400px' }}>
                    <Search size={16} className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search by Order ID, Name or Email..." 
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className={styles.adminSearchInput}
                    />
                  </div>
                </div>
              </div>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Order Info</th>
                    <th>Customer & Shipping</th>
                    <th>Items & Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter(order => {
                      const search = orderSearchQuery.toLowerCase();
                      return (
                        order._id.toLowerCase().includes(search) ||
                        order.shippingInfo?.fullName.toLowerCase().includes(search) ||
                        order.shippingInfo?.email.toLowerCase().includes(search)
                      );
                    })
                    .map(order => (
                    <tr key={order._id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>#{order._id.slice(-8)}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                        <div className={styles.paymentTag}>{order.shippingInfo?.paymentMethod || 'Prepaid'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{order.shippingInfo?.fullName}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '200px' }}>
                          {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.zipCode}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>{order.shippingInfo?.email}</div>
                      </td>
                      <td>
                        <div className={styles.itemsList}>
                          {order.items.map((it: any, i: number) => (
                            <div key={i} className={styles.miniItem}>
                              <span>{it.name}</span>
                              <span className={styles.qty}>x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className={styles.orderTotal}>₹{order.total.toLocaleString()}</div>
                      </td>
                      <td>
                        <select 
                          className={`${styles.statusSelect} ${styles['status' + (order.status || 'Pending')]}`} 
                          value={order.status || 'Pending'} 
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className={styles.actionBtn} 
                            onClick={() => {
                              setSelectedInvoiceOrder(order);
                              setIsInvoiceOpen(true);
                            }} 
                            title="Generate Invoice"
                          >
                            <FileText size={16} />
                          </button>
                          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Remove Record">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div key="users-tab" className="animate-fade-in" suppressHydrationWarning>
            <div className={styles.statsGrid} style={{ marginBottom: '30px' }}>
              <div className={styles.statCard}>
                <span>Avg. Customer Value</span>
                <h2>₹{(orders.reduce((s,o) => s + parseFloat(o.total), 0) / (users.length || 1)).toFixed(0)}</h2>
              </div>
              <div className={styles.statCard}>
                <span>Active Artisans</span>
                <h2>{users.length}</h2>
              </div>
              <div className={styles.statCard}>
                <span>Repeat Purchase Rate</span>
                <h2>{((users.filter(u => orders.filter(o => o.shippingInfo?.email === u.email).length > 1).length / (users.length || 1)) * 100).toFixed(0)}%</h2>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}><h3>Active Customers</h3></div>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Customer & Status</th>
                    <th>Email Address</th>
                    <th>Lifetime Value</th>
                    <th>Joined</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const userOrders = orders.filter(o => o.shippingInfo?.email === u.email && o.status !== 'Cancelled');
                    const totalSpend = userOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
                    const orderCount = userOrders.length;
                    
                    let tier = 'Ritualist';
                    let tierColor = '#94a3b8';
                    if (totalSpend > 5000) { tier = 'Elite'; tierColor = '#d4af37'; }
                    else if (totalSpend > 2000) { tier = 'Loyalty'; tierColor = '#10b981'; }

                    return (
                      <tr key={u._id} onClick={() => setSelectedUserForDetail(u)} style={{ cursor: 'pointer' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className={styles.userAvatar} style={{ background: tierColor + '20', color: tierColor }}>{u.name.charAt(0)}</div>
                            <div>
                              <div style={{ fontWeight: 700 }}>{u.name}</div>
                              <span style={{ fontSize: '0.7rem', color: tierColor, fontWeight: 800, textTransform: 'uppercase' }}>{tier} Member</span>
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>₹{totalSpend.toLocaleString()}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{orderCount} Orders</div>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td><span className={u.isAdmin ? styles.adminBadge : styles.userBadge}>{u.isAdmin ? 'Admin' : 'Customer'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'wishlists' && (
          <div key="wishlists-tab" className="animate-fade-in" suppressHydrationWarning>
            {/* Wishlist Analytics */}
            <div className={styles.orderStatsRow}>
              <div className={`${styles.orderStatMini} ${styles.statTotal}`}>
                <span className={styles.statLabel}>Total Saved Items</span>
                <span className={styles.statValue}>
                  {users.reduce((acc, u) => acc + (u.wishlist?.length || 0), 0)}
                </span>
              </div>
              <div className={`${styles.orderStatMini} ${styles.statShipped}`}>
                <span className={styles.statLabel}>Active Wishlists</span>
                <span className={styles.statValue}>
                  {users.filter(u => u.wishlist && u.wishlist.length > 0).length}
                </span>
              </div>
            </div>

            <div className={styles.wishlistGrid}>
              {users.filter(u => u.wishlist && u.wishlist.length > 0).length > 0 ? (
                users.filter(u => u.wishlist && u.wishlist.length > 0).map(u => (
                  <div key={u._id} className={styles.wishlistCard} onClick={() => setSelectedUserForDetail(u)} style={{ cursor: 'pointer' }}>
                    <div className={styles.wishlistUser}>
                      <div className={styles.userAvatar}>{u.name.charAt(0)}</div>
                      <div>
                        <h4>{u.name}</h4>
                        <span>{u.email}</span>
                      </div>
                    </div>
                    <div className={styles.wishlistItems}>
                      {u.wishlist.map((pid: string) => {
                        // Find product in either DB products or static PRODUCTS
                        const item = [...products, ...PRODUCTS].find(p => 
                          (p._id?.toString() === pid.toString()) || 
                          (p.id?.toString() === pid.toString())
                        );
                        
                        if (!item) return null;

                        return (
                          <div key={pid} className={styles.wishlistItemMini}>
                            <img src={item.images?.[0] || item.image || '/soap-1.png'} alt={item.name} />
                            <div className={styles.itemMiniInfo}>
                              <p>{item.name}</p>
                              <span>₹{item.price}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.wishlistFooter}>
                      <span>{u.wishlist.length} Items saved</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Heart size={48} color="#cbd5e1" />
                  <p>No customer wishlists found yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div key="offers-tab" className="animate-fade-in" suppressHydrationWarning>
            {/* Offer Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span>Active Offers</span>
                <h2>{offerProducts.length}</h2>
              </div>
              <div className={styles.statCard}>
                <span>Featured Deals</span>
                <h2>{offerProducts.filter(p => p.offerLabel?.toLowerCase().includes('featured') || p.offerLabel?.toLowerCase().includes('deal')).length}</h2>
              </div>
              <div className={styles.statCard}>
                <span>Avg. Discount</span>
                <h2>~25%</h2>
              </div>
              <div className={styles.statCard}>
                <span>Non-Offer Items</span>
                <h2>{displayProducts.length - offerProducts.length}</h2>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}>
                <div>
                  <h3>Live Promotional Rituals</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Currently appearing in the 'Offers' section of the shop</p>
                </div>
              </div>
              
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Ritual</th>
                    <th>Price</th>
                    <th>Offer Label</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offerProducts.map(p => (
                    <tr key={p._id || p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.images?.[0] || p.image || '/soap-1.png'} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ fontWeight: 700 }}>{p.name}</div>
                        </div>
                      </td>
                      <td>₹{p.price}</td>
                      <td>
                        <span className={styles.offerStatusBadge} style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800 }}>
                          {p.offerLabel || 'SPECIAL OFFER'}
                        </span>
                      </td>
                      <td>
                        <span className={styles.stockCount}>ACTIVE</span>
                      </td>
                      <td>
                        <button className={styles.actionBtn} onClick={() => openModal(p)} title="Edit Deal">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                          onClick={async () => {
                            if (confirm('Remove this product from live offers?')) {
                              try {
                                const res = await fetch(`${API_URL}/products/${p._id || p.id}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user?.token}`
                                  },
                                  body: JSON.stringify({ ...p, isOffer: false })
                                });
                                if (res.ok) fetchData();
                              } catch (err) { console.error(err); }
                            }
                          }}
                          title="Remove from Offers"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {offerProducts.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No active offers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick Add Section */}
            <div className={styles.tableWrapper} style={{ marginTop: '40px' }}>
              <div className={styles.tableHeader}>
                <div>
                  <h3>Add Rituals to Offers</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Select from existing collection to launch new deals</p>
                </div>
              </div>
              <div className={styles.adminFilterBar}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px', width: '100%' }}>
                  {displayProducts.filter(p => !p.isOffer).slice(0, 8).map(p => (
                    <div key={p._id || p.id} style={{ background: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={p.images?.[0] || p.image || '/soap-1.png'} alt={p.name} style={{ width: '35px', height: '35px', borderRadius: '6px' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.name}</span>
                      </div>
                      <button 
                        className={styles.addBtn} 
                        style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                        onClick={() => openModal({ ...p, isOffer: true, offerLabel: 'FLASH DEAL' })}
                      >
                        Launch Deal
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div key="ai-hub-tab" className="animate-fade-in" suppressHydrationWarning>
            {/* Header with Pulse Animation */}
            <div className={styles.header} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                  padding: '15px', borderRadius: '20px', color: '#fff',
                  boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
                  position: 'relative'
                }}>
                  <Sparkles size={30} />
                  <div style={{ 
                    position: 'absolute', top: '-5px', right: '-5px', width: '12px', height: '12px', 
                    background: '#10b981', borderRadius: '50%', border: '3px solid #fff' 
                  }}></div>
                </div>
                <div>
                  <h1 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>Artisan AI Command</h1>
                  <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>
                    Global Store Intelligence & Automated Growth Engine.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Global Stats */}
            <div className={styles.statsGrid} style={{ marginBottom: '30px' }}>
              <div className={styles.statCard} style={{ borderLeft: '6px solid #6366f1', background: 'rgba(99, 102, 241, 0.02)' }}>
                <span>Site Intelligence Health</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <h2 style={{ color: '#4338ca' }}>98.4%</h2>
                  <span style={{ color: '#10b981', fontSize: '0.8rem' }}>Optimal</span>
                </div>
              </div>
              <div className={styles.statCard} style={{ borderLeft: '6px solid #ec4899', background: 'rgba(236, 72, 153, 0.02)' }}>
                <span>AI Predicted Growth</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <h2 style={{ color: '#be185d' }}>+18.2%</h2>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Next Qtr</span>
                </div>
              </div>
              <div className={styles.statCard} style={{ borderLeft: '6px solid #f59e0b', background: 'rgba(245, 158, 11, 0.02)' }}>
                <span>Sentiment Index</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <h2 style={{ color: '#b45309' }}>94/100</h2>
                  <span style={{ color: '#10b981', fontSize: '0.8rem' }}>Positive</span>
                </div>
              </div>
              <div className={styles.statCard} style={{ borderLeft: '6px solid #10b981', background: 'rgba(16, 185, 129, 0.02)' }}>
                <span>SEO Visibility Score</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <h2 style={{ color: '#047857' }}>82.1</h2>
                  <span style={{ color: '#10b981', fontSize: '0.8rem' }}>Increasing</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginBottom: '30px' }}>
              {/* Product Muse & Social Suite */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className={styles.chartWrapper} style={{ border: '1px solid rgba(79, 70, 229, 0.1)', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Zap size={22} color="#4f46e5" />
                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>AI Marketing Studio</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className={styles.formGroup}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 900 }}>Product Concept / Keywords</label>
                      <textarea 
                        placeholder="e.g., Midnight Rose, Activated Charcoal, Deep Cleansing, Minimalist Aesthetics..."
                        style={{ minHeight: '80px', borderRadius: '15px' }}
                        value={aiKeywords}
                        onChange={(e) => setAiKeywords(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <button 
                      className={styles.saveBtn}
                      style={{ 
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        boxShadow: '0 10px 25px rgba(79, 70, 229, 0.2)'
                      }}
                      disabled={isAiLoading}
                      onClick={generateAiMarketing}
                    >
                      {isAiLoading ? 'AI IS DREAMING...' : 'GENERATE FULL CAMPAIGN'}
                    </button>

                    {generatedAiContent && (
                      <div className="animate-fade-in" style={{ 
                        padding: '25px', background: '#f5f3ff', borderRadius: '24px', border: '1px dashed #7c3aed' 
                      }}>
                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', lineHeight: '1.7' }}>
                          {generatedAiContent}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.chartWrapper}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <LayoutDashboard size={22} color="#10b981" />
                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>AI Strategy Room</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '15px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.7rem', color: '#166534', marginBottom: '5px' }}>NEW PRODUCT OPPORTUNITY</div>
                      <p style={{ fontSize: '0.9rem', color: '#14532d', margin: 0 }}>
                        "Based on recent search trends, a **Himalayan Pink Salt & Grapefruit** scrub bar would likely achieve **400% ROI** if launched by next month."
                      </p>
                    </div>
                    <div style={{ padding: '15px', background: '#eff6ff', borderRadius: '15px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.7rem', color: '#1e40af', marginBottom: '5px' }}>PRICING STRATEGY</div>
                      <p style={{ fontSize: '0.9rem', color: '#1e3a8a', margin: 0 }}>
                        "AI suggests a **Bundle Offer** (Buy 3 Get 1 Free) for the 'Earth Series' to clear aging stock while maintaining premium brand perception."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className={styles.chartWrapper}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <TrendingUp size={22} color="#f59e0b" />
                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Market Pulse</h3>
                  </div>
                  <div className={styles.dataList}>
                    <div className={styles.dataItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemIcon} style={{ color: '#ef4444', background: '#fef2f2' }}><TrendingUp size={16} /></div>
                        <div className={styles.itemText}><span className={styles.itemName}>Charcoal Demand</span><span className={styles.itemSub}>Search Volume Up</span></div>
                      </div>
                      <div className={styles.itemValue}>+45%</div>
                    </div>
                    <div className={styles.dataItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemIcon} style={{ color: '#3b82f6', background: '#eff6ff' }}><TrendingUp size={16} /></div>
                        <div className={styles.itemText}><span className={styles.itemName}>Luxury Gifting</span><span className={styles.itemSub}>Seasonal Trend</span></div>
                      </div>
                      <div className={styles.itemValue}>+22%</div>
                    </div>
                  </div>
                </div>

                <div className={styles.chartWrapper} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Users size={22} color="#fbbf24" />
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>VIP Predictions</h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>AI identified users most likely to become high-value customers this month.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {users.slice(0, 3).map((u, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#fbbf24', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.7rem' }}>
                            {u.name.charAt(0)}
                          </div>
                          <span style={{ fontSize: '0.85rem' }}>{u.name}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 800 }}>92% MATCH</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.chartWrapper}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <Smile size={22} color="#ec4899" />
                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Sentiment Pulse</h3>
                  </div>
                  <div style={{ padding: '20px', borderRadius: '20px', background: '#fdf2f8', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌿</div>
                    <div style={{ fontWeight: 800, color: '#be185d' }}>"NATURE LOVER" ERA</div>
                    <p style={{ fontSize: '0.8rem', color: '#9d174d', marginTop: '5px' }}>Customers are currently obsessed with earthy, natural scents. Launch 'Forest Mist' bar soon.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Consultant Chat */}
            <div className={styles.chartWrapper} style={{ marginTop: '30px', border: '1px solid #4f46e5', background: '#f8faff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <MessageSquare size={22} color="#4f46e5" />
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Consult with AI Artisan</h3>
              </div>
              
              <div style={{ height: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px', background: '#fff', borderRadius: '15px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                {aiChatMessages.map((msg, i) => (
                  <div key={i} style={{ 
                    alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                    background: msg.role === 'ai' ? '#f1f5f9' : '#4f46e5',
                    color: msg.role === 'ai' ? '#1e293b' : '#fff',
                    padding: '12px 18px',
                    borderRadius: '20px',
                    borderBottomLeftRadius: msg.role === 'ai' ? '0' : '20px',
                    maxWidth: '80%',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Ask AI: 'Which soap is in demand?' or 'Suggest an offer...'"
                  style={{ flex: 1, padding: '15px 20px', borderRadius: '50px', border: '1px solid #e2e8f0', outline: 'none' }}
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = aiChatInput.trim().toLowerCase();
                      if (!input) return;
                      const newMessages = [...aiChatMessages, { role: 'user', text: aiChatInput }];
                      setAiChatMessages(newMessages);
                      setAiChatInput('');
                      setTimeout(() => {
                        let response = "Analyzing data... I suggest focusing on your top 3 bestsellers this weekend.";
                        if (input.includes('demand')) response = "Midnight Charcoal is currently trending with 45% more views than last week.";
                        if (input.includes('offer')) response = "Try a 10% discount for first-time buyers to build your customer base.";
                        setAiChatMessages([...newMessages, { role: 'ai', text: response }]);
                      }, 1000);
                    }
                  }}
                />
                <button 
                  style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '0 25px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}
                  onClick={() => {
                    const input = aiChatInput.trim().toLowerCase();
                    if (!input) return;
                    const newMessages = [...aiChatMessages, { role: 'user', text: aiChatInput }];
                    setAiChatMessages(newMessages);
                    setAiChatInput('');
                    setTimeout(() => {
                      let response = "Analyzing data... I suggest focusing on your top 3 bestsellers this weekend.";
                      if (input.includes('demand')) response = "Midnight Charcoal is currently trending with 45% more views than last week.";
                      if (input.includes('offer')) response = "Try a 10% discount for first-time buyers to build your customer base.";
                      setAiChatMessages([...newMessages, { role: 'ai', text: response }]);
                    }, 1000);
                  }}
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div key="messages-tab" className="animate-fade-in" suppressHydrationWarning>
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}><h3>Inbox</h3></div>
              {messages.length > 0 ? (
                <table className={styles.adminTable}>
                  <thead><tr><th>Date</th><th>Sender</th><th>Subject</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {messages.map(msg => (
                      <tr key={msg._id} style={{ opacity: msg.status === 'Read' ? 0.6 : 1 }}>
                        <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                        <td>
                          <strong>{msg.name}</strong><br />
                          <small>{msg.email}</small>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>{msg.subject}</span><br />
                          {msg.message}
                        </td>
                        <td><span className={`${styles.statusTag} ${msg.status === 'Read' ? styles.statusDelivered : styles.statusPending}`}>{msg.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {msg.reply && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {msg.reply.split('|NEXT|').map((r: string, idx: number) => {
                                  const isAdmin = r.startsWith('ADMIN:');
                                  const cleanText = r.replace(/^(ADMIN:|USER:)\s*/, '');
                                  
                                  return (
                                    <div key={idx} style={{ 
                                      fontSize: '0.85rem', 
                                      color: 'var(--accent-primary)', 
                                      background: isAdmin ? 'rgba(var(--accent-secondary-rgb, 156, 126, 93), 0.05)' : 'rgba(var(--accent-primary-rgb, 0, 0, 0), 0.03)', 
                                      padding: '10px 15px', 
                                      borderRadius: '12px', 
                                      borderLeft: isAdmin ? '3px solid var(--accent-secondary)' : '3px solid #64748b',
                                      alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                                      maxWidth: '90%'
                                    }}>
                                      <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '4px', fontWeight: 800 }}>
                                        {isAdmin ? 'ADMIN' : 'CUSTOMER'}
                                      </div>
                                      {cleanText}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            
                            <div style={{ marginTop: '15px' }}>
                              <textarea
                                placeholder={msg.reply ? "Send a follow-up message to customer..." : "Write a professional reply..."}
                                style={{ 
                                  width: '100%', 
                                  padding: '15px', 
                                  borderRadius: '16px', 
                                  border: '1px solid rgba(var(--accent-secondary-rgb, 156, 126, 93), 0.2)', 
                                  fontSize: '0.9rem',
                                  background: 'var(--bg-primary)',
                                  color: 'var(--text-primary)',
                                  minHeight: '100px',
                                  outline: 'none',
                                  transition: 'all 0.3s ease',
                                  fontFamily: 'inherit'
                                }}
                                value={replyText[msg._id] || ''}
                                onChange={(e) => setReplyText({ ...replyText, [msg._id]: e.target.value })}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-secondary)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(var(--accent-secondary-rgb, 156, 126, 93), 0.2)'}
                              ></textarea>
                              <button
                                className={styles.actionBtn}
                                style={{ 
                                  marginTop: '12px', 
                                  background: 'linear-gradient(135deg, var(--accent-secondary) 0%, #a68b5a 100%)', 
                                  color: '#fff', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '10px',
                                  padding: '12px 25px',
                                  borderRadius: '50px',
                                  fontWeight: '700',
                                  letterSpacing: '0.5px',
                                  border: 'none',
                                  boxShadow: '0 4px 15px rgba(156, 126, 93, 0.2)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                                onClick={() => handleReplyMessage(msg._id)}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                              >
                                <Send size={14} />
                                {msg.reply ? 'Send Follow-up' : 'Send Reply'}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No inquiries found.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div key="about-tab" className="animate-fade-in" suppressHydrationWarning>
            {aboutDetails.length === 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
                border: '1px solid #f59e0b',
                padding: '25px', 
                borderRadius: '20px', 
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.05)'
              }}>
                <div>
                  <h4 style={{ margin: 0, color: '#92400e', fontSize: '1.1rem', fontFamily: 'Playfair Display' }}>🌿 Sync Default Sanctuary Details</h4>
                  <p style={{ margin: '5px 0 0', color: '#b45309', fontSize: '0.85rem' }}>
                    Your database about details are currently unseeded. Click sync to permanently populate all 16 handcrafted milestones, stages, botanical origins, and eco quests to MongoDB!
                  </p>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      alert('Initializing and syncing all 16 handcrafted default details in MongoDB database...');
                      const res = await fetch('http://127.0.0.1:8000/api/about');
                      if (res.ok) {
                        alert('All details successfully initialized and synced!');
                        await fetchData();
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Error initializing details.');
                    }
                  }}
                  style={{
                    background: '#92400e',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  SYNC ALL DATA NOW
                </button>
              </div>
            )}

            {/* Filter pills */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '35px', 
              flexWrap: 'wrap', 
              background: '#fff', 
              padding: '15px 25px', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
            }}>
              {[
                { id: 'all', label: '✨ Show All Sections' },
                { id: 'milestone', label: '🏆 Milestones & Stats' },
                { id: 'stage', label: '🧪 Saponification Stages' },
                { id: 'botanical', label: '🌿 Botanicals & Sourcing' },
                { id: 'quest', label: '🌍 Active Quests' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAboutTab(tab.id as any)}
                  style={{
                    background: selectedAboutTab === tab.id ? 'linear-gradient(135deg, var(--accent-secondary, #9c7e5d) 0%, #a68b5a 100%)' : '#f8fafc',
                    color: selectedAboutTab === tab.id ? '#fff' : '#64748b',
                    border: selectedAboutTab === tab.id ? '1px solid var(--accent-secondary, #9c7e5d)' : '1px solid #e2e8f0',
                    padding: '10px 22px',
                    borderRadius: '50px',
                    fontWeight: '800',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: selectedAboutTab === tab.id ? '0 8px 20px rgba(156, 126, 93, 0.25)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.tableWrapper} style={{ background: 'transparent', boxShadow: 'none' }}>
              {/* Grouped by Section Type */}
              {['milestone', 'stage', 'botanical', 'quest']
                .filter((sectType) => selectedAboutTab === 'all' || selectedAboutTab === sectType)
                .map((sectType) => {
                  const rawItems = aboutDetails.length > 0 ? aboutDetails : [
                    // Milestones
                    { _id: 'm1', type: 'milestone', title: 'Bars Hand-Cured', value: '15K+', description: 'Each bar is patiently cured for 42 days to ensure a rich, dense, and nourishing lather.' },
                    { _id: 'm2', type: 'milestone', title: 'Organic Botanical Farms', value: '25+', description: 'Directly sourcing pure botanicals, herbs, and oils from local organic family growers.' },
                    { _id: 'm3', type: 'milestone', title: 'Ritual Satisfaction', value: '99%', description: 'Loved by discerning clients seeking an absolute, chemical-free aromatherapy escape.' },
                    { _id: 'm4', type: 'milestone', title: 'Eco-Biodegradable', value: '100%', description: 'Ensuring our products leave zero toxic traces on your skin or the planet.' },
                    // Stages
                    { _id: 's1', type: 'stage', title: 'Botanical Selection', value: '01', description: 'We source fresh medicinal herbs, flowers, and roots at their peak seasonal potency. Herbs like Neem and Kesuda are wild-harvested during early morning hours to preserve active enzymes and antioxidants.' },
                    { _id: 's2', type: 'stage', title: 'Organic Oil Blending', value: '02', description: 'We formulate our base using premium food-grade organic oils, including virgin cold-pressed coconut oil, sweet almond oil, extra virgin olive oil, and organic shea butter. No palm oil is ever used.' },
                    { _id: 's3', type: 'stage', title: 'Slow Cold-Saponification', value: '03', description: 'Ingredients are blended at low temperatures (below 110°F) to protect heat-sensitive vitamins and nutrients. This chemical reaction naturally produces and retains 100% of the natural moisturizing glycerin.' },
                    { _id: 's4', type: 'stage', title: 'Hand-Pouring & Cutting', value: '04', description: 'The thick soap batter is poured into solid cedar wood molds and insulated for 48 hours. Once solid, the block is hand-sliced into individual bars and stamped with our signature copper emblem.' },
                    { _id: 's5', type: 'stage', title: 'The 42-Day Sanctuary Cure', value: '05', description: 'The sliced bars rest on custom cedar drying racks in a temperature-controlled curing chamber for 6 weeks. This cures the water content, making the bars incredibly hard, long-lasting, and remarkably mild on sensitive skin.' },
                    // Botanicals
                    { _id: 'b1', type: 'botanical', title: 'Kesuda (Flame of the Forest)', subtitle: 'Sourced from: foothills of gir forests', description: 'Used for centuries in Vedic rituals, Kesuda flowers are hand-collected at spring bloom. They provide active natural yellow-orange pigments and act as a powerful cooling agent, repairing skin irritation, blemishes, and maintaining a hydrated, radiant complexion.' },
                    { _id: 'b2', type: 'botanical', title: 'Artisanal Organic Neem', subtitle: 'Sourced from: certified organic farms', description: 'Highly anti-bacterial and loaded with skin-healing nimbin compounds. We steam-extract pure neem oil and blend crushed neem leaves directly into the soap batter to create a gentle, therapeutic exfoliant that purifies acne-prone skin and relieves dry eczema naturally.' },
                    { _id: 'b3', type: 'botanical', title: 'Pampore Saffron (Kesar)', subtitle: 'Sourced from: kashmiri saffron cooperatives', description: 'Known as "red gold", Pampore Saffron is harvested thread-by-thread under strict quality checks. Infused into our premium facial soap bars, it provides intense antioxidant shield, lightens dark spots, and imparts an incomparable golden glow.' },
                    { _id: 'b4', type: 'botanical', title: 'Wild Lemongrass', subtitle: 'Sourced from: western ghats steam distillery', description: 'Steam-distilled within hours of morning harvesting, wild lemongrass essential oil acts as a powerful natural astringent. It tones skin pores, balances excess sebum, and offers an uplifting aromatherapy scent that triggers deep sensory relaxation.' },
                    // Quests
                    { _id: 'q1', type: 'quest', title: 'Pure Water Conservation', subtitle: 'ACTIVE QUEST', description: 'Because our soaps are entirely biodegradable and free of chemical surfactants, our production and drainage leave river beds and underground aquifers completely pure and clean.' },
                    { _id: 'q2', type: 'quest', title: 'Zero-Plastic Seed Packaging', subtitle: 'ACTIVE QUEST', description: 'We pledge to remain 100% plastic-free. All products are wrapped in hand-stamped seeded plantable paper or stored in heavy, reusable glass bottles.' },
                    { _id: 'q3', type: 'quest', title: 'Artisan Empowerment', subtitle: 'ACTIVE QUEST', description: 'We employ and train local rural women, providing fair living wages and empowering them with the highly respected artisan trade of botanical preservation and oil pressing.' }
                  ];

                  const filtered = rawItems.filter((d) => d.type === sectType);
                  const titleMap: Record<string, string> = {
                    milestone: '🏆 Brand Milestones & Stats',
                    stage: '🧪 5 Saponification Stages',
                    botanical: '🌿 Rare Botanicals & Sourcing',
                    quest: '🌍 Active Brand Quests'
                  };

                  return (
                    <div key={sectType} style={{ 
                      marginTop: '10px', 
                      marginBottom: '40px',
                      background: '#fff',
                      borderRadius: '24px',
                      padding: '30px 40px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid rgba(156, 126, 93, 0.1)', paddingBottom: '12px' }}>
                        <h4 style={{ 
                          fontSize: '1.25rem', 
                          fontFamily: 'Playfair Display', 
                          color: 'var(--accent-primary)',
                          margin: 0
                        }}>
                          {titleMap[sectType]}
                        </h4>
                        {aboutDetails.length === 0 && (
                          <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#64748b', padding: '4px 12px', borderRadius: '50px', fontWeight: 700 }}>
                            FALLBACK PREVIEW (UNSYNCED)
                          </span>
                        )}
                      </div>

                      {filtered.length > 0 ? (
                        <table className={styles.adminTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '20%', paddingLeft: '0' }}>Title</th>
                              <th style={{ width: '15%' }}>Subtitle/Label</th>
                              <th style={{ width: '15%' }}>Value/Step</th>
                              <th style={{ width: '35%' }}>Description</th>
                              <th style={{ width: '15%', textAlign: 'right', paddingRight: '0' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((item) => {
                              const isMock = item._id.startsWith('m') || item._id.startsWith('s') || item._id.startsWith('b') || item._id.startsWith('q');
                              return (
                                <tr key={item._id}>
                                  <td style={{ paddingLeft: '0' }}><strong>{item.title}</strong></td>
                                  <td>
                                    <span className={styles.categoryTag} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px' }}>
                                      {item.subtitle || 'N/A'}
                                    </span>
                                  </td>
                                  <td>
                                    <span style={{ fontWeight: 800, color: 'var(--accent-secondary, #9c7e5d)', fontSize: '1.1rem' }}>
                                      {item.value || 'N/A'}
                                    </span>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#475569' }}>{item.description}</td>
                                  <td style={{ textAlign: 'right', paddingRight: '0' }}>
                                    <button className={styles.actionBtn} onClick={() => openAboutModal(item)} title="Edit Detail">
                                      <Edit2 size={16} />
                                    </button>
                                    {!isMock && (
                                      <button 
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                        onClick={() => handleDeleteAboutDetail(item._id)} 
                                        title="Delete Detail"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '15px', background: '#f8fafc', borderRadius: '12px', margin: 0 }}>
                          No items added to this section yet.
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* Modal for About Detail Add/Edit */}
      {isAboutModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAboutModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3>{editingAbout ? 'Edit About Detail' : 'Create About Detail'}</h3>
            <form onSubmit={handleSaveAboutDetail}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Section Type</label>
                  <select 
                    value={aboutFormData.type} 
                    onChange={(e) => setAboutFormData({ ...aboutFormData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      background: '#fff',
                      fontSize: '0.9rem',
                      color: '#000'
                    }}
                    required
                  >
                    <option value="milestone">Milestone (Stat Card)</option>
                    <option value="stage">Saponification Stage</option>
                    <option value="botanical">Rare Botanical / Sourcing</option>
                    <option value="quest">Brand Quest (Ecological Mission)</option>
                  </select>
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={aboutFormData.title} 
                    onChange={(e) => setAboutFormData({ ...aboutFormData, title: e.target.value })} 
                    placeholder="e.g. Kesuda (Flame of the Forest) or zero-waste seeds" 
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Subtitle / Origin / Badge Label</label>
                  <input 
                    type="text" 
                    value={aboutFormData.subtitle} 
                    onChange={(e) => setAboutFormData({ ...aboutFormData, subtitle: e.target.value })} 
                    placeholder="e.g. Sourced from: Gir Forests or ACTIVE QUEST" 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Value / Stat Number / Stage Step</label>
                  <input 
                    type="text" 
                    value={aboutFormData.value} 
                    onChange={(e) => setAboutFormData({ ...aboutFormData, value: e.target.value })} 
                    placeholder="e.g. 15K+, 99%, or 01, 02" 
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Detailed Description</label>
                  <textarea 
                    value={aboutFormData.description} 
                    onChange={(e) => setAboutFormData({ ...aboutFormData, description: e.target.value })} 
                    placeholder="Provide highly rich details..." 
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '15px',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                      color: '#000'
                    }}
                    required 
                  />
                </div>
              </div>

              <div className={styles.modalActions} style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsAboutModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save Details</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Product Add/Edit */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? 'Update Ritual' : 'Create New Ritual'}</h3>
            <form onSubmit={handleSaveProduct}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Ritual Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Lavender Bliss" required />
                </div>

                <div className={styles.formGroup}>
                  <label>Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" required />
                </div>

                <div className={styles.formGroup}>
                  <label>Original Price (₹) (Optional)</label>
                  <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="Before discount" />
                </div>

                <div className={styles.formGroup}>
                  <label>Stock (Units)</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="0" required />
                </div>

                <div className={styles.formGroup}>
                  <label>Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Essential" required />
                </div>

                <div className={styles.formGroup}>
                  <label>Weight (Grams)</label>
                  <input type="text" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g. 100g" required />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label style={{ marginBottom: '20px', display: 'block' }}>Ritual Imagery (1 Required + 4 Optional)</label>
                  <div className={styles.imageGrid}>
                    {renderImageSlot(1, 'image1', true)}
                    {renderImageSlot(2, 'image2')}
                    {renderImageSlot(3, 'image3')}
                    {renderImageSlot(4, 'image4')}
                    {renderImageSlot(5, 'image5')}
                  </div>
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Brief Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Short summary for grid..." rows={2} />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Full Detailed Description</label>
                  <textarea value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} placeholder="Detailed story and info..." rows={4} />
                </div>

                <div className={styles.formGroup}>
                  <label>Ingredients (Comma separated for tags)</label>
                  <textarea value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} placeholder="e.g. Aloe, Glycerin, Oil" rows={2} />
                </div>

                <div className={styles.formGroup}>
                  <label>Benefits (Comma separated for list)</label>
                  <textarea value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} placeholder="e.g. Hydrating, Soothing" rows={2} />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>The Ritual (Instructions)</label>
                  <textarea value={formData.ritual} onChange={(e) => setFormData({ ...formData, ritual: e.target.value })} placeholder="How to use this ritual..." rows={2} />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={formData.isOffer} onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                  <label style={{ margin: 0 }}>Active Promotional Offer (Show in Offers Section)</label>
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Promotional Label / Badge (e.g. 50% OFF, FLASH DEAL)</label>
                  <input type="text" value={formData.offerLabel} onChange={(e) => setFormData({ ...formData, offerLabel: e.target.value })} placeholder="Leave empty for auto-discount or no badge" />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px' }}>
                    Tip: Writing something here will override the automatic "-% OFF" calculation.
                  </p>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Discard</button>
                <button type="submit" className={styles.saveBtn}>Save Ritual Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrderForInvoice(null)}>
          <div className={`${styles.modal} ${styles.invoiceModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.invoiceActions}>
              <button className={styles.printBtn} onClick={() => window.print()}>
                <FileText size={16} /> Print / Save PDF
              </button>
              <button className={styles.closeBtn} onClick={() => setSelectedOrderForInvoice(null)}>×</button>
            </div>
            
            <div id="printable-invoice" className={styles.invoiceContent}>
              <div className={styles.invoiceHeader}>
                <div className={styles.invoiceLogo}>
                  <img src="/logo.png" alt="SaptAroma" />
                  <h2>SaptAroma Rituals</h2>
                </div>
                <div className={styles.invoiceMeta}>
                  <h3>INVOICE</h3>
                  <p>Order ID: #{selectedOrderForInvoice._id.slice(-12).toUpperCase()}</p>
                  <p>Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className={styles.invoiceDetails}>
                <div className={styles.invoiceCol}>
                  <h4>Billed To:</h4>
                  <strong>{selectedOrderForInvoice.shippingInfo.fullName}</strong>
                  <p>{selectedOrderForInvoice.shippingInfo.address}</p>
                  <p>{selectedOrderForInvoice.shippingInfo.city}, {selectedOrderForInvoice.shippingInfo.zipCode}</p>
                  <p>{selectedOrderForInvoice.shippingInfo.email}</p>
                </div>
                <div className={styles.invoiceCol}>
                  <h4>Payment Details:</h4>
                  <p>Method: {selectedOrderForInvoice.shippingInfo.paymentMethod}</p>
                  <p>Status: {selectedOrderForInvoice.status}</p>
                </div>
              </div>

              <table className={styles.invoiceTable}>
                <thead>
                  <tr>
                    <th>Ritual Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderForInvoice.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.invoiceSummary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>₹{selectedOrderForInvoice.total.toLocaleString()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>₹0 (FREE)</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Grand Total:</span>
                  <span>₹{selectedOrderForInvoice.total.toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.invoiceFooter}>
                <p>Thank you for choosing SaptAroma Rituals.</p>
                <p>For any queries, contact: support@saptaroma.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Customer Intelligence Modal */}
      {selectedUserForDetail && (
        <div className={styles.modalOverlay} onClick={() => setSelectedUserForDetail(null)}>
          <div className={`${styles.modal} ${styles.customerModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.customerHeader}>
              <div className={styles.customerProfile}>
                <div className={styles.largeAvatar}>{selectedUserForDetail.name.charAt(0)}</div>
                <div className={styles.customerMeta}>
                  <h2>{selectedUserForDetail.name}</h2>
                  <p>{selectedUserForDetail.email}</p>
                  <span className={styles.joinedDate}>Joined on {new Date(selectedUserForDetail.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedUserForDetail(null)}>×</button>
            </div>

            <div className={styles.customerDetailGrid}>
              {/* Wishlist Sidebar */}
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <h3>Saved Rituals</h3>
                  <Heart size={18} fill="currentColor" />
                </div>
                <div className={styles.wishlistItems}>
                  {selectedUserForDetail.wishlist.map((pid: string) => {
                    const item = [...products, ...PRODUCTS].find(p => (p._id || p.id).toString() === pid.toString());
                    if (!item) return null;
                    return (
                      <div key={pid} className={styles.wishlistItemMini}>
                        <img src={item.images?.[0] || item.image} alt={item.name} />
                        <div className={styles.itemMiniInfo}>
                          <p>{item.name}</p>
                          <span>₹{item.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order History Main */}
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <h3>Purchase History</h3>
                  <Package size={18} />
                </div>
                <div className={styles.orderHistoryList}>
                  {orders.filter(o => o.shippingInfo?.email === selectedUserForDetail.email).length > 0 ? (
                    orders.filter(o => o.shippingInfo?.email === selectedUserForDetail.email).map(order => (
                      <div key={order._id} className={styles.historyCard}>
                        <div className={styles.historyHeader}>
                          <span className={styles.historyId}>#{order._id.slice(-8).toUpperCase()}</span>
                          <span className={`${styles.statusTag} ${styles['status' + (order.status || 'Pending')]}`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        <div className={styles.historyDate}>{new Date(order.createdAt).toLocaleDateString()}</div>
                        <div className={styles.historyItems}>
                          {order.items.map((it: any, i: number) => (
                            <div key={i} className={styles.historyItemRow}>
                              <span>{it.name}</span>
                              <span className={styles.historyQty}>x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className={styles.historyTotal}>₹{order.total.toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyHistory}>No orders found for this customer.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* System Diagnostics Modal */}
      {isDiagnosticsOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDiagnosticsOpen(false)}>
          <div className={`${styles.modal} ${styles.diagnosticsModal}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity size={24} color="var(--accent-secondary)" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'Playfair Display' }}>System Intelligence</h2>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsDiagnosticsOpen(false)}>×</button>
            </div>

            <div className={styles.diagnosticsGrid} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>SERVER CORE</span>
                  <span style={{ color: '#10b981', fontWeight: 900, fontSize: '0.75rem' }}>ONLINE</span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: '#10b981' }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '5px' }}>DATABASE SYNC</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>100%</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '5px' }}>API LATENCY</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>42ms</div>
                </div>
              </div>

              <div style={{ padding: '0 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Cloud Backup</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Active (2h ago)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>SSL Encryption</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>Secure (AES-256)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Software Version</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>v2.8.4-Luxury</span>
                </div>
              </div>

              <button 
                onClick={() => { alert('Running deep diagnostic scan...'); }}
                style={{ 
                  marginTop: '10px', 
                  padding: '15px', 
                  borderRadius: '12px', 
                  background: '#0f172a', 
                  color: '#fff', 
                  border: 'none', 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  letterSpacing: '1px'
                }}
              >
                RUN SYSTEM SCAN
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating AI Widget Button */}
      <button 
        className={styles.aiFloatingBtn}
        onClick={() => setIsAiWidgetOpen(!isAiWidgetOpen)}
        title="Artisan's Eye - Quick Insights"
      >
        <Sparkles size={24} />
      </button>

      {/* AI Widget Panel */}
      {isAiWidgetOpen && (
        <div className={styles.aiWidgetPanel} style={{ animation: 'slideUp 0.3s ease' }}>
          <div className={styles.aiWidgetHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={18} color="#fbbf24" />
              <span>Artisan's Eye</span>
            </div>
            <button onClick={() => setIsAiWidgetOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>×</button>
          </div>
          <div className={styles.aiWidgetContent}>
            <div className={styles.aiInsightItem}>
              <small>TODAY'S MOMENTUM</small>
              <p>₹{orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).reduce((acc, o) => acc + o.total, 0).toLocaleString()} • {orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length} Orders</p>
            </div>
            <div className={styles.aiInsightItem}>
              <small>URGENT ALERT</small>
              <p style={{ color: '#fb7185' }}>{products.filter(p => p.stock < 5).length} Products running low on stock.</p>
            </div>
            <div className={styles.aiInsightItem}>
              <small>STRATEGY SUGGESTION</small>
              <p>Launch a 10% flash sale on **Floral Collection** to boost weekend traffic.</p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceOpen && selectedInvoiceOrder && (
        <div className={styles.modalOverlay} onClick={() => setIsInvoiceOpen(false)}>
          <div className={`${styles.modal} ${styles.invoiceModal}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', background: '#fff', padding: '0' }}>
            <div style={{ padding: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <img src="/logo.png" alt="SaptAroma" style={{ width: '50px', filter: 'brightness(0) invert(1)', marginBottom: '10px' }} />
                <h2 style={{ margin: 0, fontFamily: 'Playfair Display' }}>Official Invoice</h2>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.8rem' }}>#{selectedInvoiceOrder._id.slice(-8).toUpperCase()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>₹{selectedInvoiceOrder.total.toLocaleString()}</div>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.8rem' }}>Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style={{ padding: '40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                <div>
                  <h4 style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 900, marginBottom: '10px' }}>BILL TO:</h4>
                  <p style={{ margin: 0, fontWeight: 700 }}>{selectedInvoiceOrder.shippingInfo.name}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>{selectedInvoiceOrder.shippingInfo.email}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>{selectedInvoiceOrder.shippingInfo.address}, {selectedInvoiceOrder.shippingInfo.city}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 900, marginBottom: '10px' }}>PAYMENT METHOD:</h4>
                  <p style={{ margin: 0, fontWeight: 700 }}>{selectedInvoiceOrder.paymentMethod}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#10b981' }}>PAID via {selectedInvoiceOrder.paymentStatus}</p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    <th style={{ textAlign: 'left', padding: '15px 0', fontSize: '0.8rem', color: '#64748b' }}>ITEM RITUAL</th>
                    <th style={{ textAlign: 'center', padding: '15px 0', fontSize: '0.8rem', color: '#64748b' }}>QTY</th>
                    <th style={{ textAlign: 'right', padding: '15px 0', fontSize: '0.8rem', color: '#64748b' }}>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceOrder.items.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px 0', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '15px 0', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '15px 0', textAlign: 'right' }}>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '200px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#64748b' }}>Tax (GST 12%)</span>
                    <span>₹{(selectedInvoiceOrder.total * 0.12).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.2rem', paddingTop: '15px', borderTop: '2px solid #0f172a' }}>
                    <span>Total</span>
                    <span>₹{selectedInvoiceOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '30px', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Thank you for choosing SaptAroma Handcrafted Artisanal Soaps.</p>
              <button 
                onClick={() => window.print()} 
                style={{ marginTop: '20px', padding: '10px 30px', borderRadius: '50px', background: '#0f172a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >
                PRINT INVOICE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
