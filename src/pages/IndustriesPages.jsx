import { Link, useParams } from "react-router-dom";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import GlassCard from "@/components/GlassCard";
import Photo from "@/components/Photo";
import { stripArrow } from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { SectionHeading } from "@/components/ui";
import { ArrowCircleIcon } from "@/components/icons";
import { getIndustries, getIndustry, industryPath } from "@/data/industries";
import { getApplicationById, applicationPath } from "@/data/applications";
import { INDUSTRY_IMAGES } from "@/data/images";
import { fill, useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import NotFoundPage from "@/pages/NotFoundPage";

const label = "font-display text-[0.95rem] font-bold leading-snug text-lime whole-words";

export function IndustriesIndexPage() {
    const { lang, S } = useI18n();
    const s = S.industries;
    useDocumentMeta(s.title, s.description);
    return (
        <>
            <PageHero eyebrow={s.title} title={s.heroTitle} crumbs={[{ label: s.title }]} lead={s.heroLead} />
            <Section tone="teal" testid="industries-intro">
                <Reveal className="max-w-4xl space-y-5 text-lg leading-relaxed text-mist">
                    {s.intro.map((t) => <p key={t}>{t}</p>)}
                </Reveal>
            </Section>
            <Section tone="dark" testid="industries-list">
                <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {getIndustries(lang).map((i) => (
                        <GlassCard as="li" key={i.id} tone="slate" hover innerClassName="h-full">
                            <Link to={industryPath(lang, i.id)} className="group flex h-full flex-col p-5 sm:p-6">
                                <Photo file={INDUSTRY_IMAGES[i.id].tile} alt={i.title} className="mb-5 h-[90px] w-[90px] rounded-2xl object-cover" />
                                <h2 className="font-display text-[clamp(0.8rem,3.4vw,1rem)] font-bold leading-snug text-[#fffffd] whole-words">{i.title}</h2>
                                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{i.short}</p>
                                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-lime">{stripArrow(S.common.learnMore)}<ArrowCircleIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                            </Link>
                        </GlassCard>
                    ))}
                </ul>
            </Section>
            <CtaBand title={s.ctaTitle} text={s.ctaText} />
        </>
    );
}

export function IndustryPage() {
    const { slug } = useParams();
    const { lang, S, p } = useI18n();
    const s = S.industries;
    const industry = getIndustry(lang, slug);
    useDocumentMeta(industry ? industry.title : s.detailEyebrow, industry ? industry.short : "");
    if (!industry) return <NotFoundPage />;
    const related = industry.related.map((id) => getApplicationById(lang, id)).filter(Boolean);
    const title = fill(s.detailTitle, { title: industry.title });
    return (
        <>
            <PageHero eyebrow={s.detailEyebrow} title={title} crumbs={[{ label: s.title, to: p("industries") }, { label: industry.title }]} lead={industry.short} />
            <Section tone="teal" testid="industry-body">
                <div className="grid gap-12 lg:grid-cols-12">
                    <Reveal className="space-y-5 text-lg leading-relaxed text-mist lg:col-span-8">{industry.paragraphs.map((t) => <p key={t}>{t}</p>)}</Reveal>
                    <aside className="lg:col-span-4">
                        <h2 className={label}>{s.relatedTitle}</h2>
                        <GlassCard className="mt-4" innerClassName="p-2">
                            <ul className="divide-y divide-white/10">
                                {related.map((a) => <li key={a.id}><Link to={applicationPath(lang, a.id)} className="block rounded-xl px-4 py-3.5 font-semibold text-[#fffffd] transition-colors hover:text-lime">{a.title}</Link></li>)}
                            </ul>
                        </GlassCard>
                    </aside>
                </div>
            </Section>
            <Section tone="dark" pad="md" testid="industry-photos">
                <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {INDUSTRY_IMAGES[industry.id].photos.map((file) => (
                        <GlassCard as="li" key={file} hover><Photo file={file} alt={title} className="aspect-[16/10] w-full object-cover" /></GlassCard>
                    ))}
                </ul>
            </Section>
            <Section tone="teal" pad="md">
                <SectionHeading title={s.moreTitle} />
                <ul className="mt-8 flex flex-wrap gap-3">
                    {getIndustries(lang).filter((i) => i.id !== industry.id).map((i) => <li key={i.id}><Link to={industryPath(lang, i.id)} className="inline-block rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-[#fffffd] transition-colors hover:border-lime hover:text-lime">{i.title}</Link></li>)}
                </ul>
            </Section>
            <CtaBand title={fill(s.detailCtaTitle, { title: industry.title })} text={s.detailCtaText} />
        </>
    );
}
