import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import GlassCard from "@/components/GlassCard";
import IconRow from "@/components/IconRow";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { SectionHeading } from "@/components/ui";
import { WHY_ICONS } from "@/components/icons";
import { COMPANY } from "@/data/site";
import { AWARD_IMAGES, COMPANY_IMAGES } from "@/data/images";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

const label = "font-display text-[0.95rem] font-bold leading-snug text-lime whole-words";
const body = "text-base leading-relaxed text-mist";

export default function CompanyPage() {
    const { S } = useI18n();
    const c = S.company;
    useDocumentMeta(c.title, c.description);
    return (
        <>
            <PageHero eyebrow={c.title} title={c.heroTitle} crumbs={[{ label: c.title }]} lead={c.heroLead} />

            <Section tone="teal" testid="about">
                <div className="grid gap-12 lg:grid-cols-12">
                    <Reveal className="space-y-5 text-lg leading-relaxed text-mist lg:col-span-8">
                        {c.about.map((t) => <p key={t}>{t}</p>)}
                    </Reveal>
                    <aside className="space-y-6 lg:col-span-4">
                        <GlassCard tone="moss" data-testid="company-facts" innerClassName="p-6">
                            <h2 className={label}>{c.factsTitle}</h2>
                            <dl className="mt-5 space-y-4 text-sm">
                                <div><dt className="font-semibold text-[#fffffd]">{c.factCompany}</dt><dd>{COMPANY.name}, {COMPANY.city}</dd></div>
                                <div><dt className="font-semibold text-[#fffffd]">{c.factGroup}</dt><dd>{COMPANY.groupName}, {c.factGroupValue}</dd></div>
                                <div><dt className="font-semibold text-[#fffffd]">{c.factCustomers}</dt><dd>{c.factCustomersValue}</dd></div>
                            </dl>
                        </GlassCard>
                        <GlassCard hover>
                            <Photo file={COMPANY_IMAGES.team} alt={c.heroTitle} className="w-full object-cover" data-testid="company-photo" />
                        </GlassCard>
                    </aside>
                </div>
            </Section>

            <Section tone="dark" testid="vision">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {[[c.goalTitle, c.goalText], [c.visionTitle, c.visionText], [c.missionTitle, c.missionText], [c.qualityTitle, c.qualityText]].map(([h, t]) => (
                        <GlassCard key={h} hover innerClassName="h-full p-6">
                            <h2 className={label}>{h}</h2>
                            <p className={`mt-4 ${body}`}>{t}</p>
                        </GlassCard>
                    ))}
                </div>
            </Section>

            <Section tone="teal" testid="goals">
                <Reveal><SectionHeading eyebrow={c.goalsEyebrow} title={c.goalsTitle} /></Reveal>
                <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {S.goals.map((g, i) => (
                        <GlassCard as="li" key={g} tone="slate" innerClassName="flex gap-4 px-5 py-4">
                            <span className="font-display text-sm font-bold text-lime">{String(i + 1).padStart(2, "0")}</span>
                            <span className="font-semibold text-[#fffffd]">{g}</span>
                        </GlassCard>
                    ))}
                </ul>
            </Section>

            <Section tone="dark" testid="values">
                <Reveal><SectionHeading eyebrow={c.valuesEyebrow} title={c.valuesTitle} /></Reveal>
                <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
                    <GlassCard tone="moss" className="lg:col-span-4"><Photo file={COMPANY_IMAGES.values} alt={c.valuesTitle} className="w-full object-cover" data-testid="values-photo" /></GlassCard>
                    <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 lg:col-span-8">
                        {S.values.map((v) => (
                            <GlassCard as="li" key={v.t} hover innerClassName="h-full p-6">
                                <h3 className="font-display text-[clamp(0.95rem,3.4vw,1.15rem)] font-bold leading-snug text-[#fffffd] whole-words">{v.t}</h3>
                                <p className={`mt-3 ${body}`}>{v.d}</p>
                            </GlassCard>
                        ))}
                    </ul>
                </div>
            </Section>

            <Section tone="teal" testid="why">
                <Reveal><SectionHeading eyebrow={c.whyEyebrow} title={c.whyTitle} /></Reveal>
                <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
                    {S.whyUs.map((w, i) => <IconRow key={w.t} icon={WHY_ICONS[i]} title={w.t}>{w.d}</IconRow>)}
                </ul>
            </Section>

            <Section tone="dark" testid="awards">
                <Reveal><SectionHeading title={c.awardsTitle} /></Reveal>
                <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {AWARD_IMAGES.map((file) => (
                        <GlassCard as="li" key={file} hover innerClassName="flex aspect-[4/5] items-center justify-center bg-deep-950">
                            <Photo file={file} alt={c.awardsTitle} className="h-full w-full object-contain" />
                        </GlassCard>
                    ))}
                </ul>
            </Section>

            <CtaBand title={c.ctaTitle} text={c.ctaText} />
        </>
    );
}
