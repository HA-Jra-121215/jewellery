export type MetalFinishId = 'yellow-gold' | 'white-gold' | 'rose-gold';

export interface MetalFinish {
  id: MetalFinishId;
  label: string;
  shortLabel: string;
  swatchHex: string;
  pbrHex: string;
  roughness: number;
  metalness: number;
}

export type JewelleryCategory =
  | 'All'
  | 'Rings'
  | 'Necklaces'
  | 'Earrings'
  | 'Bracelets'
  | 'Bridal';

export type CollectionSlug =
  | 'diamond'
  | 'heritage'
  | 'pearl'
  | 'bridal';

export type Model3DType =
  | 'solitaire-ring'
  | 'aurora-ring'
  | 'eternal-necklace'
  | 'heritage-pendant'
  | 'pearl-earrings'
  | 'celestial-bracelet';

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: CollectionSlug;
  collectionLabel: string;
  category: Exclude<JewelleryCategory, 'All'>;
  isBridal?: boolean;
  priceUSD: number;
  image: string;
  secondaryCropOrigin: string;
  modelType: Model3DType;
  summary: string;
  description: string;
  specifications: {
    caratOrPearl: string;
    purity: string;
    origin: string;
    craftHours: string;
  };
  hasRingSize: boolean;
  defaultMetal: MetalFinishId;
  tag?: string;
}

export interface CollectionItem {
  id: CollectionSlug;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  filterCategory: JewelleryCategory;
}

export interface CartItem {
  key: string;
  productId: string;
  metal: MetalFinishId;
  ringSize?: string;
  quantity: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location: string;
  pieceAcquired: string;
  rating: number;
  quote: string;
  demoLabel: string;
}

export type CameraAngleId = 'hero' | 'profile' | 'macro' | 'top';

export interface CameraAnglePreset {
  id: CameraAngleId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}
