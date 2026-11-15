import {
  CollectionItem,
  MetalFinish,
  MetalFinishId,
  Product,
  Testimonial,
} from '../types/jewellery';

export const METAL_FINISHES: Record<MetalFinishId, MetalFinish> = {
  'yellow-gold': {
    id: 'yellow-gold',
    label: '18k Yellow Gold',
    shortLabel: 'Yellow Gold',
    swatchHex: '#D8B36A',
    pbrHex: '#E7BD6B',
    roughness: 0.16,
    metalness: 0.96,
  },
  'white-gold': {
    id: 'white-gold',
    label: '18k White Gold',
    shortLabel: 'White Gold',
    swatchHex: '#E5E7EB',
    pbrHex: '#EAECEF',
    roughness: 0.12,
    metalness: 0.98,
  },
  'rose-gold': {
    id: 'rose-gold',
    label: '18k Rose Gold',
    shortLabel: 'Rose Gold',
    swatchHex: '#DFA08B',
    pbrHex: '#E2A38C',
    roughness: 0.17,
    metalness: 0.95,
  },
};

export const RING_SIZES = ['US 4.5', 'US 5', 'US 5.5', 'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8'];

export const COLLECTIONS: CollectionItem[] = [
  {
    id: 'diamond',
    number: '01',
    title: 'Diamond Collection',
    subtitle: 'Architectural Light & Precision Facets',
    description:
      'Hand-selected D-F color stones calibrated to capture and refract every passing ray inside minimal cathedral mountings.',
    image: '/src/assets/images/collection_diamond_1794736805607.jpg',
    filterCategory: 'Rings',
  },
  {
    id: 'heritage',
    number: '02',
    title: 'Golden Heritage',
    subtitle: 'Sculptural 18k Satin-Brushed Gold',
    description:
      'Heirloom chains, medallions, and architectural cuffs shaped using centuries-old Parisian hand-burnishing.',
    image: '/src/assets/images/collection_heritage_1794736807093.jpg',
    filterCategory: 'Necklaces',
  },
  {
    id: 'pearl',
    number: '03',
    title: 'Pearl Elegance',
    subtitle: 'Luminous South Sea & Akoya Drops',
    description:
      'Naturally iridescent pearls suspended from delicate diamond-set gold filigree for understated evening poise.',
    image: '/src/assets/images/collection_pearl_1794736807260.jpg',
    filterCategory: 'Earrings',
  },
  {
    id: 'bridal',
    number: '04',
    title: 'Bridal Collection',
    subtitle: 'Made for Lifelong Devotion',
    description:
      'Bespoke engagement solitaires, cascading collars, and bridal suites crafted to accompany your most sacred vows.',
    image: '/src/assets/images/collection_bridal_1794736808829.jpg',
    filterCategory: 'Bridal',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'solitaire-ring',
    slug: 'diamond-solitaire-ring',
    name: 'Diamond Solitaire Ring',
    collection: 'diamond',
    collectionLabel: 'Diamond Collection',
    category: 'Rings',
    isBridal: true,
    priceUSD: 6850,
    image: '/src/assets/images/product_solitaire_ring_1794736808054.jpg',
    secondaryCropOrigin: '52% 45%',
    modelType: 'solitaire-ring',
    summary: '1.80 ct Round Brilliant · Six-Prong Cathedral Setting',
    description:
      'An iconic six-prong cathedral solitaire sculpted to elevate the center diamond above a knife-edge 18k band, allowing light to enter from every angle.',
    specifications: {
      caratOrPearl: '1.80 ct VVS1 · E Color',
      purity: '18k Solid Gold (Au750)',
      origin: 'Place Vendôme Atelier, Paris',
      craftHours: '42 Hours Hand-Set',
    },
    hasRingSize: true,
    defaultMetal: 'yellow-gold',
    tag: 'Signature Piece',
  },
  {
    id: 'eternal-necklace',
    slug: 'eternal-gold-necklace',
    name: 'Eternal Gold Necklace',
    collection: 'heritage',
    collectionLabel: 'Golden Heritage',
    category: 'Necklaces',
    priceUSD: 4400,
    image: '/src/assets/images/product_eternal_necklace_1794736808812.jpg',
    secondaryCropOrigin: '50% 72%',
    modelType: 'eternal-necklace',
    summary: 'Articulated Satin-Link Collar · Pavé Bar Clasp',
    description:
      'Hand-assembled solid gold curb links finished in a silk-brushed patina, anchored by an architectural central bar pavé-set with nine brilliant-cut diamonds.',
    specifications: {
      caratOrPearl: '0.45 ct Total Pavé Diamonds',
      purity: '18k Satin-Brushed Gold',
      origin: 'Vicenza & Paris Workshops',
      craftHours: '36 Hours Assembly',
    },
    hasRingSize: false,
    defaultMetal: 'yellow-gold',
  },
  {
    id: 'pearl-earrings',
    slug: 'royal-pearl-earrings',
    name: 'Royal Pearl Earrings',
    collection: 'pearl',
    collectionLabel: 'Pearl Elegance',
    category: 'Earrings',
    isBridal: true,
    priceUSD: 3250,
    image: '/src/assets/images/product_pearl_earrings_1794736808638.jpg',
    secondaryCropOrigin: '48% 36%',
    modelType: 'pearl-earrings',
    summary: '12mm Golden South Sea Pearls · Filigree Diamond Studs',
    description:
      'Matched 12mm South Sea pearls prized for their mirror-warm orient, suspended gracefully beneath scrolling 18k gold diamond-set crest studs.',
    specifications: {
      caratOrPearl: '12mm South Sea Pearl · 0.62 ct Diamonds',
      purity: '18k Solid Gold (Au750)',
      origin: 'Broome Harvest · Paris Setting',
      craftHours: '28 Hours Filigree',
    },
    hasRingSize: false,
    defaultMetal: 'yellow-gold',
    tag: 'Atelier Archive',
  },
  {
    id: 'celestial-bracelet',
    slug: 'celestial-diamond-bracelet',
    name: 'Celestial Diamond Bracelet',
    collection: 'diamond',
    collectionLabel: 'Diamond Collection',
    category: 'Bracelets',
    isBridal: true,
    priceUSD: 8900,
    image: '/src/assets/images/product_celestial_bracelet_1794736809643.jpg',
    secondaryCropOrigin: '55% 60%',
    modelType: 'celestial-bracelet',
    summary: '3.40 ct Channel-Set Round Diamonds · Hinged Oval Bangle',
    description:
      'A sleek hinged oval bangle engineered for effortless wrist contour, traced by thirty-two matched brilliant diamonds held in low-profile shared claws.',
    specifications: {
      caratOrPearl: '3.40 ct F-G / VS1 Diamonds',
      purity: '18k Mirror-Polished Gold',
      origin: 'Paris Haute Joaillerie',
      craftHours: '54 Hours Setting',
    },
    hasRingSize: false,
    defaultMetal: 'yellow-gold',
  },
  {
    id: 'heritage-pendant',
    slug: 'heritage-gold-pendant',
    name: 'Heritage Gold Pendant',
    collection: 'heritage',
    collectionLabel: 'Golden Heritage',
    category: 'Necklaces',
    priceUSD: 2950,
    image: '/src/assets/images/product_heritage_pendant_1794736809475.jpg',
    secondaryCropOrigin: '52% 54%',
    modelType: 'heritage-pendant',
    summary: 'Hand-Engraved Acanthus Medallion · Bezel Diamond Core',
    description:
      'Inspired by nineteenth-century seal medallions, each disc is hand-engraved with botanical scrollwork framing a flush bezel-set round diamond.',
    specifications: {
      caratOrPearl: '0.35 ct Bezel-Set Center Diamond',
      purity: '18k Matte & Burnished Gold',
      origin: 'Paris Engraving Studio',
      craftHours: '30 Hours Engraving',
    },
    hasRingSize: false,
    defaultMetal: 'yellow-gold',
  },
  {
    id: 'aurora-ring',
    slug: 'aurora-engagement-ring',
    name: 'Aurora Engagement Ring',
    collection: 'bridal',
    collectionLabel: 'Bridal Collection',
    category: 'Rings',
    isBridal: true,
    priceUSD: 7600,
    image: '/src/assets/images/product_aurora_ring_1794736809905.jpg',
    secondaryCropOrigin: '50% 48%',
    modelType: 'aurora-ring',
    summary: '2.10 ct Oval Brilliant · Pavé Gallery & Shoulders',
    description:
      'An elongated oval diamond poised inside four whisper-thin talon prongs, paired with French-cut pavé diamond shoulders and a hidden gallery halo.',
    specifications: {
      caratOrPearl: '2.10 ct Oval Brilliant · VVS2',
      purity: '18k Solid Gold (Au750)',
      origin: 'Place Vendôme Atelier, Paris',
      craftHours: '48 Hours Master Setting',
    },
    hasRingSize: true,
    defaultMetal: 'rose-gold',
    tag: 'Bridal Signature',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    clientName: 'Camille V.',
    location: 'Geneva',
    pieceAcquired: 'Aurora Engagement Ring · 18k Rose Gold',
    rating: 5,
    quote:
      'Rotating the solitaire in 3D before our private appointment gave me complete certainty over the gallery profile. In person, the rose gold warmth is extraordinary.',
    demoLabel: 'Verified Demo Acquisition',
  },
  {
    id: 't2',
    clientName: 'Eleanor H.',
    location: 'London',
    pieceAcquired: 'Royal Pearl Earrings · 18k Yellow Gold',
    rating: 5,
    quote:
      'From the burgundy velvet presentation box to the luminous weight of the South Sea pearls, every detail carries the quiet authority of true heirloom craft.',
    demoLabel: 'Verified Demo Acquisition',
  },
  {
    id: 't3',
    clientName: 'Sophia & Marc D.',
    location: 'Paris',
    pieceAcquired: 'Diamond Solitaire Ring & Celestial Bracelet',
    rating: 5,
    quote:
      'The clarity of the stones and the seamless finish along the inner band make these pieces effortless to wear daily yet unforgettable under evening light.',
    demoLabel: 'Verified Demo Acquisition',
  },
];

export const formatUSD = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
