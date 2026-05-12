import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MegaMenu.module.css';
import { motion } from 'framer-motion';

interface MegaMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products for MegaMenu:', err);
      }
    };
    fetchProducts();
  }, []);

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category).slice(0, 5);
  };

  const categories = [
    {
      title: 'Our Soaps',
      category: 'Soap',
      items: getProductsByCategory('Soap').map(p => ({ 
        name: p.name, 
        path: `/shop/product/${p._id || p.id}`,
        isNew: new Date(p.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 * 30 // Added in last 30 days
      }))
    },
    {
      title: 'Herbal Powders',
      category: 'Herbal Powder',
      items: getProductsByCategory('Herbal Powder').map(p => ({ 
        name: p.name, 
        path: `/shop/product/${p._id || p.id}`,
        isNew: new Date(p.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 * 30
      }))
    },
    {
      title: 'Hair Care',
      category: 'Shampoo',
      items: getProductsByCategory('Shampoo').map(p => ({ 
        name: p.name, 
        path: `/shop/product/${p._id || p.id}`,
        isNew: new Date(p.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 * 30
      }))
    }
  ];

  const recentProducts = [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 1);

  const featured = recentProducts[0] || { name: 'Botanical Blend', image: '/images/products/kesuda.png', _id: '1' };
  const featuredIsNew = featured.createdAt && new Date(featured.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 * 30;

  return (
    <div className={styles.megaMenu}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {categories.map((cat, idx) => (
            <div key={idx} className={styles.column}>
              <h3 className={styles.columnTitle}>{cat.title}</h3>
              <ul className={styles.list}>
                {cat.items.map((item, i) => (
                  <li key={i} className={styles.listItem}>
                    <Link 
                      href={item.path} 
                      className={styles.link}
                      onClick={onClose}
                    >
                      {item.name}
                      {item.isNew && <span className={styles.newTag}>NEW</span>}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={`/shop?category=${cat.category}`} className={styles.boldLink} onClick={onClose}>
                    View All {cat.title}
                  </Link>
                </li>
              </ul>
            </div>
          ))}
          
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Shop by Concern</h3>
            <ul className={styles.list}>
              <li><Link href="/shop?search=Neem" className={styles.link} onClick={onClose}>Acne Control</Link></li>
              <li><Link href="/shop?search=De-tane" className={styles.link} onClick={onClose}>Tan Removal</Link></li>
              <li><Link href="/shop?search=Kesar" className={styles.link} onClick={onClose}>Skin Brightening</Link></li>
              <li><Link href="/shop?search=Charcoal" className={styles.link} onClick={onClose}>Deep Detox</Link></li>
            </ul>
          </div>

          <div className={styles.featured}>
            <div className={styles.featuredImage}>
              <Image 
                src={featured.images?.[0] || featured.image || '/images/products/kesuda.png'} 
                alt={featured.name} 
                fill 
                sizes="300px"
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.overlay}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span className={styles.tag}>LATEST ARRIVAL</span>
                  <span className={styles.newTagFeatured}>NEW</span>
                </div>
                <h4>{featured.name}</h4>
                <Link href={`/shop/product/${featured._id || featured.id}`} className={styles.shopNow} onClick={onClose}>
                  Shop Ritual
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
