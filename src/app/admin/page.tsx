'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Admin.module.css';

// Initial products to seed localStorage if empty
const INITIAL_PRODUCTS = [
  { id: '1', name: 'Lavender Ritual', price: 850, category: 'Floral', stock: 45, image: '/soap-1.png' },
  { id: '2', name: 'Midnight Charcoal', price: 950, category: 'Detox', stock: 12, image: '/soap-2.png' },
  { id: '3', name: 'Golden Honey', price: 1200, category: 'Healing', stock: 30, image: '/soap-3.png' },
  { id: '4', name: 'The Trio Set', price: 2400, category: 'Bundle', stock: 15, isOffer: true, offerLabel: 'BEST VALUE', image: '/trio-set.png' }
];

const AdminPanel = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    isOffer: false,
    offerLabel: ''
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/login');
    }

    // Load Products
    const savedProducts = localStorage.getItem('aura-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('aura-products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // Load Orders
    const savedOrders = localStorage.getItem('aura-orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    // Load Users
    const registeredUsers = JSON.parse(localStorage.getItem('aura-registered-users') || '[]');
    setUsers(registeredUsers);
  }, [isAdmin, isLoading, router]);

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
        stock: product.stock.toString(),
        isOffer: product.isOffer || false,
        offerLabel: product.offerLabel || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: '', stock: '', isOffer: false, offerLabel: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedProducts;
    
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? { 
        ...p, 
        ...formData, 
        price: parseFloat(formData.price), 
        stock: parseInt(formData.stock) 
      } : p);
    } else {
      const newProduct = {
        ...formData,
        id: Date.now().toString(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: '/soap-1.png' // Placeholder
      };
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem('aura-products', JSON.stringify(updatedProducts));
    setIsModalOpen(false);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this ritual?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('aura-products', JSON.stringify(updated));
    }
  };

  // Order Actions
  const updateOrderStatus = (orderId: string, status: string) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updatedOrders);
    localStorage.setItem('aura-orders', JSON.stringify(updatedOrders));
    
    const allOrders = JSON.parse(localStorage.getItem('aura-orders') || '[]');
    const globalUpdated = allOrders.map((o: any) => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem('aura-orders', JSON.stringify(globalUpdated));
  };

  const deleteOrder = (id: string) => {
    if (confirm('Cancel this ritual order?')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem('aura-orders', JSON.stringify(updated));
    }
  };

  if (isLoading || !isAdmin) return <div className={styles.loading}>Verifying Credentials...</div>;

  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + parseFloat(o.total) : sum, 0);
  const offerProducts = products.filter(p => p.isOffer);

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>AURA<br/><span>ADMIN</span></div>
        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.activeNav : ''}`} onClick={() => setActiveTab('dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span>Overview</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'products' ? styles.activeNav : ''}`} onClick={() => setActiveTab('products')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8V21H3V8"></path><path d="M1 3H23V8H1V3Z"></path></svg>
            <span>Products</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'orders' ? styles.activeNav : ''}`} onClick={() => setActiveTab('orders')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path></svg>
            <span>Orders</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'users' ? styles.activeNav : ''}`} onClick={() => setActiveTab('users')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Users</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === 'offers' ? styles.activeNav : ''}`} onClick={() => setActiveTab('offers')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            <span>Offers</span>
          </button>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>
            {activeTab === 'dashboard' && 'Market Analytics'}
            {activeTab === 'products' && 'Product Gallery'}
            {activeTab === 'orders' && 'Fulfillment Hub'}
            {activeTab === 'users' && 'User Directory'}
            {activeTab === 'offers' && 'Promotional Offers'}
          </h1>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <div className={styles.statsGrid}>
              <div className={styles.statCard}><span>Revenue</span><h2>₹{totalRevenue.toLocaleString()}</h2></div>
              <div className={styles.statCard}><span>Total Orders</span><h2>{orders.length}</h2></div>
              <div className={styles.statCard}><span>Registered Users</span><h2>{users.length}</h2></div>
              <div className={styles.statCard}><span>Live Offers</span><h2>{offerProducts.length}</h2></div>
            </div>
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}><h3>Latest Rituals Sold</h3></div>
              <table className={styles.adminTable}>
                <thead><tr><th>Order ID</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
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
          <div className="animate-fade-in">
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}><h3>Inventory Control</h3><button className={styles.addBtn} onClick={() => openModal()}>+ Add Product</button></div>
              <table className={styles.adminTable}>
                <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.name} {p.isOffer && <span className={styles.offerMiniBadge}>Offer</span>}</td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button className={styles.actionBtn} onClick={() => openModal(p)}>Edit</button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => deleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}><h3>Customer Fulfillment</h3></div>
              <table className={styles.adminTable}>
                <thead><tr><th>ID</th><th>Customer</th><th>Items</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.shippingInfo?.fullName}</td>
                      <td>{order.items.map((it: any, i: number) => <div key={i}>{it.name} x{it.quantity}</div>)}</td>
                      <td>
                        <select className={styles.statusSelect} value={order.status || 'Pending'} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                          <option value="Pending">Pending</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td><button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => deleteOrder(order.id)}>X</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}><h3>Active Customers</h3></div>
              <table className={styles.adminTable}>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={styles.userRoleTag}>{u.email === 'admin@soap.com' ? 'Administrator' : 'Customer'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="animate-fade-in">
            <div className={styles.tableWrapper}>
              <div className={styles.tableHeader}><h3>Live Promotional Items</h3></div>
              <table className={styles.adminTable}>
                <thead><tr><th>Product Name</th><th>Offer Tag</th><th>Price</th><th>Action</th></tr></thead>
                <tbody>
                  {offerProducts.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td><span className={styles.offerStatusBadge}>{p.offerLabel}</span></td>
                      <td>₹{p.price}</td>
                      <td><button className={styles.actionBtn} onClick={() => openModal(p)}>Edit Deal</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal for Product Add/Edit */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{editingProduct ? 'Update Ritual' : 'Create New Ritual'}</h3>
            <form onSubmit={handleSaveProduct}>
              <div className={styles.formGroup}><label>Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className={styles.formGroup}><label>Price</label><input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required /></div>
                <div className={styles.formGroup}><label>Stock</label><input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required /></div>
              </div>
              <div className={styles.formGroup}><label>Category</label><input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required /></div>
              <div className={styles.formGroup} style={{ flexDirection: 'row', gap: '10px' }}><input type="checkbox" checked={formData.isOffer} onChange={(e) => setFormData({...formData, isOffer: e.target.checked})} /><label>Active Offer</label></div>
              {formData.isOffer && <div className={styles.formGroup}><label>Offer Badge (e.g. 50% OFF)</label><input type="text" value={formData.offerLabel} onChange={(e) => setFormData({...formData, offerLabel: e.target.value})} /></div>}
              <div className={styles.modalActions}><button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className={styles.saveBtn}>Apply Changes</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
