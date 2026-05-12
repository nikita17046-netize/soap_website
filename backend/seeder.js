const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura_soaps';

const products = [
  { 
    name: 'Kesuda Soap', 
    price: 180, 
    originalPrice: 250,
    category: 'Soap', 
    images: ['/images/products/kesuda.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Traditional Kesuda flower soap for a cooling and refreshing bath.',
    ingredients: 'Kesuda Extract, Coconut Oil, Castor Oil, Shea Butter',
    benefits: 'Natural Cooling, Soothes Inflammation, Brightens Complexion'
  },
  { 
    name: 'Neem Tulsi Soap', 
    price: 150, 
    originalPrice: 200,
    category: 'Soap', 
    images: ['/images/products/neem_tulsi.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Antibacterial blend of Neem and Tulsi for deep skin purification.',
    ingredients: 'Pure Neem Oil, Tulsi Extract, Neem Leaf Powder, Olive Oil',
    benefits: 'Antibacterial, Deep Cleansing, Fights Acne'
  },
  { 
    name: 'Aloe Vera Soap', 
    price: 160, 
    originalPrice: 220,
    category: 'Soap', 
    images: ['/aloe.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Ultra-hydrating soap with pure aloe vera gel for sensitive skin.',
    ingredients: 'Aloe Vera Gel, Glycerin, Vitamin E, Jojoba Oil',
    benefits: 'Intense Hydration, Soothes Sunburn, Gentle on Skin'
  },
  { 
    name: 'Rose Petals Soap', 
    price: 200, 
    originalPrice: 280,
    category: 'Soap', 
    images: ['/images/products/rose.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Luxurious soap with real rose petals and rosehip oil.',
    ingredients: 'Rose Petals, Rosehip Oil, Pink Clay, Almond Oil',
    benefits: 'Anti-aging, Skin Toning, Romantic Aroma'
  },
  { 
    name: 'Rice Potato Soap', 
    price: 170, 
    originalPrice: 240,
    category: 'Soap', 
    images: ['/images/products/powder.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Brightening soap with rice water and potato extract to reduce tanning.',
    ingredients: 'Rice Flour, Potato Juice, Turmeric, Shea Butter',
    benefits: 'Skin Brightening, Reduces Dark Spots, Even Skin Tone'
  },
  { 
    name: 'Charcoal Soap', 
    price: 190, 
    originalPrice: 260,
    category: 'Soap', 
    images: ['/charcoal.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Deep cleansing activated charcoal for detoxified skin.',
    ingredients: 'Activated Charcoal, Peppermint Oil, Tea Tree Oil',
    benefits: 'Pore Detox, Oil Control, Refreshing'
  },
  { 
    name: 'De-tane Soap', 
    price: 180, 
    originalPrice: 250,
    category: 'Soap', 
    images: ['/citrus.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Formulated to remove sun tan and restore natural complexion.',
    ingredients: 'Lemon Extract, Kojic Acid, Licorice Root',
    benefits: 'Tan Removal, Sun Damage Repair, Glowing Skin'
  },
  { 
    name: 'Chandan Soap', 
    price: 220, 
    originalPrice: 300,
    category: 'Soap', 
    images: ['/sandalwood.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Sacred Sandalwood soap for a meditative and cooling bath.',
    ingredients: 'Mysore Sandalwood Oil, Saffron, Turmeric',
    benefits: 'Divine Fragrance, Cooling Effect, Antiseptic'
  },
  { 
    name: 'Kesar Soap', 
    price: 250, 
    originalPrice: 350,
    category: 'Soap', 
    images: ['/sandalwood.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Premium Saffron soap for ultimate skin radiance and glow.',
    ingredients: 'Kashmiri Saffron, Goat Milk, Honey',
    benefits: 'Royal Glow, Improves Texture, Anti-inflammatory'
  },
  { 
    name: 'Lemon Soap', 
    price: 140, 
    originalPrice: 200,
    category: 'Soap', 
    images: ['/lemongrass.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Zesty lemon soap for an energizing and refreshing wash.',
    ingredients: 'Lemon Oil, Vitamin C, Glycerin',
    benefits: 'Energizing, Antibacterial, Skin Brightening'
  },
  { 
    name: 'Honey Turmeric Soap', 
    price: 160, 
    originalPrice: 230,
    category: 'Soap', 
    images: ['/turmeric.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Moisturizing honey and healing turmeric for healthy skin.',
    ingredients: 'Raw Honey, Organic Turmeric, Milk Protein',
    benefits: 'Healing, Moisturizing, Natural Glow'
  },
  { 
    name: 'Coffee Soap', 
    price: 170, 
    originalPrice: 240,
    category: 'Soap', 
    images: ['/coffee.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Exfoliating coffee soap to revitalize skin and reduce cellulite.',
    ingredients: 'Ground Coffee Beans, Caffeine Extract, Coconut Oil',
    benefits: 'Exfoliating, Circulation Boost, Refreshing'
  },
  { 
    name: 'Ayurvedic Shampoo', 
    price: 450, 
    originalPrice: 600,
    category: 'Shampoo', 
    images: ['/images/products/shampoo.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Traditional Ayurvedic hair cleanser with Amla, Reetha, and Shikakai.',
    ingredients: 'Amla, Reetha, Shikakai, Bhringraj, Aloe Vera',
    benefits: 'Hair Growth, Scalp Health, Natural Shine'
  },
  { 
    name: 'Orange Peel Powder', 
    price: 120, 
    originalPrice: 180,
    category: 'Herbal Powder', 
    images: ['/images/products/powder.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Natural vitamin C booster for skin brightening face masks.',
    ingredients: '100% Pure Dried Orange Peel Powder',
    benefits: 'Brightening, Oil Control, Rich in Vitamin C'
  },
  { 
    name: 'Multani Mitti Powder', 
    price: 100, 
    originalPrice: 150,
    category: 'Herbal Powder', 
    images: ['/images/products/powder.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Authentic Indian Fullers Earth for deep pore cleansing.',
    ingredients: 'Natural Multani Mitti (Fullers Earth)',
    benefits: 'Deep Cleansing, Removes Excess Oil, Tightens Pores'
  },
  { 
    name: 'Green French Clay', 
    price: 250, 
    originalPrice: 350,
    category: 'Herbal Powder', 
    images: ['/images/products/powder.png', '/images/products/gallery-1.png', '/images/products/gallery-2.png', '/images/products/gallery-3.png'],
    stock: 50,
    description: 'Premium mineral-rich clay for detoxifying face and body masks.',
    ingredients: 'Pure Green French Clay',
    benefits: 'Detoxification, Mineral Infusion, Skin Tightening'
  }
];

const importData = async () => {
  try {
    await mongoose.connect(mongoURI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
