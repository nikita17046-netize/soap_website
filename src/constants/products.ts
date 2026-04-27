export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  fullDescription?: string;
  ingredients?: string[];
  benefits?: string[];
  ritual?: string;
}

export const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: 'Calm Lavender', 
    price: 350, 
    image: '/lavender.png', 
    category: 'Floral', 
    description: 'Infused with organic lavender oil and dried buds for a soothing bath experience.',
    fullDescription: 'Our Calm Lavender bar is a sanctuary in a soap. Handcrafted using traditional cold-process methods, it retains the natural glycerin for maximum hydration. The lavender oil is sourced from high-altitude fields, known for its superior calming properties.',
    ingredients: ['Organic Olive Oil', 'Coconut Oil', 'Raw Shea Butter', 'Pure Lavender Essential Oil', 'Dried Lavender Buds'],
    benefits: ['Relieves Stress', 'Soothes Skin Irritation', 'Promotes Deep Sleep'],
    ritual: 'Lather between hands with warm water. Close your eyes, inhale the calming aroma, and massage onto skin. Rinse and follow with a moment of silence.'
  },
  { 
    id: 2, 
    name: 'Midnight Charcoal', 
    price: 400, 
    image: '/charcoal.png', 
    category: 'Detox', 
    description: 'Deep cleansing activated charcoal with a refreshing peppermint scent.',
    fullDescription: 'Midnight Charcoal is designed for deep detoxification. Activated charcoal acts like a magnet for impurities, pulling toxins from deep within the pores while peppermint oil leaves a tingling, fresh sensation.',
    ingredients: ['Activated Bamboo Charcoal', 'Peppermint Essential Oil', 'Castor Oil', 'Cocoa Butter', 'Vitamin E'],
    benefits: ['Deep Pore Cleansing', 'Balances Oily Skin', 'Refreshing Cool Feel'],
    ritual: 'Focus on the T-zone and areas prone to congestion. Massage the black lather in circular motions. Rinse with cool water to close pores.'
  },
  { 
    id: 3, 
    name: 'Honey & Oat Scrub', 
    price: 380, 
    image: '/honey-oats.png', 
    category: 'Exfoliating', 
    description: 'Gentle exfoliation with natural oats and moisturizing wild honey.',
    fullDescription: 'A comforting blend that gently buffs away dead skin cells. Raw wild honey provides a natural humectant layer, locking in moisture while the oats soothe even the most sensitive skin.',
    ingredients: ['Wild Forest Honey', 'Organic Rolled Oats', 'Sweet Almond Oil', 'Goat Milk', 'Vanilla Extract'],
    benefits: ['Gentle Exfoliation', 'Moisture Retention', 'Soothes Dryness'],
    ritual: 'Massage directly onto the body in the shower. The oats provide a gentle scrub. Use daily for velvety smooth skin.'
  },
  { 
    id: 4, 
    name: 'Citrus Burst', 
    price: 320, 
    image: '/citrus.png', 
    category: 'Citrus', 
    description: 'Zesty orange and lemon essential oils for an energizing morning wash.',
    ingredients: ['Orange Peel Oil', 'Lemon Zest', 'Jojoba Oil', 'Annatto Seed Powder'],
    benefits: ['Energizing', 'Brightens Skin', 'Vitamin C Rich'],
    ritual: 'The perfect morning companion. Let the zesty aroma wake up your senses.'
  },
  { 
    id: 5, 
    name: 'Eucalyptus Mint', 
    price: 360, 
    image: '/eucalyptus.png', 
    category: 'Refreshing', 
    description: 'Cooling eucalyptus and fresh mint to clear your senses.',
    ingredients: ['Eucalyptus Globulus Leaf Oil', 'Fresh Mint Leaves', 'Avocado Oil', 'Spirulina'],
    benefits: ['Clears Breath', 'Muscle Relief', 'Antibacterial'],
    ritual: 'Use during a hot shower. The eucalyptus steam will help clear your respiratory paths.'
  },
  { 
    id: 6, 
    name: 'Rose Petal Glow', 
    price: 450, 
    image: '/rose.png', 
    category: 'Floral', 
    description: 'Luxurious rosehip oil and real rose petals for a radiant complexion.',
    ingredients: ['Rosehip Seed Oil', 'Dried Damask Rose Petals', 'Geranium Oil', 'French Pink Clay'],
    benefits: ['Anti-aging', 'Skin Toning', 'Hydrating'],
    ritual: 'Gently massage onto the face and neck. The pink clay draws out toxins while the rose oil hydrates.'
  },
  { 
    id: 7, 
    name: 'Sandalwood Serenity', 
    price: 480, 
    image: '/sandalwood.png', 
    category: 'Woody', 
    description: 'Ancient sandalwood extract for a meditative and calming experience.',
    ingredients: ['Mysore Sandalwood Oil', 'Turmeric Extract', 'Saffron Strands', 'Coconut Milk'],
    benefits: ['Meditative Calm', 'Even Skin Tone', 'Luxury Aroma'],
    ritual: 'Apply with slow, deliberate strokes. Let the sacred scent of sandalwood transport you to a state of peace.'
  },
  { id: 8, name: 'Turmeric & Neem', price: 340, image: '/turmeric.png', category: 'Herbal', description: 'Traditional Ayurvedic blend for healthy, blemish-free skin.' },
  { id: 9, name: 'Coffee Bean Blast', price: 390, image: '/coffee.png', category: 'Exfoliating', description: 'Real ground coffee beans to wake up your skin and senses.' },
  { id: 10, name: 'Aloe Vera Cool', price: 330, image: '/aloe.png', category: 'Soothing', description: 'Pure aloe vera gel to hydrate and soothe sensitive skin.' },
  { id: 11, name: 'Tea Tree Purify', price: 370, image: '/teatree.png', category: 'Detox', description: 'Powerful tea tree oil to naturally purify and balance your skin.' },
  { id: 12, name: 'Vanilla Bean Cream', price: 420, image: '/vanilla.png', category: 'Sweet', description: 'Warm vanilla pod extract and shea butter for ultimate softness.' },
  { id: 13, name: 'Sea Salt & Kelp', price: 410, image: '/seasalt.png', category: 'Refreshing', description: 'Mineral-rich sea salt for a spa-like oceanic cleanse.' },
  { id: 14, name: 'Jasmine Bloom', price: 460, image: '/jasmine.png', category: 'Floral', description: 'Intoxicating night-blooming jasmine for a romantic bath.' },
  { id: 15, name: 'Cedarwood Spice', price: 390, image: '/cedar.png', category: 'Woody', description: 'Deep forest cedarwood with a hint of warm clove spice.' },
  { id: 16, name: 'Patchouli Earth', price: 430, image: '/patchouli.png', category: 'Woody', description: 'Grounded patchouli essential oil for a deep, earthy aroma.' },
  { id: 17, name: 'Green Tea Zen', price: 350, image: '/greentea.png', category: 'Refreshing', description: 'Antioxidant-rich green tea leaves for a rejuvenating wash.' },
  { id: 18, name: 'Coconut Milk Silk', price: 380, image: '/coconut.png', category: 'Soothing', description: 'Creamy coconut milk for a silky smooth and hydrated feel.' },
  { id: 19, name: 'Lemongrass Zest', price: 320, image: '/lemongrass.png', category: 'Citrus', description: 'Sharp lemongrass oil to uplift your mood and refresh your body.' },
  { id: 20, name: 'Hibiscus Pink', price: 440, image: '/hibiscus.png', category: 'Floral', description: 'Vitamin C rich hibiscus petals for a bright and youthful glow.' }
];
