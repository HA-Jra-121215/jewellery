import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StorytellingCanvas } from './three/StorytellingCanvas';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    index: 'I',
    title: 'Emerging from Shadow',
    copy: 'Every heirloom begins in quiet darkness—raw 18k gold hand-drawn into sculpted links until warmth catches the edge.',
  },
  {
    index: 'II',
    title: 'Calibrated for Light',
    copy: 'Fifty-seven mathematical diamond facets align within fractions of a millimeter so a passing glance ignites prismatic fire.',
  },
  {
    index: 'III',
    title: 'Held Across Generations',
    copy: 'When deep burgundy gives way to warm champagne daylight, a piece ceases to be ornament and becomes memory.',
  },
];

export function ScrollStorytelling() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<number>(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isLightPhase, setIsLightPhase] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      progressRef.current = 0.75;
      return;
    }

    const ctx = gsap.context(() => {
      // Smoothly transition section background from deep burgundy to warm champagne
      gsap.fromTo(
        section,
        { backgroundColor: '#1C050C' },
        {
          backgroundColor: '#F4ECE2',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 25%',
            end: 'bottom 75%',
            scrub: 0.6,
            onUpdate: (self) => {
              progressRef.current = self.progress;
              setIsLightPhase(self.progress > 0.56);
              if (self.progress < 0.34) setActiveChapter(0);
              else if (self.progress < 0.68) setActiveChapter(1);
              else setActiveChapter(2);
            },
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#1C050C' }}
      className="relative py-24 transition-colors duration-300 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Sticky 3D Storytelling Canvas */}
          <div className="lg:sticky lg:top-28 lg:col-span-6">
            <div className="relative h-[380px] w-full overflow-hidden border border-[#C8A25A]/25 bg-[#120308]/90 shadow-2xl sm:h-[460px] lg:h-[520px]">
              <StorytellingCanvas scrollProgressRef={progressRef} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0D0508]/85 to-transparent px-6 py-4">
                <p className="text-[11px] tracking-[0.22em] text-[#E3CB98] uppercase">
                  Scroll Choreography · Gold & Brilliant Cut
                </p>
              </div>
            </div>
          </div>

          {/* Right Editorial Chapters */}
          <div className="lg:col-span-6 lg:pl-8">
            <p
              className={`text-xs tracking-[0.26em] uppercase transition-colors duration-500 ${
                isLightPhase ? 'text-[#9E7B3B]' : 'text-[#D8B979]'
              }`}
            >
              The Maison Philosophy
            </p>

            <h2
              className={`mt-3 font-serif text-[clamp(2.1rem,3.8vw,3.35rem)] leading-tight font-normal transition-colors duration-500 ${
                isLightPhase ? 'text-[#1C050C]' : 'text-[#FAF7F2]'
              }`}
            >
              Every Piece Holds an Emotion.
            </h2>

            <div className="mt-12 space-y-10">
              {CHAPTERS.map((ch, idx) => {
                const isActive = activeChapter === idx;
                return (
                  <div
                    key={ch.index}
                    className={`border-t pt-6 transition-all duration-500 ${
                      isLightPhase ? 'border-[#1C050C]/15' : 'border-[#FAF7F2]/15'
                    } ${isActive ? 'opacity-100' : 'opacity-45'}`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-serif text-lg italic ${
                          isLightPhase ? 'text-[#9E7B3B]' : 'text-[#E3CB98]'
                        }`}
                      >
                        {ch.index}.
                      </span>
                      <h3
                        className={`font-serif text-2xl font-normal transition-colors duration-500 ${
                          isLightPhase ? 'text-[#1C050C]' : 'text-[#FAF7F2]'
                        }`}
                      >
                        {ch.title}
                      </h3>
                    </div>
                    <p
                      className={`mt-3 pl-8 text-[15px] leading-relaxed transition-colors duration-500 ${
                        isLightPhase ? 'text-[#1C050C]/75' : 'text-[#FAF7F2]/75'
                      }`}
                    >
                      {ch.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
