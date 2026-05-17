'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './About.module.css';

interface AboutItem {
  _id: string;
  type: 'milestone' | 'quest' | 'botanical' | 'stage';
  title: string;
  subtitle?: string;
  value?: string;
  description: string;
  icon?: string;
}

// Fallback initial data (to prevent empty renders)
const defaultMilestones: AboutItem[] = [
  { _id: 'm1', type: 'milestone', title: 'Bars Hand-Cured', value: '15K+', description: 'Each bar is patiently cured for 42 days to ensure a rich, dense, and nourishing lather.' },
  { _id: 'm2', type: 'milestone', title: 'Organic Botanical Farms', value: '25+', description: 'Directly sourcing pure botanicals, herbs, and oils from local organic family growers.' },
  { _id: 'm3', type: 'milestone', title: 'Ritual Satisfaction', value: '99%', description: 'Loved by discerning clients seeking an absolute, chemical-free aromatherapy escape.' },
  { _id: 'm4', type: 'milestone', title: 'Eco-Biodegradable', value: '100%', description: 'Ensuring our products leave zero toxic traces on your skin or the planet.' }
];

const defaultStages: AboutItem[] = [
  { _id: 's1', type: 'stage', title: 'Botanical Selection', value: '01', description: 'We source fresh medicinal herbs, flowers, and roots at their peak seasonal potency. Herbs like Neem and Kesuda are wild-harvested during early morning hours to preserve active enzymes and antioxidants.' },
  { _id: 's2', type: 'stage', title: 'Organic Oil Blending', value: '02', description: 'We formulate our base using premium food-grade organic oils, including virgin cold-pressed coconut oil, sweet almond oil, extra virgin olive oil, and organic shea butter. No palm oil is ever used.' },
  { _id: 's3', type: 'stage', title: 'Slow Cold-Saponification', value: '03', description: 'Ingredients are blended at low temperatures (below 110°F) to protect heat-sensitive vitamins and nutrients. This chemical reaction naturally produces and retains 100% of the natural moisturizing glycerin.' },
  { _id: 's4', type: 'stage', title: 'Hand-Pouring & Cutting', value: '04', description: 'The thick soap batter is poured into solid cedar wood molds and insulated for 48 hours. Once solid, the block is hand-sliced into individual bars and stamped with our signature copper emblem.' },
  { _id: 's5', type: 'stage', title: 'The 42-Day Sanctuary Cure', value: '05', description: 'The sliced bars rest on custom cedar drying racks in a temperature-controlled curing chamber for 6 weeks. This cures the water content, making the bars incredibly hard, long-lasting, and remarkably mild on sensitive skin.' }
];

const defaultBotanicals: AboutItem[] = [
  { _id: 'b1', type: 'botanical', title: 'Kesuda (Flame of the Forest)', subtitle: 'Sourced from: foothills of gir forests', description: 'Used for centuries in Vedic rituals, Kesuda flowers are hand-collected at spring bloom. They provide active natural yellow-orange pigments and act as a powerful cooling agent, repairing skin irritation, blemishes, and maintaining a hydrated, radiant complexion.' },
  { _id: 'b2', type: 'botanical', title: 'Artisanal Organic Neem', subtitle: 'Sourced from: certified organic farms', description: 'Highly anti-bacterial and loaded with skin-healing nimbin compounds. We steam-extract pure neem oil and blend crushed neem leaves directly into the soap batter to create a gentle, therapeutic exfoliant that purifies acne-prone skin and relieves dry eczema naturally.' },
  { _id: 'b3', type: 'botanical', title: 'Pampore Saffron (Kesar)', subtitle: 'Sourced from: kashmiri saffron cooperatives', description: 'Known as "red gold", Pampore Saffron is harvested thread-by-thread under strict quality checks. Infused into our premium facial soap bars, it provides intense antioxidant shield, lightens dark spots, and imparts an incomparable golden glow.' },
  { _id: 'b4', type: 'botanical', title: 'Wild Lemongrass', subtitle: 'Sourced from: western ghats steam distillery', description: 'Steam-distilled within hours of morning harvesting, wild lemongrass essential oil acts as a powerful natural astringent. It tones skin pores, balances excess sebum, and offers an uplifting aromatherapy scent that triggers deep sensory relaxation.' }
];

const defaultQuests: AboutItem[] = [
  { _id: 'q1', type: 'quest', title: 'Pure Water Conservation', subtitle: 'ACTIVE QUEST', description: 'Because our soaps are entirely biodegradable and free of chemical surfactants, our production and drainage leave river beds and underground aquifers completely pure and clean.' },
  { _id: 'q2', type: 'quest', title: 'Zero-Plastic Seed Packaging', subtitle: 'ACTIVE QUEST', description: 'We pledge to remain 100% plastic-free. All products are wrapped in hand-stamped seeded plantable paper or stored in heavy, reusable glass bottles.' },
  { _id: 'q3', type: 'quest', title: 'Artisan Empowerment', subtitle: 'ACTIVE QUEST', description: 'We employ and train local rural women, providing fair living wages and empowering them with the highly respected artisan trade of botanical preservation and oil pressing.' }
];

