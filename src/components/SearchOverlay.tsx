import { useEffect, useRef } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCTS, formatUSD } from '../data/catalog';
import { Product } from '../types/jewellery';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  onSelectProduct: (product: Product) => void;
  onApplySearchToCatalog: (q: string) => void;
}

export function SearchOverlay({
  open,
  onClose,
  query,
  onQueryChange,
  onSelectProduct,
  onApplySearchToCatalog,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  const q = query.trim().toLowerCase();
  const matches = q
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.collectionLabel.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q),
      )
    : PRODUCTS.slice(0, 4);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#0D0508]/88 px-4 pt-20 pb-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl border border-[#C8A25A]/30 bg-[#FAF7F2] p-6 text-[#1C050C] shadow-2xl sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-[#1C050C]/15 pb-4">
              <Search className="h-5 w-5 text-[#9E7B3B]" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search solitaire rings, South Sea pearls, 18k gold..."
                aria-label="Search AURELLE creations"
                className="w-full bg-transparent font-serif text-2xl text-[#1C050C] placeholder-[#1C050C]/35 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="flex h-10 w-10 items-center justify-center text-[#1C050C]/70 hover:text-[#1C050C]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs tracking-[0.18em] text-[#9E7B3B] uppercase">
                  {q ? `Results (${matches.length})` : 'Signature Creations'}
                </p>
                {q && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplySearchToCatalog(query);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-[#2A0813] uppercase hover:text-[#9E7B3B]"
                  >
                    <span>Filter in Catalog</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {matches.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#1C050C]/65">
                  No creations found matching “{query}”. Try searching “Diamond”, “Pearl”, or
                  “Gold”.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {matches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectProduct(item);
                        onClose();
                      }}
                      className="flex items-center gap-4 border border-[#1C050C]/10 bg-white p-3 text-left transition-colors hover:border-[#C8A25A]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="h-16 w-20 shrink-0 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] tracking-[0.16em] text-[#9E7B3B] uppercase">
                          {item.collectionLabel}
                        </p>
                        <p className="truncate font-serif text-lg text-[#1C050C]">
                          {item.name}
                        </p>
                        <p className="tabular-nums text-xs font-medium text-[#1C050C]/75">
                          {formatUSD(item.priceUSD)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
