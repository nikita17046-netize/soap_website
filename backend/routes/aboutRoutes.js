const express = require('express');
const router = express.Router();
const AboutDetail = require('../models/AboutDetail');

// Fallback initial data
const defaultDetails = [
  // Milestones
  { type: 'milestone', title: 'Bars Hand-Cured', value: '15K+', description: 'Each bar is patiently cured for 42 days to ensure a rich, dense, and nourishing lather.' },
  { type: 'milestone', title: 'Organic Botanical Farms', value: '25+', description: 'Directly sourcing pure botanicals, herbs, and oils from local organic family growers.' },
  { type: 'milestone', title: 'Ritual Satisfaction', value: '99%', description: 'Loved by discerning clients seeking an absolute, chemical-free aromatherapy escape.' },
  { type: 'milestone', title: 'Eco-Biodegradable', value: '100%', description: 'Ensuring our products leave zero toxic traces on your skin or the planet.' },
  // Stages
  { type: 'stage', title: 'Botanical Selection', value: '01', description: 'We source fresh medicinal herbs, flowers, and roots at their peak seasonal potency. Herbs like Neem and Kesuda are wild-harvested during early morning hours to preserve active enzymes and antioxidants.' },
  { type: 'stage', title: 'Organic Oil Blending', value: '02', description: 'We formulate our base using premium food-grade organic oils, including virgin cold-pressed coconut oil, sweet almond oil, extra virgin olive oil, and organic shea butter. No palm oil is ever used.' },
  { type: 'stage', title: 'Slow Cold-Saponification', value: '03', description: 'Ingredients are blended at low temperatures (below 110°F) to protect heat-sensitive vitamins and nutrients. This chemical reaction naturally produces and retains 100% of the natural moisturizing glycerin.' },
  { type: 'stage', title: 'Hand-Pouring & Cutting', value: '04', description: 'The thick soap batter is poured into solid cedar wood molds and insulated for 48 hours. Once solid, the block is hand-sliced into individual bars and stamped with our signature copper emblem.' },
  { type: 'stage', title: 'The 42-Day Sanctuary Cure', value: '05', description: 'The sliced bars rest on custom cedar drying racks in a temperature-controlled curing chamber for 6 weeks. This cures the water content, making the bars incredibly hard, long-lasting, and remarkably mild on sensitive skin.' },
  // Botanicals
  { type: 'botanical', title: 'Kesuda (Flame of the Forest)', subtitle: 'Sourced from: foothills of gir forests', description: 'Used for centuries in Vedic rituals, Kesuda flowers are hand-collected at spring bloom. They provide active natural yellow-orange pigments and act as a powerful cooling agent, repairing skin irritation, blemishes, and maintaining a hydrated, radiant complexion.' },
  { type: 'botanical', title: 'Artisanal Organic Neem', subtitle: 'Sourced from: certified organic farms', description: 'Highly anti-bacterial and loaded with skin-healing nimbin compounds. We steam-extract pure neem oil and blend crushed neem leaves directly into the soap batter to create a gentle, therapeutic exfoliant that purifies acne-prone skin and relieves dry eczema naturally.' },
  { type: 'botanical', title: 'Pampore Saffron (Kesar)', subtitle: 'Sourced from: kashmiri saffron cooperatives', description: 'Known as "red gold", Pampore Saffron is harvested thread-by-thread under strict quality checks. Infused into our premium facial soap bars, it provides intense antioxidant shield, lightens dark spots, and imparts an incomparable golden glow.' },
  { type: 'botanical', title: 'Wild Lemongrass', subtitle: 'Sourced from: western ghats steam distillery', description: 'Steam-distilled within hours of morning harvesting, wild lemongrass essential oil acts as a powerful natural astringent. It tones skin pores, balances excess sebum, and offers an uplifting aromatherapy scent that triggers deep sensory relaxation.' },
  // Quests
  { type: 'quest', title: 'Pure Water Conservation', subtitle: 'ACTIVE QUEST', description: 'Because our soaps are entirely biodegradable and free of chemical surfactants, our production and drainage leave river beds and underground aquifers completely pure and clean.' },
  { type: 'quest', title: 'Zero-Plastic Seed Packaging', subtitle: 'ACTIVE QUEST', description: 'We pledge to remain 100% plastic-free. All products are wrapped in hand-stamped seeded plantable paper or stored in heavy, reusable glass bottles.' },
  { type: 'quest', title: 'Artisan Empowerment', subtitle: 'ACTIVE QUEST', description: 'We employ and train local rural women, providing fair living wages and empowering them with the highly respected artisan trade of botanical preservation and oil pressing.' }
];

// @route   GET /api/about
// @desc    Fetch all about details (self-seeds defaults if collection is empty)
router.get('/', async (req, res) => {
  try {
    let details = await AboutDetail.find({});
    if (details.length === 0) {
      console.log('No About Details found. Self-seeding defaults...');
      await AboutDetail.insertMany(defaultDetails);
      details = await AboutDetail.find({});
    }
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/about
// @desc    Add a new about detail
router.post('/', async (req, res) => {
  try {
    const { type, title, subtitle, value, description, icon } = req.body;
    if (!type || !title || !description) {
      return res.status(400).json({ message: 'Type, Title, and Description are required' });
    }
    const newDetail = new AboutDetail({ type, title, subtitle, value, description, icon });
    const saved = await newDetail.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/about/:id
// @desc    Edit/Update an about detail
router.put('/:id', async (req, res) => {
  try {
    const { title, subtitle, value, description, icon, type } = req.body;
    const detail = await AboutDetail.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ message: 'About detail not found' });
    }

    if (title !== undefined) detail.title = title;
    if (subtitle !== undefined) detail.subtitle = subtitle;
    if (value !== undefined) detail.value = value;
    if (description !== undefined) detail.description = description;
    if (icon !== undefined) detail.icon = icon;
    if (type !== undefined) detail.type = type;

    const updated = await detail.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/about/:id
// @desc    Delete an about detail
router.delete('/:id', async (req, res) => {
  try {
    const detail = await AboutDetail.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ message: 'About detail not found' });
    }
    await AboutDetail.findByIdAndDelete(req.params.id);
    res.json({ message: 'Detail deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
