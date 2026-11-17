import PageHero from "@/components/PageHero";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { SectionHeading, Ph } from "@/components/ui";
import { COMPANY } from "@/data/site";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function CareerPage() {
    const { S } = useI18n();
    const c = S.career;
    useDocumentMeta(c.title, c.description);
    return (
        <>
            <PageHero eyebrow={c.title} title={c.heroTitle} crumbs={[{ label: c.title }]} lead={c.heroLead} />
            <Section tone="teal" testid="career-intro">
                <Reveal className="max-w-4xl space-y-5 text-lg leading-relaxed text-mist">
                    {c.intro.map((t) => <p key={t}>{t}</p>)}
                </Reveal>
            </Section>
            <Section tone="dark" testid="rewards">
                <Reveal><SectionHeading eyebrow={c.rewardsEyebrow} title={c.rewardsTitle} /></Reveal>
                <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {c.rewards.map((r, i) => (
                        <GlassCard as="li" key={r.t} hover className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""} innerClassName="h-full p-6">
                            <h3 className="font-display text-[clamp(0.95rem,3.4vw,1.15rem)] font-bold leading-snug text-[#fffffd] whole-words">{r.t}</h3>
                            <p className="mt-3 text-base leading-relaxed text-mist">{r.d}</p>
                        </GlassCard>
                    ))}
                </ul>
            </Section>
            <Section tone="teal" testid="open-application">
                <Reveal className="max-w-4xl">
                    <SectionHeading title={c.applyTitle} copy={c.applyCopy} />
                    <p className="mt-6 text-lg text-mist">{c.applyTo} <span className="font-semibold text-[#fffffd]"><Ph value={COMPANY.email} /></span></p>
                </Reveal>
            </Section>
        </>
    );
}
