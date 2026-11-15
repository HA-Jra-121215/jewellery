import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function BrandStorySection() {
  const [atelierOpen, setAtelierOpen] = useState(false);

  return (
    <section id="brand-story" className="bg-[#FAF7F2] py-24 text-[#1C050C] lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Macro Craftsmanship Editorial Photograph */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[360px] overflow-hidden border border-[#1C050C]/12 bg-[#1C050C]">
              <img
                src="/src/assets/images/editorial_craftsmanship_1794736811016.jpg"
                alt="Master Parisian jeweller calibrating an 18k gold diamond ring at the workbench"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right Editorial Manifesto */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-xs tracking-[0.26em] text-[#9E7B3B] uppercase">
              Maison Heritage · Place Vendôme
            </p>

            <h2 className="mt-3 font-serif text-[clamp(2.1rem,3.6vw,3.2rem)] leading-tight font-normal text-[#1C050C]">
              Crafted Beyond Time.
            </h2>

            <p className="mt-6 text-[16px] leading-[1.8] text-[#1C050C]/80">
              At AURELLE, every creation is a celebration of artistry, beauty, and
              individuality. We believe true luxury is not simply worn. It is
              experienced, cherished, and passed through generations.
            </p>

            <p className="mt-4 text-[15px] leading-[1.75] text-[#1C050C]/65">
              Each mounting is hand-forged in recycled 18k solid gold and inspected under
              40x binocular magnification before receiving the AURELLE maison hallmark.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-y border-[#1C050C]/12 py-6">
              <div>
                <p className="tabular-nums font-serif text-3xl text-[#2A0813]">42+</p>
                <p className="mt-1 text-xs tracking-[0.14em] text-[#1C050C]/60 uppercase">
                  Atelier Hours
                </p>
              </div>
              <div>
                <p className="tabular-nums font-serif text-3xl text-[#2A0813]">Au750</p>
                <p className="mt-1 text-xs tracking-[0.14em] text-[#1C050C]/60 uppercase">
                  Solid 18k Gold
                </p>
              </div>
              <div>
                <p className="tabular-nums font-serif text-3xl text-[#2A0813]">VVS1</p>
                <p className="mt-1 text-xs tracking-[0.14em] text-[#1C050C]/60 uppercase">
                  Graded Clarity
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setAtelierOpen(true)}
                className="inline-flex items-center gap-3 bg-[#2A0813] px-7 py-4 text-xs font-semibold tracking-[0.18em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#3D0D1D]"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Intimate Atelier Heritage Dossier Modal */}
      <AnimatePresence>
        {atelierOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0508]/80 p-4"
            onClick={() => setAtelierOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#C8A25A]/30 bg-[#FAF7F2] p-8 text-[#1C050C] sm:p-10"
            >
              <button
                type="button"
                onClick={() => setAtelierOpen(false)}
                aria-label="Close atelier story"
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-[#1C050C]/70 hover:text-[#1C050C]"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="text-xs tracking-[0.24em] text-[#9E7B3B] uppercase">
                The AURELLE Dossier
              </p>
              <h3 className="mt-2 font-serif text-3xl text-[#1C050C]">
                Three Pillars of Parisian Goldsmithing
              </h3>

              <div className="mt-6 space-y-6 border-t border-[#1C050C]/10 pt-6 text-[15px] leading-relaxed text-[#1C050C]/80">
                <div>
                  <h4 className="font-serif text-xl text-[#2A0813]">
                    01. Architectural Wax & Hand-Forging
                  </h4>
                  <p className="mt-1">
                    Every ring silhouette begins as a carved wax study balanced for finger
                    ergonomics and gallery light admission before lost-wax casting in 18k alloy.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-xl text-[#2A0813]">
                    02. Microscope Talon Setting
                  </h4>
                  <p className="mt-1">
                    Our gem setters shape minimal prongs under high magnification so the metal
                    disappears around the girdle, letting the diamond command the eye.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-xl text-[#2A0813]">
                    03. Satin & Mirror Burnishing
                  </h4>
                  <p className="mt-1">
                    Alternating hand-brushed matte planes with mirror-polished inner bezels creates
                    quiet contrast that ages gracefully over decades.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
