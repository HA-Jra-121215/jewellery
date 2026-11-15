import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { METAL_FINISHES, PRODUCTS, formatUSD } from '../data/catalog';
import { CartItem } from '../types/jewellery';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const enriched = items
    .map((item) => ({
      ...item,
      product: PRODUCTS.find((p) => p.id === item.productId),
    }))
    .filter((entry) => Boolean(entry.product));

  const subtotal = enriched.reduce(
    (sum, entry) => sum + (entry.product?.priceUSD ?? 0) * entry.quantity,
    0,
  );

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
            aria-label="Shopping Bag"
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#C8A25A]/25 bg-[#FAF7F2] text-[#1C050C] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#1C050C]/10 px-6 py-5">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-[#9E7B3B] uppercase">
                  Your Selection
                </p>
                <h2 className="font-serif text-2xl text-[#1C050C]">Shopping Bag</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close shopping bag"
                className="flex h-10 w-10 items-center justify-center text-[#1C050C]/70 hover:text-[#1C050C]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {enriched.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-10 w-10 text-[#C8A25A]" strokeWidth={1.2} />
                  <p className="mt-4 font-serif text-2xl text-[#1C050C]">
                    Your bag is currently empty.
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-[#1C050C]/65">
                    Explore our 3D diamond solitaires, heirloom gold necklaces, and South Sea pearls.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[#1C050C]/10">
                  {enriched.map(({ key, product, metal, ringSize, quantity }) => {
                    if (!product) return null;
                    return (
                      <li key={key} className="flex gap-4 py-5 first:pt-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="h-24 w-24 shrink-0 border border-[#1C050C]/10 object-cover"
                        />
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-serif text-lg leading-snug text-[#1C050C]">
                                {product.name}
                              </h3>
                              <p className="mt-0.5 text-xs text-[#1C050C]/65">
                                {METAL_FINISHES[metal].label}
                                {ringSize ? ` · ${ringSize}` : ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(key)}
                              aria-label={`Remove ${product.name}`}
                              className="text-[#1C050C]/45 hover:text-[#9E2A45]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-[#1C050C]/20">
                              <button
                                type="button"
                                onClick={() => onUpdateQty(key, -1)}
                                aria-label="Decrease quantity"
                                className="flex h-7 w-7 items-center justify-center hover:bg-[#F4ECE2]"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="tabular-nums w-7 text-center text-xs font-medium">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQty(key, 1)}
                                aria-label="Increase quantity"
                                className="flex h-7 w-7 items-center justify-center hover:bg-[#F4ECE2]"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="tabular-nums text-sm font-medium text-[#1C050C]">
                              {formatUSD(product.priceUSD * quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {enriched.length > 0 && (
              <div className="border-t border-[#1C050C]/12 bg-[#F4ECE2] px-6 py-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#1C050C]/70">Insured Delivery</span>
                  <span className="font-medium text-[#9E7B3B]">Complimentary</span>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                  <span className="text-xs tracking-[0.18em] uppercase">Estimated Subtotal</span>
                  <span className="tabular-nums font-serif text-2xl font-medium text-[#1C050C]">
                    {formatUSD(subtotal)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="mt-5 w-full bg-[#2A0813] py-4 text-xs font-semibold tracking-[0.2em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#3D0D1D]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
