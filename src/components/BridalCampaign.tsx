import { ArrowRight } from 'lucide-react';

interface BridalCampaignProps {
  onExploreBridal: () => void;
}

export function BridalCampaign({ onExploreBridal }: BridalCampaignProps) {
  return (
    <section
      id="bridal-campaign"
      className="relative overflow-hidden bg-[#15040A] text-[#FAF7F2]"
    >
      <div className="relative min-h-[620px] w-full lg:min-h-[700px]">
        <img
          src="/src/assets/images/editorial_bridal_campaign_1794736811676.jpg"
          alt="AURELLE Bridal Collection diamond necklace and statement earrings campaign"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Measured Scrim for Guaranteed Editorial Text Legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0D0508]/90 via-[#15040A]/55 to-transparent"
        />

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl flex-col justify-end px-6 py-16 lg:min-h-[700px] lg:justify-center lg:px-10">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.28em] text-[#E3CB98] uppercase">
              AURELLE Bridal Haute Joaillerie
            </p>

            <h2 className="mt-3 font-serif text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.06] font-normal text-[#FAF7F2]">
              Made for Your Forever.
            </h2>

            <p className="mt-5 text-[15px] leading-relaxed text-[#FAF7F2]/85">
              Cascading diamond bridal necklaces, luminous South Sea drop earrings, 18k gold
              heirloom sets, and cathedral engagement rings conceived for life’s defining vows.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.16em] text-[#D8B979] uppercase">
              <span>Bridal Necklaces</span>
              <span aria-hidden="true">·</span>
              <span>Gold Bridal Sets</span>
              <span aria-hidden="true">·</span>
              <span>Statement Earrings</span>
              <span aria-hidden="true">·</span>
              <span>Engagement Rings</span>
            </div>

            <div className="mt-9">
              <button
                type="button"
                onClick={onExploreBridal}
                className="inline-flex items-center gap-3 bg-[#C8A25A] px-8 py-4 text-xs font-semibold tracking-[0.2em] text-[#150409] uppercase transition-colors hover:bg-[#DFBE7B]"
              >
                <span>Explore Bridal Collection</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
