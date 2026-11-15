import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS, RING_SIZES } from './data/catalog';
import { CartItem, JewelleryCategory, MetalFinishId, Product } from './types/jewellery';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CollectionShowcase } from './components/CollectionShowcase';
import { ProductCatalog } from './components/ProductCatalog';
import { ScrollStorytelling } from './components/ScrollStorytelling';
import { BrandStorySection } from './components/BrandStorySection';
import { BridalCampaign } from './components/BridalCampaign';
import { TestimonialsTrust } from './components/TestimonialsTrust';
import { Footer } from './components/Footer';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';

gsap.registerPlugin(ScrollTrigger);

const STORAGE_CART_KEY = 'aurelle_cart_v1';
const STORAGE_WISHLIST_KEY = 'aurelle_wishlist_v1';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<JewelleryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_WISHLIST_KEY);
      return raw ? JSON.parse(raw) : ['solitaire-ring'];
    } catch {
      return ['solitaire-ring'];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const lenisRef = useRef<Lenis | null>(null);

  // Persist cart & wishlist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore storage quota errors
    }
  }, [wishlistIds]);

  // Lenis smooth scroll + GSAP ScrollTrigger synchronization
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Refresh ScrollTrigger when switching back from ProductDetailView
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [selectedProduct]);

  const navigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const handleAddToCart = (
    product: Product,
    metal: MetalFinishId = product.defaultMetal,
    ringSize?: string,
    quantity = 1,
  ) => {
    const resolvedSize = product.hasRingSize ? ringSize || RING_SIZES[3] : undefined;
    const key = `${product.id}__${metal}__${resolvedSize || 'std'}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...prev, { key, productId: product.id, metal, ringSize: resolvedSize, quantity }];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0D0508] text-[#FAF7F2]">
      <Navbar
        onNavigateSection={navigateToSection}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        wishlistCount={wishlistIds.length}
        cartCount={totalCartCount}
        isDetailView={Boolean(selectedProduct)}
        onExitDetailView={() => setSelectedProduct(null)}
      />

      {selectedProduct ? (
        <main>
          <ProductDetailView
            product={selectedProduct}
            allProducts={PRODUCTS}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onBack={() => setSelectedProduct(null)}
            isWished={wishlistIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
        </main>
      ) : (
        <main>
          <HeroSection
            onExploreCollection={() => navigateToSection('collections')}
            onDiscoverStory={() => navigateToSection('brand-story')}
          />

          <CollectionShowcase
            onSelectCollection={(cat) => {
              setActiveCategory(cat);
              navigateToSection('featured-products');
            }}
          />

          <ProductCatalog
            products={PRODUCTS}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onOpenDetail={(prod) => setSelectedProduct(prod)}
            onQuickAddToCart={(prod) => handleAddToCart(prod)}
          />

          <ScrollStorytelling />

          <BrandStorySection />

          <BridalCampaign
            onExploreBridal={() => {
              setActiveCategory('Bridal');
              navigateToSection('featured-products');
            }}
          />

          <TestimonialsTrust />
        </main>
      )}

      <Footer
        onSelectCategory={(cat) => {
          setSelectedProduct(null);
          setActiveCategory(cat);
        }}
        onNavigateSection={(sectionId) => {
          if (selectedProduct) {
            setSelectedProduct(null);
            setTimeout(() => navigateToSection(sectionId), 80);
          } else {
            navigateToSection(sectionId);
          }
        }}
      />

      {/* Interactive Drawers & Overlays */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistIds={wishlistIds}
        onRemove={handleToggleWishlist}
        onInspect3D={(prod) => setSelectedProduct(prod)}
        onAddToCart={(prod) => handleAddToCart(prod)}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onApplySearchToCatalog={(q) => {
          setSearchQuery(q);
          setSelectedProduct(null);
          setTimeout(() => navigateToSection('featured-products'), 80);
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWished={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(prod, metal, size) => handleAddToCart(prod, metal, size, 1)}
        onOpenFull3D={(prod) => setSelectedProduct(prod)}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        onOrderComplete={() => setCart([])}
      />
    </div>
  );
}
