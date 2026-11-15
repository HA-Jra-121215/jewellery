import { ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroRingCanvas } from './three/HeroRingCanvas';

interface HeroSectionProps {
  onExploreCollection: () => void;
  onDiscoverStory: () => void;
}

export function HeroSection({ onExploreCollection, onDiscoverStory }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_50%_42%,#3A0B1B_0%,#1A050C_48%,#0B0305_100%)] pt-24 pb-10"
    >
      {/* Interactive 3D Diamond Solitaire Ring & Floating Golden Particles */}
      <HeroRingCanvas />

      {/* Subtle Vignette Scrim to Guarantee Text Legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0508]/90 via-transparent to-[#0D0508]/55"
      />

      {/* Upper Quiet Atelier Coordinates */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs tracking-[0.28em] text-[#D8B979] uppercase"
        >
          Elegance, Cast in Eternity
        </motion.p>
      </div>

      {/* Lower Editorial Hero Copy & Primary Actions */}
      <div className="relative z-10 mx-auto mt-auto w-full max-w-7xl px-6 pb-4 lg:px-10 lg:pb-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.02] font-normal tracking-tight text-[#FAF7F2]"
            >
              Jewellery That Tells Your Story.
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:pb-1"
          >
            <p className="max-w-md text-[15px] leading-relaxed text-[#FAF7F2]/80">
              Discover timeless creations crafted to celebrate your most precious moments.
              Move your cursor to illuminate the facets of our signature solitaire.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreCollection}
                className="inline-flex items-center gap-2.5 whitespace-nowrap bg-[#C8A25A] px-7 py-3.5 text-xs font-semibold tracking-[0.18em] text-[#150409] uppercase transition-colors hover:bg-[#DFBE7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3CB98]"
              >
                <span>Explore Collection</span>
                <ArrowDownRight className="h-4 w-4" strokeWidth={1.6} />
              </button>

              <button
                type="button"
                onClick={onDiscoverStory}
                className="inline-flex items-center whitespace-nowrap border border-[#C8A25A]/45 px-7 py-3.5 text-xs font-medium tracking-[0.18em] text-[#FAF7F2] uppercase transition-colors hover:border-[#E3CB98] hover:text-[#E3CB98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3CB98]"
              >
                Discover Our Story
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
