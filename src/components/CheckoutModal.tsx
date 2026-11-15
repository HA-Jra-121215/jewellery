import { FormEvent, useState } from 'react';
import { CheckCircle2, Lock, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { METAL_FINISHES, PRODUCTS, formatUSD } from '../data/catalog';
import { CartItem } from '../types/jewellery';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

export function CheckoutModal({ open, onClose, items, onOrderComplete }: CheckoutModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim()) {
      setError('Please complete your name, email, and delivery address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    const refCode = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedRef(refCode);
    onOrderComplete();
  };

  const handleClose = () => {
    setConfirmedRef(null);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#0D0508]/80"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-[#C8A25A]/30 bg-[#FAF7F2] p-7 text-[#1C050C] sm:p-10"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close checkout"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-[#1C050C]/70 hover:text-[#1C050C]"
            >
              <X className="h-5 w-5" />
            </button>

            {confirmedRef ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#9E7B3B]" strokeWidth={1.4} />
                <p className="mt-4 text-xs tracking-[0.24em] text-[#9E7B3B] uppercase">
                  Demo Reservation Confirmed
                </p>
                <h2 className="mt-2 font-serif text-4xl text-[#1C050C]">
                  Reference #{confirmedRef}
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#1C050C]/75">
                  Thank you, {fullName}. Your AURELLE showroom preview summary has been prepared
                  for <span className="font-medium">{email}</span>. No real payment or shipment has
                  been initiated.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-8 bg-[#2A0813] px-8 py-3.5 text-xs font-semibold tracking-[0.2em] text-[#FAF7F2] uppercase hover:bg-[#3D0D1D]"
                >
                  Return to Maison
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9E7B3B] uppercase">
                  Private Client Checkout Preview
                </p>
                <h2 className="mt-2 font-serif text-3xl text-[#1C050C]">
                  Complete Your Acquisition Preview
                </h2>

                <div className="mt-4 flex items-center gap-2.5 border border-[#C8A25A]/40 bg-[#F4ECE2] px-4 py-3 text-xs text-[#1C050C]/80">
                  <Lock className="h-4 w-4 shrink-0 text-[#9E7B3B]" />
                  <span>
                    Interactive Demo Checkout — No payment gateway is connected and no real charge
                    occurs.
                  </span>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-12">
                  <form onSubmit={handleSubmit} className="space-y-4 md:col-span-7">
                    <div>
                      <label className="block text-xs tracking-[0.14em] text-[#1C050C]/70 uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Camille Laurent"
                        className="mt-1.5 w-full border border-[#1C050C]/20 bg-white px-3.5 py-2.5 text-sm focus:border-[#2A0813] focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs tracking-[0.14em] text-[#1C050C]/70 uppercase">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="camille@example.com"
                          className="mt-1.5 w-full border border-[#1C050C]/20 bg-white px-3.5 py-2.5 text-sm focus:border-[#2A0813] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs tracking-[0.14em] text-[#1C050C]/70 uppercase">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 212 555 0194"
                          className="mt-1.5 w-full border border-[#1C050C]/20 bg-white px-3.5 py-2.5 text-sm focus:border-[#2A0813] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs tracking-[0.14em] text-[#1C050C]/70 uppercase">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="18 Avenue Montaigne"
                        className="mt-1.5 w-full border border-[#1C050C]/20 bg-white px-3.5 py-2.5 text-sm focus:border-[#2A0813] focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs tracking-[0.14em] text-[#1C050C]/70 uppercase">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Paris"
                          className="mt-1.5 w-full border border-[#1C050C]/20 bg-white px-3.5 py-2.5 text-sm focus:border-[#2A0813] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs tracking-[0.14em] text-[#1C050C]/70 uppercase">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="75008"
                          className="mt-1.5 w-full border border-[#1C050C]/20 bg-white px-3.5 py-2.5 text-sm focus:border-[#2A0813] focus:outline-none"
                        />
                      </div>
                    </div>

                    {error && <p className="text-xs text-[#9E2A45]">{error}</p>}

                    <button
                      type="submit"
                      className="mt-2 w-full bg-[#2A0813] py-3.5 text-xs font-semibold tracking-[0.2em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#3D0D1D]"
                    >
                      Confirm Demo Order Preview
                    </button>
                  </form>

                  <div className="border border-[#1C050C]/10 bg-[#F4ECE2] p-5 md:col-span-5">
                    <h3 className="text-xs font-semibold tracking-[0.18em] uppercase">
                      Order Summary
                    </h3>
                    <ul className="mt-4 divide-y divide-[#1C050C]/10 text-xs">
                      {enriched.map(({ key, product, metal, ringSize, quantity }) => {
                        if (!product) return null;
                        return (
                          <li key={key} className="flex justify-between gap-2 py-2.5">
                            <div>
                              <p className="font-medium text-[#1C050C]">
                                {product.name} × {quantity}
                              </p>
                              <p className="text-[#1C050C]/65">
                                {METAL_FINISHES[metal].shortLabel}
                                {ringSize ? ` · ${ringSize}` : ''}
                              </p>
                            </div>
                            <span className="tabular-nums font-medium">
                              {formatUSD(product.priceUSD * quantity)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-4 border-t border-[#1C050C]/15 pt-4">
                      <div className="flex justify-between text-xs text-[#1C050C]/70">
                        <span>Insured Courier</span>
                        <span>Complimentary</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-xs tracking-[0.16em] uppercase">Total</span>
                        <span className="tabular-nums font-serif text-2xl text-[#1C050C]">
                          {formatUSD(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
