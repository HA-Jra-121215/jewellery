import { useState } from 'react';
import { Box, Heart, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { METAL_FINISHES, RING_SIZES, formatUSD } from '../data/catalog';
import { MetalFinishId, Product } from '../types/jewellery';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isWished: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, metal: MetalFinishId, ringSize?: string) => void;
  onOpenFull3D: (product: Product) => void;
}

export function QuickViewModal({
  product,
  onClose,
  isWished,
  onToggleWishlist,
  onAddToCart,
  onOpenFull3D,
}: QuickViewModalProps) {
  const [metal, setMetal] = useState<MetalFinishId>('yellow-gold');
  const [ringSize, setRingSize] = useState<string>(RING_SIZES[3]);

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0D0508]/80"
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative z-10 grid max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-[#C8A25A]/30 bg-[#FAF7F2] text-[#1C050C] md:grid-cols-12"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-[#FAF7F2]/90 text-[#1C050C] hover:bg-[#2A0813] hover:text-[#FAF7F2]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="bg-[#F4ECE2] md:col-span-6">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="h-full min-h-[280px] w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between p-7 md:col-span-6">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-[#9E7B3B] uppercase">
                  {product.collectionLabel} · {product.category}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-[#1C050C]">{product.name}</h2>
                <p className="tabular-nums mt-2 font-serif text-2xl text-[#2A0813]">
                  {formatUSD(product.priceUSD)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#1C050C]/75">
                  {product.description}
                </p>

                {/* Metal Selector */}
                <div className="mt-5">
                  <p className="text-[11px] tracking-[0.16em] text-[#1C050C]/65 uppercase">
                    Metal Finish
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Object.keys(METAL_FINISHES) as MetalFinishId[]).map((id) => {
                      const fin = METAL_FINISHES[id];
                      const active = metal === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setMetal(id)}
                          className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs ${
                            active
                              ? 'border-[#2A0813] bg-[#2A0813] text-[#FAF7F2]'
                              : 'border-[#1C050C]/15 bg-white text-[#1C050C]'
                          }`}
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: fin.swatchHex }}
                          />
                          <span>{fin.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {product.hasRingSize && (
                  <div className="mt-4">
                    <p className="text-[11px] tracking-[0.16em] text-[#1C050C]/65 uppercase">
                      Ring Size
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {RING_SIZES.slice(1, 7).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setRingSize(sz)}
                          className={`tabular-nums border px-2.5 py-1 text-xs ${
                            ringSize === sz
                              ? 'border-[#2A0813] bg-[#2A0813] text-[#FAF7F2]'
                              : 'border-[#1C050C]/15 bg-white text-[#1C050C]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-7 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, metal, product.hasRingSize ? ringSize : undefined);
                    onClose();
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#2A0813] py-3.5 text-xs font-semibold tracking-[0.18em] text-[#FAF7F2] uppercase hover:bg-[#3D0D1D]"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                  <span>Add to Bag</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFull3D(product);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 border border-[#C8A25A] py-2.5 text-[11px] font-medium tracking-[0.14em] text-[#2A0813] uppercase hover:bg-[#C8A25A]/15"
                  >
                    <Box className="h-3.5 w-3.5" />
                    <span>Inspect in 3D</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    className="inline-flex items-center justify-center gap-1.5 border border-[#1C050C]/20 py-2.5 text-[11px] font-medium tracking-[0.14em] text-[#1C050C] uppercase hover:border-[#2A0813]"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${isWished ? 'fill-[#9E2A45] text-[#9E2A45]' : ''}`}
                    />
                    <span>{isWished ? 'Saved' : 'Wishlist'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
