import { Link, useParams } from "react-router-dom";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import GlassCard from "@/components/GlassCard";
import Photo from "@/components/Photo";
import { stripArrow } from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { StatGrid } from "@/components/StatBand";
import { SectionHeading } from "@/components/ui";
import { ArrowCircleIcon } from "@/components/icons";
import { getApplications, getApplication, getMoreApplications, applicationPath } from "@/data/applications";
import { APPLICATION_BANNER, APPLICATION_IMAGES } from "@/data/images";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import NotFoundPage from "@/pages/NotFoundPage";

const num = (i) => String(i + 1).padStart(2, "0");
const label = "font-display text-[0.95rem] font-bold leading-snug text-lime whole-words";
const link = "font-semibold text-lime underline decoration-lime/50 decoration-2 underline-offset-4 hover:decoration-lime";

export function ApplicationsIndexPage() {
    const { lang, S, p } = useI18n();
    const s = S.applications;
    useDocumentMeta(s.title, s.description);
    return (
        <>
            <PageHero eyebrow={s.title} title={s.heroTitle} crumbs={[{ label: s.title }]} lead={s.heroLead} />
            <Section tone="teal" testid="applications-intro">
                <Reveal className="max-w-4xl space-y-5 text-lg leading-relaxed text-mist">
                    {s.intro.map((t) => <p key={t}>{t}</p>)}
                </Reveal>
            </Section>
            <Section tone="dark" testid="applications-list">
                <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {getApplications(lang).map((a, i) => (
                        <GlassCard as="li" key={a.id} tone="slate" hover innerClassName="h-full">
                            <Link to={applicationPath(lang, a.id)} className="group flex h-full flex-col p-5 sm:p-6">
                                <span className="font-display text-sm font-bold text-lime">{num(i)}</span>
                                <h2 className="mt-3 font-display text-[clamp(0.8rem,3.4vw,1rem)] font-bold leading-snug text-[#fffffd] whole-words">{a.title}</h2>
                                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{a.short}</p>
                                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-lime">{stripArrow(S.common.learnMore)}<ArrowCircleIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                            </Link>
                        </GlassCard>
                    ))}
                </ul>
                <GlassCard className="mt-12" data-testid="more-applications" innerClassName="bg-plus p-6">
                    <h2 className="font-display text-lg font-bold text-[#fffffd] whole-words">{s.moreTitle}</h2>
                    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {getMoreApplications(lang).map((m) => (
                            <li key={m.title}><p className="font-semibold text-[#fffffd]">{m.title}</p>{m.short && <p className="mt-1 text-sm leading-relaxed text-mist">{m.short}</p>}</li>
                        ))}
                    </ul>
                    <p className="mt-5 text-sm text-mist">{s.moreAdvice} <Link to={p("contact")} className={link}>{s.moreLink}</Link>.</p>
                </GlassCard>
            </Section>
            <Section tone="teal" testid="applications-figures">
                <Reveal><SectionHeading eyebrow={s.figuresEyebrow} title={s.figuresTitle} copy={s.figuresCopy} /></Reveal>
                <div className="mt-10"><StatGrid items={s.figures} wide /></div>
                <p className="mt-6 text-xs text-mist/70">{s.figuresNote}</p>
                <Photo file={APPLICATION_BANNER} alt={s.heroTitle} className="mt-12 w-full rounded-3xl border border-white/10" data-testid="applications-banner" />
            </Section>
            <CtaBand title={s.ctaTitle} text={s.ctaText} />
        </>
    );
}

export function ApplicationPage() {
    const { slug } = useParams();
    const { lang, S, p } = useI18n();
    const s = S.applications;
    const app = getApplication(lang, slug);
    useDocumentMeta(app ? app.title : s.detailEyebrow, app ? app.tagline : "");
    if (!app) return <NotFoundPage />;
    const h2 = "font-display text-[clamp(1.05rem,4.4vw,1.5rem)] font-bold leading-snug text-[#fffffd] whole-words";
    return (
        <>
            <PageHero eyebrow={s.detailEyebrow} title={app.title} crumbs={[{ label: s.title, to: p("applications") }, { label: app.title }]} lead={app.tagline} />
            <Section tone="teal" testid="application-body">
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <p className="text-xl font-semibold leading-relaxed text-[#fffffd]">{app.lead}</p>
                        <h2 className={`mt-12 ${h2}`}>{s.overview}</h2>
                        <div className="mt-4 space-y-5 text-lg leading-relaxed text-mist">{app.overview.map((t) => <p key={t}>{t}</p>)}</div>
                        <h2 className={`mt-12 ${h2}`}>{app.benefitsTitle}</h2>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2" data-testid="benefits">
                            {app.benefits.map((b) => <li key={b} className="rounded-2xl border border-white/10 border-l-4 border-l-lime bg-deep-card px-5 py-4 text-[0.97rem] leading-relaxed text-mist">{b}</li>)}
                        </ul>
                    </div>
                    <aside className="lg:col-span-4">
                        <GlassCard className="lg:sticky lg:top-28" innerClassName="p-5">
                            <h2 className={label}>{s.sidebarTitle}</h2>
                            <ul className="mt-3 divide-y divide-white/10" data-testid="application-sidebar">
                                {getApplications(lang).map((a) => <li key={a.id}><Link to={applicationPath(lang, a.id)} aria-current={a.id === app.id ? "page" : undefined} className={`block py-2.5 text-sm font-semibold transition-colors ${a.id === app.id ? "text-lime" : "text-[#fffffd] hover:text-lime"}`}>{a.title}</Link></li>)}
                            </ul>
                        </GlassCard>
                    </aside>
                </div>
            </Section>
            <Section tone="dark" testid="solutions">
                <Reveal><SectionHeading title={app.solutionsTitle} copy={app.solutionsIntro} /></Reveal>
                <ul className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
                    {app.solutions.map((sol, i) => (
                        <GlassCard as="li" key={sol.t} tone="slate" hover innerClassName="h-full p-5 sm:p-6">
                            {APPLICATION_IMAGES[app.id][i] && <Photo file={APPLICATION_IMAGES[app.id][i]} alt={sol.t} className="mb-5 aspect-video w-full rounded-2xl object-cover" />}
                            <span className="font-display text-sm font-bold text-lime">{num(i)}</span>
                            <h3 className="mt-2 font-display text-[clamp(0.8rem,3.5vw,1.15rem)] font-bold leading-snug text-[#fffffd] whole-words">{sol.t}</h3>
                            <p className="mt-3 text-base leading-relaxed text-mist">{sol.d}</p>
                        </GlassCard>
                    ))}
                </ul>
            </Section>
            <CtaBand title={app.cta.title} text={app.cta.text} label={S.common.inquireNow} />
        </>
    );
}
