import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";

// The glowing card with the figures. `items` = [{ value, label }].
// `wide` is for long values ("30 bis 60 %", "0,001 mm"): one column on a phone, two by two on a tablet, four columns
// sized to their content on a wide screen, with smaller numbers, so every value stays on one line.
export function StatGrid({ items, wide = false }) {
    return (
        <Reveal>
            <GlassCard tone="glow" className="!rounded-[2.25rem]" innerClassName="bg-plus !rounded-xl sm:!rounded-2xl">
                <dl className={wide
                    ? "grid grid-cols-1 gap-y-8 px-4 py-9 sm:px-8 md:grid-cols-2 md:py-11 xl:grid-cols-[repeat(4,auto)] xl:justify-between"
                    : "grid grid-cols-2 gap-y-8 px-4 py-9 sm:px-8 md:grid-cols-4 md:py-11"}>
                    {items.map((s, i) => (
                        <div key={s.label} className={`flex flex-col items-center px-2 text-center md:px-4 ${i > 0 ? (wide ? "xl:border-l xl:border-white/[.14]" : "md:border-l md:border-white/[.14]") : ""}`}>
                            <dd className={`order-1 font-display font-bold leading-[1.2] text-[#fffffd] ${wide ? "whitespace-nowrap text-[1.75rem] md:text-[2rem] lg:text-[2.5rem]" : "text-[1.9rem] sm:text-4xl lg:text-[2.75rem] xl:text-[3.4rem]"}`}>{s.value}</dd>
                            <dt className="order-2 mt-3 text-sm font-medium text-lime sm:text-base">{s.label}</dt>
                        </div>
                    ))}
                </dl>
            </GlassCard>
        </Reveal>
    );
}

// Band with the key figures in one glowing card. `note` is a small source line.
export default function StatBand({ items, note, testid = "stats" }) {
    return (
        <Section tone="dark" pad="md" testid={testid}>
            <StatGrid items={items} />
            {note && <p className="mt-5 text-center text-xs text-mist/70">{note}</p>}
        </Section>
    );
}
