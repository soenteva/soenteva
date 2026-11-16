import { Link, useParams } from "react-router-dom";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import { Container, SectionHeading } from "@/components/ui";
import { getApplications, getApplication, getMoreApplications, applicationPath } from "@/data/applications";
import { APPLICATION_BANNER, APPLICATION_IMAGES } from "@/data/images";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import NotFoundPage from "@/pages/NotFoundPage";

const num = (i) => String(i + 1).padStart(2, "0");

export function ApplicationsIndexPage() {
    const { lang, S, p } = useI18n();
    const s = S.applications;
    useDocumentMeta(s.title, s.description);
    return (
        <>
            <PageHero eyebrow={s.title} title={s.heroTitle} crumbs={[{ label: s.title }]} lead={s.heroLead} />
            <section className="py-20" data-testid="applications-intro">
                <Container className="max-w-4xl space-y-5 text-lg leading-relaxed">
                    {s.intro.map((t) => <p key={t}>{t}</p>)}
                </Container>
            </section>
            <section className="bg-navy-50 py-20" data-testid="applications-list">
                <Container>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {getApplications(lang).map((a, i) => (
                            <li key={a.id}>
                                <Link to={applicationPath(lang, a.id)} className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:border-navy hover:shadow-lg">
                                    <span className="text-sm font-extrabold tracking-widest text-amber-600">{num(i)}</span>
                                    <h2 className="mt-2 text-xl font-bold text-navy">{a.title}</h2>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed">{a.short}</p>
                                    <span className="mt-5 text-sm font-bold text-navy group-hover:text-amber-600">{S.common.learnMore}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-12 rounded-xl border border-slate-200 bg-white p-7" data-testid="more-applications">
                        <h2 className="text-lg font-bold text-navy">{s.moreTitle}</h2>
                        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {getMoreApplications(lang).map((m) => (
                                <li key={m.title}><p className="font-bold text-navy">{m.title}</p>{m.short && <p className="mt-1 text-sm leading-relaxed">{m.short}</p>}</li>
                            ))}
                        </ul>
                        <p className="mt-5 text-sm">{s.moreAdvice} <Link to={p("contact")} className="font-bold text-navy underline decoration-amber decoration-2 underline-offset-4">{s.moreLink}</Link>.</p>
                    </div>
                </Container>
            </section>
            <section className="py-20" data-testid="applications-figures">
                <Container>
                    <SectionHeading eyebrow={s.figuresEyebrow} title={s.figuresTitle} copy={s.figuresCopy} />
                    <dl className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
                        {s.figures.map((f) => (
                            <div key={f.label} className="border-l-4 border-amber pl-5"><dd className="text-3xl font-extrabold text-navy sm:text-4xl">{f.value}</dd><dt className="mt-1 text-sm font-semibold text-slate-500">{f.label}</dt></div>
                        ))}
                    </dl>
                    <p className="mt-6 text-xs text-slate-400">{s.figuresNote}</p>
                    <Photo file={APPLICATION_BANNER} alt={s.heroTitle} className="mt-12 w-full rounded-xl" data-testid="applications-banner" />
                </Container>
            </section>
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
    return (
        <>
            <PageHero eyebrow={s.detailEyebrow} title={app.title} crumbs={[{ label: s.title, to: p("applications") }, { label: app.title }]} lead={app.tagline} />
            <section className="py-20" data-testid="application-body">
                <Container className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <p className="text-xl font-semibold leading-relaxed text-navy">{app.lead}</p>
                        <h2 className="mt-12 text-2xl font-extrabold text-navy">{s.overview}</h2>
                        <div className="mt-4 space-y-5 text-lg leading-relaxed">{app.overview.map((t) => <p key={t}>{t}</p>)}</div>
                        <h2 className="mt-12 text-2xl font-extrabold text-navy">{app.benefitsTitle}</h2>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2" data-testid="benefits">
                            {app.benefits.map((b) => <li key={b} className="rounded-lg border-l-4 border-amber bg-navy-50 px-5 py-4 text-[0.97rem] leading-relaxed">{b}</li>)}
                        </ul>
                    </div>
                    <aside className="lg:col-span-4">
                        <div className="rounded-xl border border-slate-200 p-6 lg:sticky lg:top-28">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">{s.sidebarTitle}</h2>
                            <ul className="mt-3 divide-y divide-slate-100" data-testid="application-sidebar">
                                {getApplications(lang).map((a) => <li key={a.id}><Link to={applicationPath(lang, a.id)} aria-current={a.id === app.id ? "page" : undefined} className={`block py-2.5 text-sm font-semibold ${a.id === app.id ? "text-amber-600" : "text-navy hover:text-amber-600"}`}>{a.title}</Link></li>)}
                            </ul>
                        </div>
                    </aside>
                </Container>
            </section>
            <section className="relative overflow-hidden bg-navy py-20 text-white" data-testid="solutions">
                <div className="bg-dots absolute inset-0 opacity-60" aria-hidden="true" />
                <Container className="relative">
                    <SectionHeading light title={app.solutionsTitle} copy={app.solutionsIntro} />
                    <ul className="mt-12 grid gap-5 md:grid-cols-2">
                        {app.solutions.map((sol, i) => (
                            <li key={sol.t} className="rounded-xl border border-white/15 bg-white/5 p-7">
                                {APPLICATION_IMAGES[app.id][i] && <Photo file={APPLICATION_IMAGES[app.id][i]} alt={sol.t} className="mb-5 aspect-video w-full rounded-lg object-cover" />}
                                <span className="text-sm font-extrabold tracking-widest text-amber">{num(i)}</span>
                                <h3 className="mt-2 text-xl font-bold">{sol.t}</h3>
                                <p className="mt-2 leading-relaxed text-navy-200">{sol.d}</p>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>
            <CtaBand title={app.cta.title} text={app.cta.text} label={S.common.inquireNow} />
        </>
    );
}
