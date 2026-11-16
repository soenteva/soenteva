import { Link, useParams } from "react-router-dom";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import { Container, SectionHeading } from "@/components/ui";
import { getIndustries, getIndustry, industryPath } from "@/data/industries";
import { getApplicationById, applicationPath } from "@/data/applications";
import { INDUSTRY_IMAGES } from "@/data/images";
import { fill, useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import NotFoundPage from "@/pages/NotFoundPage";

export function IndustriesIndexPage() {
    const { lang, S } = useI18n();
    const s = S.industries;
    useDocumentMeta(s.title, s.description);
    return (
        <>
            <PageHero eyebrow={s.title} title={s.heroTitle} crumbs={[{ label: s.title }]} lead={s.heroLead} />
            <section className="py-20" data-testid="industries-intro">
                <Container className="max-w-4xl space-y-5 text-lg leading-relaxed">
                    {s.intro.map((t) => <p key={t}>{t}</p>)}
                </Container>
            </section>
            <section className="bg-navy-50 py-20" data-testid="industries-list">
                <Container>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {getIndustries(lang).map((i) => (
                            <li key={i.id}>
                                <Link to={industryPath(lang, i.id)} className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:border-navy hover:shadow-lg">
                                    <Photo file={INDUSTRY_IMAGES[i.id].tile} alt={i.title} className="mb-4 h-[90px] w-[90px] rounded-lg object-cover" />
                                    <h2 className="text-xl font-bold text-navy">{i.title}</h2>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed">{i.short}</p>
                                    <span className="mt-5 text-sm font-bold text-navy group-hover:text-amber-600">{S.common.learnMore}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>
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
    return (
        <>
            <PageHero eyebrow={s.detailEyebrow} title={fill(s.detailTitle, { title: industry.title })} crumbs={[{ label: s.title, to: p("industries") }, { label: industry.title }]} lead={industry.short} />
            <section className="py-20" data-testid="industry-body">
                <Container className="grid gap-12 lg:grid-cols-12">
                    <div className="space-y-5 text-lg leading-relaxed lg:col-span-8">{industry.paragraphs.map((t) => <p key={t}>{t}</p>)}</div>
                    <aside className="lg:col-span-4">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">{s.relatedTitle}</h2>
                        <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
                            {related.map((a) => <li key={a.id}><Link to={applicationPath(lang, a.id)} className="block px-5 py-4 font-bold text-navy hover:bg-navy-50">{a.title}</Link></li>)}
                        </ul>
                    </aside>
                </Container>
            </section>
            <section className="pb-20" data-testid="industry-photos">
                <Container>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {INDUSTRY_IMAGES[industry.id].photos.map((file) => (
                            <li key={file}><Photo file={file} alt={fill(s.detailTitle, { title: industry.title })} className="aspect-[16/10] w-full rounded-xl object-cover" /></li>
                        ))}
                    </ul>
                </Container>
            </section>
            <section className="bg-navy-50 py-16">
                <Container>
                    <SectionHeading title={s.moreTitle} />
                    <ul className="mt-8 flex flex-wrap gap-3">
                        {getIndustries(lang).filter((i) => i.id !== industry.id).map((i) => <li key={i.id}><Link to={industryPath(lang, i.id)} className="inline-block rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-navy">{i.title}</Link></li>)}
                    </ul>
                </Container>
            </section>
            <CtaBand title={fill(s.detailCtaTitle, { title: industry.title })} text={s.detailCtaText} />
        </>
    );
}
