import { Link } from "react-router-dom";
import RobotArt from "@/components/RobotArt";
import CtaBand from "@/components/CtaBand";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { getApplications, getMoreApplications, applicationPath } from "@/data/applications";
import { getIndustries, industryPath } from "@/data/industries";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

const num = (i) => String(i + 1).padStart(2, "0");

export default function HomePage() {
    const { lang, S, p } = useI18n();
    const h = S.home;
    useDocumentMeta("", h.description);
    return (
        <>
            <section className="relative overflow-hidden bg-navy text-white" data-testid="hero">
                <div className="bg-dots absolute inset-0" aria-hidden="true" />
                <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-amber/10 blur-3xl" aria-hidden="true" />
                <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
                    <div className="animate-rise">
                        <p className="mb-5 inline-block rounded-full border border-amber/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber">{h.badge}</p>
                        <h1 className={`${lang === "de" ? "hyphens-auto " : ""}text-[2.05rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[2.6rem] xl:hyphens-none xl:text-[3.4rem]`} data-testid="hero-title">
                            {h.heroTitle[0]}<span className="text-amber">{h.heroTitle[1]}</span>{h.heroTitle[2]}
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200">{h.heroLead}</p>
                        <div className="mt-9 flex flex-wrap gap-4">
                            <ButtonLink to={p("contact")} data-testid="hero-contact">{h.ctaContact}</ButtonLink>
                            <ButtonLink to={p("applications")} variant="ghost">{h.ctaApplications}</ButtonLink>
                        </div>
                    </div>
                    <div className="relative mx-auto w-full max-w-xl">
                        <div className="absolute inset-6 rounded-3xl border border-white/10 bg-navy-700/60" aria-hidden="true" />
                        <RobotArt className="relative w-full" />
                    </div>
                </Container>
            </section>

            <section className="border-b border-slate-200 bg-white" data-testid="stats">
                <Container className="py-10">
                    <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                        {S.stats.map((s) => (
                            <div key={s.label} className="border-l-4 border-amber pl-5">
                                <dt className="sr-only">{s.label}</dt>
                                <dd className="text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">{s.value}</dd>
                                <p className="mt-1 text-sm font-semibold text-slate-500">{s.label}</p>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-6 text-xs text-slate-400">{h.statsNote}</p>
                </Container>
            </section>

            <section className="py-20 lg:py-28" data-testid="intro">
                <Container className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <SectionHeading eyebrow={h.introEyebrow} title={h.introTitle} />
                        <ButtonLink to={p("company")} variant="dark" className="mt-8">{h.introMore}</ButtonLink>
                    </div>
                    <div className="space-y-5 text-lg leading-relaxed lg:col-span-7">
                        {h.introText.map((t) => <p key={t}>{t}</p>)}
                    </div>
                </Container>
            </section>

            <section className="bg-navy-50 py-20 lg:py-28" data-testid="applications">
                <Container>
                    <SectionHeading eyebrow={h.appsEyebrow} title={h.appsTitle} copy={h.appsCopy} />
                    <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
                        {getApplications(lang).map((a, i) => (
                            <li key={a.id} className="bg-white">
                                <Link to={applicationPath(lang, a.id)} className="group flex h-full flex-col p-7 transition-colors hover:bg-navy">
                                    <span className="text-sm font-extrabold tracking-widest text-amber-600 group-hover:text-amber">{num(i)}</span>
                                    <h3 className="mt-3 text-xl font-bold text-navy group-hover:text-white">{a.title}</h3>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 group-hover:text-navy-200">{a.short}</p>
                                    <span className="mt-5 text-sm font-bold text-navy group-hover:text-amber">{S.common.learnMore}</span>
                                </Link>
                            </li>
                        ))}
                        <li className="bg-navy sm:col-span-2" data-testid="more-applications">
                            <Link to={p("contact")} className="flex h-full flex-col justify-center p-7 text-white">
                                <h3 className="text-xl font-bold">{h.moreTitle}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-navy-200">{getMoreApplications(lang).map((m) => m.title).join(", ")}.</p>
                                <span className="mt-5 text-sm font-bold text-amber">{h.moreCta}</span>
                            </Link>
                        </li>
                    </ul>
                </Container>
            </section>

            <section className="relative overflow-hidden bg-navy py-20 text-white lg:py-28" data-testid="industries">
                <div className="bg-dots absolute inset-0 opacity-60" aria-hidden="true" />
                <Container className="relative">
                    <SectionHeading light eyebrow={h.industriesEyebrow} title={h.industriesTitle} copy={h.industriesCopy} />
                    <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {getIndustries(lang).map((i) => (
                            <li key={i.id}>
                                <Link to={industryPath(lang, i.id)} className="block h-full rounded-lg border border-white/15 bg-white/5 px-5 py-4 font-bold transition-colors hover:border-amber hover:bg-amber hover:text-navy-900">{i.title}</Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <section className="py-20 lg:py-28" data-testid="process">
                <Container>
                    <SectionHeading eyebrow={h.processEyebrow} title={h.processTitle} copy={h.processCopy} />
                    <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {S.process.map((pr, i) => (
                            <li key={pr.t} className="relative rounded-xl border border-slate-200 p-7">
                                <span className="text-5xl font-extrabold text-amber/80">{i + 1}</span>
                                <h3 className="mt-4 text-lg font-bold text-navy">{pr.t}</h3>
                                <p className="mt-2 text-sm leading-relaxed">{pr.d}</p>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>

            <section className="bg-navy-50 py-20 lg:py-28" data-testid="why-us">
                <Container>
                    <SectionHeading eyebrow={h.whyEyebrow} title={h.whyTitle} />
                    <ul className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                        {S.whyUs.map((w) => (
                            <li key={w.t} className="border-t-4 border-navy pt-5">
                                <h3 className="text-lg font-bold text-navy">{w.t}</h3>
                                <p className="mt-2 leading-relaxed">{w.d}</p>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <CtaBand title={h.ctaTitle} text={h.ctaText} />
        </>
    );
}
