import { useState } from 'react';
import { ArrowLeft, Box, Camera, Check, Heart, Minus, Plus, ShieldCheck, ShoppingBag } from 'lucide-react';
import { METAL_FINISHES, RING_SIZES, formatUSD } from '../data/catalog';
import { MetalFinishId, Product } from '../types/jewellery';
import { ProductShowroom3D } from './three/ProductShowroom3D';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onBack: () => void;
  isWished: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, metal: MetalFinishId, ringSize: string | undefined, quantity: number) => void;
}

export function ProductDetailView({
  product,
  allProducts,
  onSelectProduct,
  onBack,
  isWished,
  onToggleWishlist,
  onAddToCart,
}: ProductDetailViewProps) {
  const [selectedMetal, setSelectedMetal] = useState<MetalFinishId>(product.defaultMetal);
  const [ringSize, setRingSize] = useState<string>(RING_SIZES[3]);
  const [quantity, setQuantity] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedMetal, product.hasRingSize ? ringSize : undefined, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20 text-[#1C050C]">
      {/* Breadcrumb & Back Bar */}
      <div className="border-b border-[#1C050C]/10 bg-[#F4ECE2]/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-[#1C050C]/80 uppercase transition-colors hover:text-[#1C050C]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <span>Back to Maison Collection</span>
          </button>

          <div className="hidden items-center gap-2 text-xs tracking-[0.16em] text-[#9E7B3B] uppercase sm:flex">
            <span>{product.collectionLabel}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#1C050C]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Contiguous 2-Column Showroom & Purchase Module */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Sticky Interactive 3D / Studio Viewport */}
          <div className="lg:sticky lg:top-24 lg:col-span-7">
            <div className="relative h-[430px] w-full overflow-hidden border border-[#C8A25A]/25 bg-[#150409] sm:h-[520px] lg:h-[580px]">
              {viewMode === '3d' ? (
                <ProductShowroom3D
                  modelType={product.modelType}
                  metalFinish={selectedMetal}
                  productName={product.name}
                  fallbackImage={product.image}
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              )}

              {/* Top-Right View Mode Switcher */}
              <div className="absolute right-4 top-4 z-20 flex border border-[#C8A25A]/30 bg-[#150409]/95 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    viewMode === '3d'
                      ? 'bg-[#C8A25A] font-medium text-[#150409]'
                      : 'text-[#FAF7F2]/80 hover:text-[#FAF7F2]'
                  }`}
                >
                  <Box className="h-3.5 w-3.5" />
                  <span>3D Model</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    viewMode === 'photo'
                      ? 'bg-[#C8A25A] font-medium text-[#150409]'
                      : 'text-[#FAF7F2]/80 hover:text-[#FAF7F2]'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Studio Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="lg:col-span-5">
            <div className="border border-[#1C050C]/10 bg-white p-7 sm:p-9">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#9E7B3B] uppercase">
                <span>{product.collectionLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
              </div>

              <h1 className="mt-2.5 font-serif text-[clamp(2rem,3vw,2.65rem)] leading-tight font-normal text-[#1C050C]">
                {product.name}
              </h1>

              <p className="tabular-nums mt-3 font-serif text-2xl font-medium text-[#2A0813]">
                {formatUSD(product.priceUSD)}
              </p>

              <p className="mt-5 text-[15px] leading-relaxed text-[#1C050C]/75">
                {product.description}
              </p>

              {/* Metal Finish Selection (Live 3D PBR Material Update) */}
              <div className="mt-7 border-t border-[#1C050C]/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[0.18em] text-[#1C050C]/70 uppercase">
                    Precious Metal
                  </span>
                  <span className="text-xs font-medium text-[#1C050C]">
                    {METAL_FINISHES[selectedMetal].label}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {(Object.keys(METAL_FINISHES) as MetalFinishId[]).map((metalKey) => {
                    const metal = METAL_FINISHES[metalKey];
                    const active = selectedMetal === metalKey;
                    return (
                      <button
                        key={metal.id}
                        type="button"
                        onClick={() => setSelectedMetal(metal.id)}
                        className={`flex items-center justify-center gap-2 border px-3 py-2.5 text-xs transition-colors ${
                          active
                            ? 'border-[#2A0813] bg-[#2A0813] font-medium text-[#FAF7F2]'
                            : 'border-[#1C050C]/15 bg-[#FAF7F2] text-[#1C050C] hover:border-[#C8A25A]'
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/20"
                          style={{ backgroundColor: metal.swatchHex }}
                        />
                        <span className="truncate">{metal.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ring Size Selector where applicable */}
              {product.hasRingSize && (
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-[0.18em] text-[#1C050C]/70 uppercase">
                      Ring Size
                    </span>
                    <span className="text-xs text-[#9E7B3B]">Complimentary Resizing</span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-4 gap-2">
                    {RING_SIZES.map((sz) => {
                      const active = ringSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setRingSize(sz)}
                          className={`tabular-nums border py-2 text-xs transition-colors ${
                            active
                              ? 'border-[#2A0813] bg-[#2A0813] font-medium text-[#FAF7F2]'
                              : 'border-[#1C050C]/15 text-[#1C050C] hover:border-[#C8A25A]'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Purchase Actions */}
              <div className="mt-7 flex flex-col gap-3 border-t border-[#1C050C]/10 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 items-center border border-[#1C050C]/20">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="flex h-full w-10 items-center justify-center text-[#1C050C] hover:bg-[#F4ECE2]"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="tabular-nums w-10 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      aria-label="Increase quantity"
                      className="flex h-full w-10 items-center justify-center text-[#1C050C] hover:bg-[#F4ECE2]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2.5 bg-[#2A0813] px-6 text-xs font-semibold tracking-[0.2em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#3D0D1D]"
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-4 w-4 text-[#E3CB98]" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 border border-[#1C050C]/20 text-xs tracking-[0.18em] text-[#1C050C] uppercase transition-colors hover:border-[#2A0813]"
                >
                  <Heart
                    className={`h-4 w-4 ${isWished ? 'fill-[#9E2A45] text-[#9E2A45]' : ''}`}
                    strokeWidth={1.5}
                  />
                  <span>{isWished ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Craftsmanship Specifications */}
              <div className="mt-7 border-t border-[#1C050C]/10 pt-6">
                <h2 className="text-xs font-semibold tracking-[0.2em] text-[#1C050C] uppercase">
                  Creation Specifications
                </h2>
                <dl className="mt-4 divide-y divide-[#1C050C]/8 text-sm">
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#1C050C]/60">Gemstone / Pearl</dt>
                    <dd className="text-right font-medium text-[#1C050C]">
                      {product.specifications.caratOrPearl}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#1C050C]/60">Hallmark</dt>
                    <dd className="text-right font-medium text-[#1C050C]">
                      {product.specifications.purity}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#1C050C]/60">Atelier</dt>
                    <dd className="text-right font-medium text-[#1C050C]">
                      {product.specifications.origin}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#1C050C]/60">Artisan Craft</dt>
                    <dd className="text-right font-medium text-[#1C050C]">
                      {product.specifications.craftHours}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-start gap-3 bg-[#F4ECE2] p-4 text-xs leading-relaxed text-[#1C050C]/80">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9E7B3B]" strokeWidth={1.6} />
                  <span>
                    Presented in signature burgundy velvet packaging with complimentary insured
                    courier delivery. Interactive demo showroom preview.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complementary 3D Pieces */}
        <div className="mt-20 border-t border-[#1C050C]/10 pt-14">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif text-3xl text-[#1C050C]">
              Continue Exploring in 3D
            </h2>
            <button
              type="button"
              onClick={onBack}
              className="text-xs tracking-[0.18em] text-[#9E7B3B] uppercase hover:text-[#1C050C]"
            >
              View Full Catalog
            </button>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {related.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedMetal(item.defaultMetal);
                  setQuantity(1);
                  onSelectProduct(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group border border-[#1C050C]/10 bg-white text-left transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#F4ECE2]">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] tracking-[0.18em] text-[#9E7B3B] uppercase">
                    {item.collectionLabel}
                  </p>
                  <div className="mt-1 flex items-baseline justify-between gap-4">
                    <span className="font-serif text-xl text-[#1C050C]">{item.name}</span>
                    <span className="tabular-nums text-sm font-medium text-[#1C050C]">
                      {formatUSD(item.priceUSD)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
