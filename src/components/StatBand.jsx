import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";

// Band with the key figures in one glowing card. `items` = [{ value, label }]; `note` is a small source line.
export default function StatBand({ items, note, testid = "stats" }) {
    return (
        <Section tone="dark" pad="md" testid={testid}>
            <Reveal>
                <GlassCard tone="glow" className="!rounded-[2.25rem]" innerClassName="bg-plus !rounded-xl sm:!rounded-2xl">
                    <dl className="grid grid-cols-2 gap-y-8 px-4 py-9 sm:px-8 md:grid-cols-4 md:py-11">
                        {items.map((s, i) => (
                            <div key={s.label} className={`flex flex-col items-center px-2 text-center md:px-4 ${i > 0 ? "md:border-l md:border-white/[.14]" : ""}`}>
                                <dd className="order-1 font-display text-[1.9rem] font-bold leading-none text-[#fffffd] sm:text-4xl lg:text-[3.4rem]">{s.value}</dd>
                                <dt className="order-2 mt-3 text-sm font-medium text-lime sm:text-base">{s.label}</dt>
                            </div>
                        ))}
                    </dl>
                </GlassCard>
            </Reveal>
            {note && <p className="mt-5 text-center text-xs text-mist/70">{note}</p>}
        </Section>
    );
}
