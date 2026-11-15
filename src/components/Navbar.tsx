import { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { JewelleryCategory } from '../types/jewellery';

interface NavbarProps {
  onNavigateSection: (sectionId: string) => void;
  onSelectCategory: (category: JewelleryCategory) => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  wishlistCount: number;
  cartCount: number;
  isDetailView: boolean;
  onExitDetailView: () => void;
}

export function Navbar({
  onNavigateSection,
  onSelectCategory,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart,
  wishlistCount,
  cartCount,
  isDetailView,
  onExitDetailView,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (action: () => void) => {
    setMobileOpen(false);
    if (isDetailView) {
      onExitDetailView();
      setTimeout(action, 60);
    } else {
      action();
    }
  };

  const navLinks: Array<{ label: string; onClick: () => void }> = [
    { label: 'Home', onClick: () => onNavigateSection('hero') },
    { label: 'Collections', onClick: () => onNavigateSection('collections') },
    {
      label: 'Rings',
      onClick: () => {
        onSelectCategory('Rings');
        onNavigateSection('featured-products');
      },
    },
    {
      label: 'Necklaces',
      onClick: () => {
        onSelectCategory('Necklaces');
        onNavigateSection('featured-products');
      },
    },
    {
      label: 'Earrings',
      onClick: () => {
        onSelectCategory('Earrings');
        onNavigateSection('featured-products');
      },
    },
    { label: 'Our Story', onClick: () => onNavigateSection('brand-story') },
  ];

  const solidHeader = scrolled || isDetailView;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          solidHeader
            ? 'border-b border-[#C8A25A]/20 bg-[#150409]/96'
            : 'bg-gradient-to-b from-[#0D0508]/85 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:h-20 lg:px-10">
          {/* Left: Single-line Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(() => onNavigateSection('hero'));
            }}
            className="whitespace-nowrap shrink-0 font-serif text-2xl font-medium tracking-[0.28em] text-[#FAF7F2] transition-colors hover:text-[#E3CB98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A25A]"
          >
            AURELLE
          </a>

          {/* Center: Clean Single-line Text Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {navLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleLinkClick(item.onClick)}
                className="group relative whitespace-nowrap shrink-0 py-1 text-[13px] font-normal tracking-[0.14em] text-[#FAF7F2]/85 uppercase transition-colors hover:text-[#E3CB98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A25A]"
              >
                {item.label}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#C8A25A] transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          {/* Right: Affordance Icons */}
          <div className="flex items-center gap-2 shrink-0 sm:gap-3">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search jewellery"
              className="flex h-10 w-10 items-center justify-center text-[#FAF7F2]/85 transition-colors hover:text-[#E3CB98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A25A]"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Wishlist (${wishlistCount} saved)`}
              className="relative flex h-10 w-10 items-center justify-center text-[#FAF7F2]/85 transition-colors hover:text-[#E3CB98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A25A]"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="tabular-nums absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center bg-[#C8A25A] px-1 text-[10px] font-semibold text-[#150409]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Shopping bag (${cartCount} items)`}
              className="relative flex h-10 w-10 items-center justify-center text-[#FAF7F2]/85 transition-colors hover:text-[#E3CB98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A25A]"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="tabular-nums absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center bg-[#C8A25A] px-1 text-[10px] font-semibold text-[#150409]">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center text-[#FAF7F2] lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Premium Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#0D0508]/95 lg:hidden"
          >
            <div className="flex h-full flex-col justify-between px-8 py-8">
              <div className="flex items-center justify-between border-b border-[#C8A25A]/20 pb-5">
                <span className="font-serif text-2xl tracking-[0.28em] text-[#FAF7F2]">
                  AURELLE
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-11 w-11 items-center justify-center text-[#FAF7F2]/80 hover:text-[#E3CB98]"
                >
                  <X className="h-6 w-6" strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-col gap-5 py-8">
                {navLinks.map((item, idx) => (
                  <motion.button
                    key={item.label}
                    type="button"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx, duration: 0.3 }}
                    onClick={() => handleLinkClick(item.onClick)}
                    className="flex items-baseline justify-between border-b border-white/10 pb-3 text-left font-serif text-3xl text-[#FAF7F2] transition-colors hover:text-[#E3CB98]"
                  >
                    <span>{item.label}</span>
                    <span className="font-sans text-xs tracking-[0.2em] text-[#C8A25A]">
                      0{idx + 1}
                    </span>
                  </motion.button>
                ))}
              </nav>

              <div className="border-t border-[#C8A25A]/20 pt-5 text-xs tracking-[0.16em] text-[#FAF7F2]/60 uppercase">
                Elegance, Cast in Eternity · Place Vendôme Maison
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
