import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCTS, formatUSD } from '../data/catalog';
import { Product } from '../types/jewellery';

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onRemove: (id: string) => void;
  onInspect3D: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function WishlistDrawer({
  open,
  onClose,
  wishlistIds,
  onRemove,
  onInspect3D,
  onAddToCart,
}: WishlistDrawerProps) {
  const savedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0D0508]/75"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Saved Wishlist"
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#C8A25A]/25 bg-[#FAF7F2] text-[#1C050C] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#1C050C]/10 px-6 py-5">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-[#9E7B3B] uppercase">
                  Curated Vault
                </p>
                <h2 className="font-serif text-2xl text-[#1C050C]">Wishlist</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close wishlist"
                className="flex h-10 w-10 items-center justify-center text-[#1C050C]/70 hover:text-[#1C050C]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {savedProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Heart className="h-10 w-10 text-[#C8A25A]" strokeWidth={1.2} />
                  <p className="mt-4 font-serif text-2xl text-[#1C050C]">
                    No saved creations yet.
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-[#1C050C]/65">
                    Tap the heart icon on any piece to save it here for private comparison.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[#1C050C]/10">
                  {savedProducts.map((product) => (
                    <li key={product.id} className="flex gap-4 py-5 first:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onInspect3D(product);
                        }}
                        className="h-24 w-24 shrink-0 overflow-hidden border border-[#1C050C]/10"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </button>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] tracking-[0.16em] text-[#9E7B3B] uppercase">
                              {product.collectionLabel}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onInspect3D(product);
                              }}
                              className="text-left font-serif text-lg text-[#1C050C] hover:text-[#7B283D]"
                            >
                              {product.name}
                            </button>
                            <p className="tabular-nums mt-0.5 text-sm font-medium">
                              {formatUSD(product.priceUSD)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(product.id)}
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="text-[#1C050C]/45 hover:text-[#9E2A45]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onAddToCart(product);
                              onClose();
                            }}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 bg-[#2A0813] py-2 text-[11px] font-medium tracking-[0.15em] text-[#FAF7F2] uppercase hover:bg-[#3D0D1D]"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
