export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  fullDescription?: string;
  ingredients?: string[];
  benefits?: string[];
  ritual?: string;
}

export const PRODUCTS: Product[] = [
  // Soaps
  { 
    id: 1, 
    name: 'Kesuda Soap', 
    price: 180, 
    originalPrice: 250, 
    image: '/images/products/kesuda.png', 
    images: ['/images/products/kesuda.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Traditional Kesuda flower soap for a cooling and refreshing bath.',
    fullDescription: 'Our Kesuda Soap is handcrafted with the purest extract of Butea Monosperma (Kesuda) flowers. Traditionally used in Ayurveda for its skin-cooling properties, this soap helps soothe inflammation and provides a natural glow.',
    ingredients: ['Kesuda Extract', 'Coconut Oil', 'Castor Oil', 'Shea Butter'],
    benefits: ['Natural Cooling', 'Soothes Inflammation', 'Brightens Complexion'],
    ritual: 'Lather and massage over body. Let the herbal essence penetrate for 1 minute before rinsing.'
  },
  { 
    id: 2, 
    name: 'Neem Tulsi Soap', 
    price: 150, 
    originalPrice: 200, 
    image: '/images/products/neem_tulsi.png', 
    images: ['/images/products/neem_tulsi.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Antibacterial blend of Neem and Tulsi for deep skin purification.',
    fullDescription: 'A powerful Ayurvedic combination of Neem and Tulsi. Known for their antimicrobial properties, this soap helps fight acne, rashes, and infections while keeping the skin hydrated.',
    ingredients: ['Pure Neem Oil', 'Tulsi Extract', 'Neem Leaf Powder', 'Olive Oil'],
    benefits: ['Antibacterial', 'Deep Cleansing', 'Fights Acne'],
    ritual: 'Ideal for daily use. Focus on areas prone to breakouts.'
  },
  { 
    id: 3, 
    name: 'Aloe Vera Soap', 
    price: 160, 
    originalPrice: 220, 
    image: '/aloe.png', 
    images: ['/aloe.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Ultra-hydrating soap with pure aloe vera gel for sensitive skin.',
    ingredients: ['Aloe Vera Gel', 'Glycerin', 'Vitamin E', 'Jojoba Oil'],
    benefits: ['Intense Hydration', 'Soothes Sunburn', 'Gentle on Skin'],
    ritual: 'Perfect for post-sun exposure or dry skin.'
  },
  { 
    id: 4, 
    name: 'Rose Petals Soap', 
    price: 200, 
    originalPrice: 280, 
    image: '/images/products/rose.png', 
    images: ['/images/products/rose.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Luxurious soap with real rose petals and rosehip oil.',
    ingredients: ['Rose Petals', 'Rosehip Oil', 'Pink Clay', 'Almond Oil'],
    benefits: ['Anti-aging', 'Skin Toning', 'Romantic Aroma'],
    ritual: 'Enjoy a spa-like experience at home. Let the floral scent relax your mind.'
  },
  { 
    id: 5, 
    name: 'Rice Potato Soap', 
    price: 170, 
    originalPrice: 240, 
    image: '/images/products/powder.png', 
    images: ['/images/products/powder.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Brightening soap with rice water and potato extract to reduce tanning.',
    ingredients: ['Rice Flour', 'Potato Juice', 'Turmeric', 'Shea Butter'],
    benefits: ['Skin Brightening', 'Reduces Dark Spots', 'Even Skin Tone'],
    ritual: 'Massage in circular motions to allow the rice flour to gently exfoliate.'
  },
  { 
    id: 6, 
    name: 'Charcoal Soap', 
    price: 190, 
    originalPrice: 260, 
    image: '/charcoal.png', 
    images: ['/charcoal.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Deep cleansing activated charcoal for detoxified skin.',
    ingredients: ['Activated Charcoal', 'Peppermint Oil', 'Tea Tree Oil'],
    benefits: ['Pore Detox', 'Oil Control', 'Refreshing'],
    ritual: 'Use as a detox bar twice a week for best results.'
  },
  { 
    id: 7, 
    name: 'De-tane Soap', 
    price: 180, 
    image: '/citrus.png', 
    images: ['/citrus.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Formulated to remove sun tan and restore natural complexion.',
    ingredients: ['Lemon Extract', 'Kojic Acid', 'Licorice Root'],
    benefits: ['Tan Removal', 'Sun Damage Repair', 'Glowing Skin'],
    ritual: 'Apply on tanned areas and leave for 2 minutes before rinsing.'
  },
  { 
    id: 8, 
    name: 'Chandan Soap', 
    price: 220, 
    originalPrice: 300, 
    image: '/sandalwood.png', 
    images: ['/sandalwood.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Sacred Sandalwood soap for a meditative and cooling bath.',
    ingredients: ['Mysore Sandalwood Oil', 'Saffron', 'Turmeric'],
    benefits: ['Divine Fragrance', 'Cooling Effect', 'Antiseptic'],
    ritual: 'Close your eyes and breathe in the aroma during your bath.'
  },
  { 
    id: 9, 
    name: 'Kesar Soap', 
    price: 250, 
    originalPrice: 350, 
    image: '/sandalwood.png', 
    images: ['/sandalwood.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Premium Saffron soap for ultimate skin radiance and glow.',
    ingredients: ['Kashmiri Saffron', 'Goat Milk', 'Honey'],
    benefits: ['Royal Glow', 'Improves Texture', 'Anti-inflammatory'],
    ritual: 'Ideal for special occasions or daily luxury.'
  },
  { 
    id: 10, 
    name: 'Lemon Soap', 
    price: 140, 
    originalPrice: 200, 
    image: '/lemongrass.png', 
    images: ['/lemongrass.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Zesty lemon soap for an energizing and refreshing wash.',
    ingredients: ['Lemon Oil', 'Vitamin C', 'Glycerin'],
    benefits: ['Energizing', 'Antibacterial', 'Skin Brightening'],
    ritual: 'Perfect for morning showers to wake up your senses.'
  },
  { 
    id: 11, 
    name: 'Honey Turmeric Soap', 
    price: 160, 
    image: '/turmeric.png', 
    images: ['/turmeric.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Moisturizing honey and healing turmeric for healthy skin.',
    ingredients: ['Raw Honey', 'Organic Turmeric', 'Milk Protein'],
    benefits: ['Healing', 'Moisturizing', 'Natural Glow'],
    ritual: 'Great for dry or irritated skin.'
  },
  { 
    id: 12, 
    name: 'Coffee Soap', 
    price: 170, 
    originalPrice: 240, 
    image: '/coffee.png', 
    images: ['/coffee.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Soap', 
    description: 'Exfoliating coffee soap to revitalize skin and reduce cellulite.',
    ingredients: ['Ground Coffee Beans', 'Caffeine Extract', 'Coconut Oil'],
    benefits: ['Exfoliating', 'Circulation Boost', 'Refreshing'],
    ritual: 'Massage in circles to stimulate blood flow.'
  },
  // Shampoo
  { 
    id: 13, 
    name: 'Ayurvedic Shampoo', 
    price: 450, 
    originalPrice: 600, 
    image: '/images/products/shampoo.png', 
    images: ['/images/products/shampoo.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    category: 'Shampoo', 
    description: 'Traditional Ayurvedic hair cleanser with Amla, Reetha, and Shikakai.',
    fullDescription: 'Our Ayurvedic Shampoo is a holistic hair care solution. It gently cleanses the scalp without stripping natural oils, promotes hair growth, and prevents premature graying.',
    ingredients: ['Amla', 'Reetha', 'Shikakai', 'Bhringraj', 'Aloe Vera'],
    benefits: ['Hair Growth', 'Scalp Health', 'Natural Shine'],
    ritual: 'Apply to wet hair, massage into scalp for 2 minutes, and rinse thoroughly.'
  },
  // Herbal Powders
  { 
    id: 14, 
    name: 'Orange Peel Powder', 
    price: 120, 
    originalPrice: 180, 
    image: '/images/products/powder.png', 
    images: ['/images/products/powder.png', '/images/products/powder.png', '/images/products/powder.png', '/images/products/powder.png'],
    category: 'Herbal Powder', 
    description: 'Natural vitamin C booster for skin brightening face masks.',
    ingredients: ['100% Pure Dried Orange Peel Powder'],
    benefits: ['Brightening', 'Oil Control', 'Rich in Vitamin C'],
    ritual: 'Mix with water or rose water to form a paste. Apply and leave for 15 minutes.'
  },
  { 
    id: 15, 
    name: 'Multani Mitti Powder', 
    price: 100, 
    originalPrice: 150, 
    image: '/images/products/powder.png', 
    images: ['/images/products/powder.png', '/images/products/powder.png', '/images/products/powder.png', '/images/products/powder.png'],
    category: 'Herbal Powder', 
    description: 'Authentic Indian Fullers Earth for deep pore cleansing.',
    ingredients: ['Natural Multani Mitti (Fullers Earth)'],
    benefits: ['Deep Cleansing', 'Removes Excess Oil', 'Tightens Pores'],
    ritual: 'Mix with curd or honey for dry skin, or rose water for oily skin.'
  },
  { 
    id: 16, 
    name: 'Green French Clay', 
    price: 250, 
    originalPrice: 350, 
    image: '/images/products/powder.png', 
    images: ['/images/products/powder.png', '/images/products/powder.png', '/images/products/powder.png', '/images/products/powder.png'],
    category: 'Herbal Powder', 
    description: 'Premium mineral-rich clay for detoxifying face and body masks.',
    ingredients: ['Pure Green French Clay'],
    benefits: ['Detoxification', 'Mineral Infusion', 'Skin Tightening'],
    ritual: 'Apply a thin layer to clean skin. Rinse before it completely dries.'
  }
];
