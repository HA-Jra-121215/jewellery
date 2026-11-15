import { FormEvent, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { JewelleryCategory } from '../types/jewellery';

interface FooterProps {
  onSelectCategory: (cat: JewelleryCategory) => void;
  onNavigateSection: (sectionId: string) => void;
}

type PolicyModalType = 'shipping' | 'privacy' | null;

export function Footer({ onSelectCategory, onNavigateSection }: FooterProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [policyModal, setPolicyModal] = useState<PolicyModalType>(null);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-[#C8A25A]/20 bg-[#140409] text-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection('hero');
              }}
              className="font-serif text-3xl tracking-[0.28em] text-[#E3CB98]"
            >
              AURELLE
            </a>
            <p className="mt-3 text-xs tracking-[0.2em] text-[#C8A25A] uppercase">
              Elegance, Cast in Eternity.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#FAF7F2]/70">
              Receive private invitations to seasonal high-jewellery previews, atelier stories,
              and new 3D vault additions.
            </p>

            <form onSubmit={handleSubscribe} noValidate className="mt-6 max-w-md">
              <div className="flex border border-[#C8A25A]/35 bg-[#1D060E] focus-within:border-[#E3CB98]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Your email address"
                  aria-label="Email address for AURELLE newsletter"
                  className="w-full bg-transparent px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-2 bg-[#C8A25A] px-5 py-3 text-xs font-semibold tracking-[0.16em] text-[#140409] uppercase transition-colors hover:bg-[#DFBE7B]"
                >
                  <span>Join</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-[#E5989B]">{error}</p>}
              {subscribed && !error && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#E3CB98]">
                  <Check className="h-3.5 w-3.5" />
                  <span>Thank you. Your invitation preference is saved for this session.</span>
                </p>
              )}
            </form>
          </div>

          {/* Shop Categories */}
          <div className="sm:col-span-4 lg:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.22em] text-[#E3CB98] uppercase">
              Collections
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#FAF7F2]/75">
              {(['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bridal'] as JewelleryCategory[]).map(
                (cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        onNavigateSection('featured-products');
                      }}
                      className="transition-colors hover:text-[#E3CB98]"
                    >
                      {cat}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Maison & Client Care */}
          <div className="sm:col-span-4 lg:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.22em] text-[#E3CB98] uppercase">
              The Maison
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#FAF7F2]/75">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('brand-story')}
                  className="transition-colors hover:text-[#E3CB98]"
                >
                  Our Heritage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('collections')}
                  className="transition-colors hover:text-[#E3CB98]"
                >
                  Curated Chapters
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setPolicyModal('shipping')}
                  className="transition-colors hover:text-[#E3CB98]"
                >
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setPolicyModal('privacy')}
                  className="transition-colors hover:text-[#E3CB98]"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="sm:col-span-4 lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.22em] text-[#E3CB98] uppercase">
              Private Concierge
            </h3>
            <div className="mt-5 space-y-3 text-sm text-[#FAF7F2]/75">
              <p>18 Place Vendôme, 75001 Paris</p>
              <p>concierge@aurelle-maison.example</p>
              <p className="tabular-nums">+33 1 42 68 55 00</p>
            </div>

            <div className="mt-6 flex items-center gap-5 text-xs tracking-[0.18em] text-[#D8B979] uppercase">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="border-b border-transparent pb-0.5 transition-colors hover:border-[#E3CB98] hover:text-[#FAF7F2]"
              >
                Instagram
              </a>
              <a
                href="https://www.pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="border-b border-transparent pb-0.5 transition-colors hover:border-[#E3CB98] hover:text-[#FAF7F2]"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[#C8A25A]/15 pt-8 text-xs text-[#FAF7F2]/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} AURELLE Haute Joaillerie. Fictional Showcase Experience.</p>
          <p>Crafted in Deep Burgundy, Champagne & 18k Gold.</p>
        </div>
      </div>

      {/* Policy Modal */}
      <AnimatePresence>
        {policyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0508]/80 p-4"
            onClick={() => setPolicyModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg border border-[#C8A25A]/30 bg-[#FAF7F2] p-8 text-[#1C050C]"
            >
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                aria-label="Close modal"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center text-[#1C050C]/70 hover:text-[#1C050C]"
              >
                <X className="h-5 w-5" />
              </button>
              <p className="text-xs tracking-[0.22em] text-[#9E7B3B] uppercase">Maison Policy</p>
              <h3 className="mt-2 font-serif text-3xl text-[#1C050C]">
                {policyModal === 'shipping' ? 'Shipping & Returns' : 'Privacy Policy'}
              </h3>
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-[#1C050C]/75">
                {policyModal === 'shipping' ? (
                  <>
                    <p>
                      All AURELLE showcase creations include complimentary insured armored courier
                      delivery in signature burgundy velvet presentation cases.
                    </p>
                    <p>
                      Unworn pieces may be returned or exchanged within 30 days. Complimentary first
                      ring resizing is included within 60 days of delivery.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      This AURELLE web application is an interactive luxury e-commerce showcase.
                      Cart, wishlist, and checkout previews run locally in your browser session.
                    </p>
                    <p>
                      No personal financial data or payment credentials are transmitted or stored on
                      external servers.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
