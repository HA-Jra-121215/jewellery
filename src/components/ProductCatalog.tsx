import { Box, Eye, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { formatUSD } from '../data/catalog';
import { JewelleryCategory, Product } from '../types/jewellery';

const CATEGORIES: JewelleryCategory[] = [
  'All',
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Bridal',
];

interface ProductCatalogProps {
  products: Product[];
  activeCategory: JewelleryCategory;
  onSelectCategory: (cat: JewelleryCategory) => void;
  searchQuery: string;
  onClearSearch: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export function ProductCatalog({
  products,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onOpenDetail,
  onQuickAddToCart,
}: ProductCatalogProps) {
  const filtered = products.filter((p) => {
    const matchesCat =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Bridal'
          ? Boolean(p.isBridal || p.collection === 'bridal')
          : p.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.collectionLabel.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <section
      id="featured-products"
      className="bg-[#FAF7F2] py-24 text-[#1C050C] lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Editorial Heading & Category Filters */}
        <div className="mb-12 flex flex-col justify-between gap-8 border-b border-[#1C050C]/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs tracking-[0.26em] text-[#9E7B3B] uppercase">
              Maison Creations
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.6vw,3.15rem)] leading-tight font-normal text-[#1C050C]">
              Featured Jewellery
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter jewellery by category">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectCategory(cat)}
                  className={`whitespace-nowrap shrink-0 px-4 py-2 text-xs tracking-[0.16em] uppercase transition-colors ${
                    active
                      ? 'bg-[#2A0813] font-medium text-[#FAF7F2]'
                      : 'text-[#1C050C]/70 hover:bg-[#1C050C]/5 hover:text-[#1C050C]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="mb-8 flex items-center justify-between border border-[#1C050C]/12 bg-[#F4ECE2] px-5 py-3 text-sm">
            <span>
              Showing creations matching <strong className="font-medium">“{searchQuery}”</strong>
            </span>
            <button
              type="button"
              onClick={onClearSearch}
              className="text-xs tracking-[0.15em] text-[#9E7B3B] uppercase hover:text-[#1C050C]"
            >
              Clear Search
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="border border-[#1C050C]/12 bg-[#F4ECE2]/60 px-8 py-16 text-center">
            <p className="font-serif text-2xl text-[#1C050C]">
              No creations match this selection.
            </p>
            <p className="mt-2 text-sm text-[#1C050C]/65">
              Explore the complete maison archive or adjust your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('All');
                onClearSearch();
              }}
              className="mt-6 bg-[#2A0813] px-6 py-3 text-xs tracking-[0.18em] text-[#FAF7F2] uppercase hover:bg-[#3D0D1D]"
            >
              View All Pieces
            </button>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => {
              const isWished = wishlistIds.includes(product.id);
              return (
                <motion.article
                  key={product.id}
                  layout
                  transition={{ duration: 0.28 }}
                  className="group flex flex-col border border-[#1C050C]/10 bg-white transition-shadow duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(28,5,12,0.22)]"
                >
                  {/* 4:3 Studio Image Frame with Hover Second-Angle Macro Zoom */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4ECE2]">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(product)}
                      className="block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A25A]"
                      aria-label={`Inspect ${product.name} in 3D`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        style={{ transformOrigin: product.secondaryCropOrigin }}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12]"
                      />
                    </button>

                    {/* Top-Right Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={isWished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                      className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center bg-[#FAF7F2]/92 text-[#1C050C] transition-colors hover:bg-[#2A0813] hover:text-[#FAF7F2]"
                    >
                      <Heart
                        className={`h-4 w-4 ${isWished ? 'fill-[#9E2A45] text-[#9E2A45]' : ''}`}
                        strokeWidth={1.6}
                      />
                    </button>

                    {/* Hover Quick Action Bar (Quick View + 3D Inspect) */}
                    <div className="pointer-events-none absolute inset-x-3.5 bottom-3.5 flex items-center justify-between gap-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => onQuickView(product)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 bg-[#FAF7F2]/95 py-2 text-[11px] font-medium tracking-[0.14em] text-[#1C050C] uppercase transition-colors hover:bg-[#2A0813] hover:text-[#FAF7F2]"
                      >
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
                        <span>Quick View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDetail(product)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 bg-[#2A0813]/95 py-2 text-[11px] font-medium tracking-[0.14em] text-[#E3CB98] uppercase transition-colors hover:bg-[#C8A25A] hover:text-[#150409]"
                      >
                        <Box className="h-3.5 w-3.5" strokeWidth={1.5} />
                        <span>3D View</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Body — Clean Unboxed Metadata */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-[#9E7B3B] uppercase">
                        <span>{product.collectionLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.category}</span>
                      </div>

                      <h3 className="mt-2 font-serif text-[22px] leading-snug font-normal text-[#1C050C]">
                        <button
                          type="button"
                          onClick={() => onOpenDetail(product)}
                          className="text-left transition-colors hover:text-[#7B283D]"
                        >
                          {product.name}
                        </button>
                      </h3>

                      <p className="mt-1.5 text-[13px] text-[#1C050C]/65">{product.summary}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#1C050C]/10 pt-4">
                      <span className="tabular-nums text-[15px] font-medium text-[#1C050C]">
                        {formatUSD(product.priceUSD)}
                      </span>

                      <button
                        type="button"
                        onClick={() => onQuickAddToCart(product)}
                        className="inline-flex items-center gap-2 whitespace-nowrap border border-[#1C050C]/20 px-4 py-2 text-[11px] font-medium tracking-[0.16em] text-[#1C050C] uppercase transition-colors hover:border-[#2A0813] hover:bg-[#2A0813] hover:text-[#FAF7F2]"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
