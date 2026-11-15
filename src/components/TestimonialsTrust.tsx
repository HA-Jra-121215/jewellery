import { Award, Lock, Package, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/catalog';

const TRUST_PILLARS = [
  {
    icon: Lock,
    title: 'Protected Checkout Experience',
    description:
      'Interactive storefront preview with transparent USD pricing and zero hidden fees. No real payment is charged in this demo.',
  },
  {
    icon: Award,
    title: 'Authentic Craft Information',
    description:
      'Every piece specifies solid 18k Au750 gold alloy weights, diamond clarity grades, and natural South Sea pearl provenance.',
  },
  {
    icon: Package,
    title: 'Burgundy Velvet Presentation',
    description:
      'Each creation arrives nestled inside a hand-lined deep burgundy velvet case with ribbon seal and care cloth.',
  },
];

export function TestimonialsTrust() {
  return (
    <section className="bg-[#F4ECE2] py-24 text-[#1C050C] lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 flex flex-col justify-between gap-4 border-b border-[#1C050C]/12 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.26em] text-[#9E7B3B] uppercase">
              Client Reflections · Curated Demo Archive
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.4vw,3rem)] leading-tight font-normal text-[#1C050C]">
              Cherished Across Moments.
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-[#1C050C]/65">
            Illustrative client testimonials and maison guarantees displayed for this AURELLE
            digital showroom preview.
          </p>
        </div>

        {/* 3 Demo Client Testimonials */}
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between border border-[#1C050C]/10 bg-[#FAF7F2] p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5 fill-[#C8A25A] text-[#C8A25A]"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] tracking-[0.14em] text-[#9E7B3B] uppercase">
                    {item.demoLabel}
                  </span>
                </div>

                <blockquote className="mt-6 font-serif text-[20px] leading-relaxed text-[#1C050C]">
                  “{item.quote}”
                </blockquote>
              </div>

              <div className="mt-8 border-t border-[#1C050C]/10 pt-4">
                <p className="text-sm font-medium text-[#1C050C]">
                  {item.clientName} · <span className="font-normal text-[#1C050C]/65">{item.location}</span>
                </p>
                <p className="mt-1 text-xs text-[#9E7B3B]">{item.pieceAcquired}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Maison Guarantees Strip */}
        <div className="mt-14 grid gap-8 border-t border-[#1C050C]/12 pt-12 md:grid-cols-3">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#C8A25A]/45 text-[#9E7B3B]">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#1C050C]">{pillar.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#1C050C]/70">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
