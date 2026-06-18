import { Product } from '../types';

export const NULAC_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'A2 Farm-Fresh Cow Milk',
    category: 'milk',
    price: 85,
    originalPrice: 95,
    unit: '1 Litre',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewsCount: 384,
    description: 'Nulac A2 Cow Milk is sourced from pure-bred indigenous Gir and Sahiwal cows. Delivered in premium eco-friendly glass bottles within 12 hours of milking, keeping the active enzymes and nutrients perfectly preserved. Sourced directly from our organic-certified pastures.',
    origin: 'Pristine Green Farm, Pune',
    nutrition: {
      energy: '62 kcal',
      fat: '3.6 g',
      protein: '3.2 g',
      carbohydrates: '4.7 g',
      calcium: '120 mg'
    },
    benefits: [
      'Delivered in eco-friendly sterile glass bottles',
      'No added preservatives, hormones, or antibiotics',
      '100% pasture-fed cows with multi-layer quality testing',
      'Rich in easy-to-digest A2 Beta-Casein protein'
    ]
  },
  {
    id: '2',
    name: 'Rich Creamy Buffalo Milk',
    category: 'milk',
    price: 110,
    unit: '1 Litre',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewsCount: 219,
    description: 'Fresh and highly nutritious, Nulac Buffalo Milk has an exceptionally rich fat structure that makes it perfect for thick homemade curds, paneer, and sweets. Our livestock feeds exclusively on organic green grass and herbal grain mixes.',
    origin: 'Nulac Dairy Farm, Coorg',
    nutrition: {
      energy: '97 kcal',
      fat: '6.5 g',
      protein: '3.8 g',
      carbohydrates: '5.1 g',
      calcium: '180 mg'
    },
    benefits: [
      'Unpasteurized raw or pasteurized choices available',
      'Naturally thick, creamy fat consistency (6.5%+ Fat)',
      'Rich in calcium, phosphorus, and essential minerals',
      'Packed in glass bottles to shield aroma and flavor'
    ]
  },
  {
    id: '3',
    name: 'A2 Gir Cow Bilona Ghee',
    category: 'ghee',
    price: 1250,
    originalPrice: 1400,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1589733917121-204434744615?auto=format&fit=crop&q=80&w=400',
    rating: 5.0,
    reviewsCount: 541,
    description: 'This is premium medicine for your gut. Prepared using the traditional Vedic Bilona method, we boil A2 whole milk, curdle it overnight, churn premium butter in earthen pots, and slowly simmer it over direct firewood. The golden liquid contains unmatched digestibility, granular texture, and a heavenly aroma.',
    origin: 'Vedic Churning Unit, Rajasthan',
    nutrition: {
      energy: '898 kcal',
      fat: '99.7 g',
      protein: '0 g',
      carbohydrates: '0 g',
      calcium: '0 mg'
    },
    benefits: [
      'Made purely of A2 Gir cow curd-butter',
      'Hand-churned in strict earthen vessels with firewood',
      'No palm oil, additives, color, or flavoring agents',
      'Boosts brain health, digestion, and skeletal strength'
    ]
  },
  {
    id: '4',
    name: 'Pure Traditional Buffalo Ghee',
    category: 'ghee',
    price: 850,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1628115507099-a9a0df0cd10a?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewsCount: 145,
    description: 'Nulac Buffalo Ghee has a traditional, appetizing, snowy-white granular appearance, distinct nuttiness, and is rich in healthy fats. Prepared from fresh buffalo curd butter, it is perfect for upgrading your rotis, parathas, and high-temperature baking.',
    origin: 'Nulac Dairy Farm, Coorg',
    nutrition: {
      energy: '897 kcal',
      fat: '99.6 g',
      protein: '0 g',
      carbohydrates: '0 g',
      calcium: '0 mg'
    },
    benefits: [
      'Rich in natural fat-soluble vitamins A, D, E, and K',
      'Aromatic and highly grain-textured',
      'Lactose and casein-free (rendered slowly)',
      'Extremely high smoke point (485°F) perfect for roasting'
    ]
  },
  {
    id: '5',
    name: 'Handcrafted Soft Paneer',
    category: 'paneer',
    price: 160,
    originalPrice: 180,
    unit: '200 g',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewsCount: 312,
    description: 'Nulac Handcrafted Paneer is separated using natural citrus extracts instead of chemical coagulants, resulting in an incredibly spongy, melt-in-the-mouth consistency. We wrap and compress our premium curd cheese carefully, keeping moisture perfectly balanced. Sealed in pristine vacuum-barrier packs.',
    origin: 'Fresh Co-Op Unit 2, Ooty',
    nutrition: {
      energy: '265 kcal',
      fat: '20.8 g',
      protein: '18.3 g',
      carbohydrates: '1.2 g',
      calcium: '208 mg'
    },
    benefits: [
      'Coagulated solely using natural organic lemon extracts',
      'Super-soft crumbly structure, high protein density',
      'No starch, synthetic starches, or milk solids added',
      'Delivered absolutely fresh, never frozen or stored'
    ]
  },
  {
    id: '6',
    name: 'Farm-Fresh Milky Probiotic Dahi',
    category: 'dahi',
    price: 70,
    unit: '400 g',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewsCount: 167,
    description: 'Set naturally with native active bacteria cultures, our Creamy Dahi has a thick consistency without using starch or artificial gelatin. Refreshingly smooth and mildly sweet, it aids in daily digestion and balances your gastrointestinal health.',
    origin: 'Pristine Green Farm, Pune',
    nutrition: {
      energy: '60 kcal',
      fat: '4.1 g',
      protein: '3.4 g',
      carbohydrates: '4.2 g',
      calcium: '150 mg'
    },
    benefits: [
      'Thick cup-set structure without thickeners or starch',
      'Packed with active, live gut-healthy probiotic cultures',
      'Low acidity level, naturally sweet and smooth',
      'Maintains perfect temperature control during delivery'
    ]
  }
];
