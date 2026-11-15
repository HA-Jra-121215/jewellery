import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { COLLECTIONS } from '../data/catalog';
import { JewelleryCategory } from '../types/jewellery';

gsap.registerPlugin(ScrollTrigger);

interface CollectionShowcaseProps {
  onSelectCollection: (category: JewelleryCategory) => void;
}

export function CollectionShowcase({ onSelectCollection }: CollectionShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.collection-card');
      gsap.fromTo(
        cards,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 76%',
            once: true,
          },
        },
      );

      // Subtle parallax depth shift on collection images
      const images = gsap.utils.toArray<HTMLElement>('.collection-parallax-img');
      images.forEach((img, idx) => {
        gsap.fromTo(
          img,
          { yPercent: idx % 2 === 0 ? -5 : 5 },
          {
            yPercent: idx % 2 === 0 ? 5 : -5,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#16040A] py-24 text-[#FAF7F2] lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 border-b border-[#C8A25A]/20 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.26em] text-[#D8B979] uppercase">
              Curated Chapters
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.8vw,3.25rem)] leading-tight font-normal text-[#FAF7F2]">
              Designed to Be Remembered.
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-[#FAF7F2]/70">
            Four distinct expressions of gold, light, and heirloom stone—each sculpted to
            balance architectural clarity with effortless warmth.
          </p>
        </div>

        {/* Horizontal Editorial Strip on Mobile/Tablet, 4-Column Gallery on Desktop */}
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:gap-7 lg:overflow-visible lg:pb-0"
        >
          {COLLECTIONS.map((col, idx) => (
            <article
              key={col.id}
              onClick={() => onSelectCollection(col.filterCategory)}
              className={`collection-card group relative flex w-[78vw] shrink-0 cursor-pointer snap-start flex-col sm:w-[46vw] lg:w-auto ${
                idx % 2 === 1 ? 'lg:mt-8' : ''
              }`}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#C8A25A]/20 bg-[#230710]">
                <img
                  src={col.image}
                  alt={col.title}
                  referrerPolicy="no-referrer"
                  className="collection-parallax-img h-[112%] w-full -translate-y-[6%] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {/* Measured gradient scrim for legibility */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0508]/90 via-[#0D0508]/20 to-transparent" />

                {/* Floating 3D-inspired index */}
                <div className="absolute left-5 top-5 text-xs tracking-[0.22em] text-[#E3CB98]">
                  {col.number}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[11px] tracking-[0.2em] text-[#D8B979] uppercase">
                    {col.subtitle}
                  </p>
                  <h3 className="mt-1.5 font-serif text-2xl font-normal text-[#FAF7F2]">
                    {col.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#FAF7F2]/75">
                    {col.description}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 border-b border-[#C8A25A]/60 pb-1 text-xs tracking-[0.18em] text-[#E3CB98] uppercase transition-colors group-hover:border-[#FAF7F2] group-hover:text-[#FAF7F2]">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