const AboutPage = () => {
  const [details, setDetails] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutDetails = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/about');
        if (res.ok) {
          const data = await res.json();
          setDetails(data);
        }
      } catch (err) {
        console.error('Error fetching dynamic about details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutDetails();
  }, []);

  const milestones = details.filter(d => d.type === 'milestone').length > 0
    ? details.filter(d => d.type === 'milestone')
    : defaultMilestones;

  const stages = details.filter(d => d.type === 'stage').length > 0
    ? details.filter(d => d.type === 'stage')
    : defaultStages;

  const botanicals = details.filter(d => d.type === 'botanical').length > 0
    ? details.filter(d => d.type === 'botanical')
    : defaultBotanicals;

  const quests = details.filter(d => d.type === 'quest').length > 0
    ? details.filter(d => d.type === 'quest')
    : defaultQuests;

  return (
    <main className={styles.aboutPage}>
      {/* Editorial Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.label}>EST. 2024</span>
          <h1 className={styles.title}>The Art of Ritual</h1>
          <p className={styles.headerDesc}>
            Discover the patient cold-process alchemy, local botanical origins, handcrafted milestones, and ecological quests that define SaptAroma.
          </p>
        </div>
      </header>

      {/* 1. The Full Story Section */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <span className={styles.sectionSubtitle}>Heritage & Alchemy</span>
              <h2 className={styles.sectionTitle}>The SaptAroma Genesis</h2>
              
              <p className={styles.storyParagraph}>
                SaptAroma was born in a small home kitchen, driven by an unyielding passion for natural living and the centuries-old craft of traditional cold-processed soap making. We believed that cleansing should not be a thoughtless routine, but a sacred sensory ritual that connects us back to the Earth.
              </p>
              
              <p className={styles.storyParagraph}>
                Every single bar of SaptAroma is painstakingly mixed, hand-poured, cured for six weeks, and hand-cut in our valley workshop. This slow curing process ensures a dense, highly moisturizing lather that preserves the healing integrity of premium organic plant oils, botanical extracts, and natural essential oils.
              </p>

              <p className={styles.storyParagraph}>
                We refuse to use synthetic lathering agents, chemical preservatives, parabens, or artificial colors. Instead, we allow the rich colors of French clay, therapeutic herbs like Neem and Kesuda, and organic seeds to give each bar its unique texture and visual beauty.
              </p>

              <div className={styles.signatureBlock}>
                <span className={styles.signatureText}>Handmade with Eternal Devotion</span>
                <span className={styles.signatureTitle}>The SaptAroma Artisans</span>
              </div>
            </div>

            <div className={styles.storyVisual}>
              <div className={styles.imageCard}>
                <Image 
                  src="/artisanal-workshop.png" 
                  alt="Our Soap Curing Workshop" 
                  fill 
                  sizes="(max-width: 968px) 100vw, 50vw"
                  className={styles.visualImage}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FIVE STAGES OF SAPONIFICATION */}
      <section className={styles.stagesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionSubtitleCentered}>THE ARTISANAL TIMELINE</span>
            <h2 className={styles.sectionTitleCentered}>The Five Alchemical Stages</h2>
            <p className={styles.sectionDescCentered}>
              Learn how we transform raw botanical ingredients into luxurious, moisturizing lather. Every bar undergoes a rigorous 42-day journey of transformation.
            </p>
          </div>

          <div className={styles.stagesGrid}>
            {stages.map((stage) => (
              <div className={styles.stageCard} key={stage._id}>
                <span className={styles.stageNumber}>{stage.value}</span>
                <h3 className={styles.stageTitle}>{stage.title}</h3>
                <p className={styles.stageDesc}>{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BOTANICAL HERITAGE & SOURCING */}
      <section className={styles.botanicalSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionSubtitleCentered}>SACRED INGREDIENTS</span>
            <h2 className={styles.sectionTitleCentered}>Our Handpicked Apothecary</h2>
            <p className={styles.sectionDescCentered}>
              We believe in complete ingredient transparency. Here is a detailed look at the origin, therapeutic profiles, and traditional harvesting methods of our core botanical ingredients.
            </p>
          </div>

          <div className={styles.botanicalGrid}>
            {botanicals.map((botanical) => (
              <div className={styles.botanicalCard} key={botanical._id}>
                <div className={styles.botanicalInfo}>
                  <span className={styles.botanicalOrigin}>{botanical.subtitle}</span>
                  <h3 className={styles.botanicalTitle}>{botanical.title}</h3>
                  <p className={styles.botanicalDesc}>{botanical.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Achievements / Milestones */}
      <section className={styles.achievements}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionSubtitleCentered}>OUR BENCHMARKS</span>
            <h2 className={styles.sectionTitleCentered}>Honoring Handcrafted Milestones</h2>
          </div>

          <div className={styles.statsGrid}>
            {milestones.map((milestone) => (
              <div className={styles.statCard} key={milestone._id}>
                <span className={styles.statValue}>{milestone.value}</span>
                <span className={styles.statTitle}>{milestone.title}</span>
                <p className={styles.statDesc}>{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Quests / Ecological Missions */}
      <section className={styles.questsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.sectionSubtitleCentered}>ACTIVE ECOSYSTEM QUESTS</span>
            <h2 className={styles.sectionTitleCentered}>Our Sacred Brand Commitments</h2>
            <p className={styles.sectionDescCentered}>
              SaptAroma is built on ecological quests that go far beyond commercial boundaries. Every purchase supports these active global missions.
            </p>
          </div>

          <div className={styles.questsGrid}>
            {quests.map((quest) => (
              <div className={styles.questCard} key={quest._id}>
                <div className={styles.questIconWrapper}>
                  {quest.title.includes('Water') ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                  ) : quest.title.includes('Plastic') || quest.title.includes('Packaging') ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  )}
                </div>
                <span className={styles.questBadge}>{quest.subtitle}</span>
                <h3 className={styles.questTitle}>{quest.title}</h3>
                <p className={styles.questDesc}>{quest.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
