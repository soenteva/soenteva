import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import { Container, SectionHeading } from "@/components/ui";
import { COMPANY } from "@/data/site";
import { AWARD_IMAGES, COMPANY_IMAGES } from "@/data/images";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function CompanyPage() {
    const { S } = useI18n();
    const c = S.company;
    useDocumentMeta(c.title, c.description);
    return (
        <>
            <PageHero eyebrow={c.title} title={c.heroTitle} crumbs={[{ label: c.title }]} lead={c.heroLead} />

            <section className="py-20" data-testid="about">
                <Container className="grid gap-12 lg:grid-cols-12">
                    <div className="space-y-5 text-lg leading-relaxed lg:col-span-8">
                        {c.about.map((t) => <p key={t}>{t}</p>)}
                    </div>
                    <aside className="lg:col-span-4">
                        <div className="rounded-xl border border-slate-200 bg-navy-50 p-7" data-testid="company-facts">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">{c.factsTitle}</h2>
                            <dl className="mt-5 space-y-4 text-sm">
                                <div><dt className="font-bold text-navy">{c.factCompany}</dt><dd>{COMPANY.name}, {COMPANY.city}</dd></div>
                                <div><dt className="font-bold text-navy">{c.factGroup}</dt><dd>{COMPANY.groupName}, {c.factGroupValue}</dd></div>
                                <div><dt className="font-bold text-navy">{c.factCustomers}</dt><dd>{c.factCustomersValue}</dd></div>
                            </dl>
                        </div>
                        <Photo file={COMPANY_IMAGES.team} alt={c.heroTitle} className="mt-6 w-full rounded-xl" data-testid="company-photo" />
                    </aside>
                </Container>
            </section>

            <section className="bg-navy py-20 text-white" data-testid="vision">
                <Container className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {[[c.goalTitle, c.goalText], [c.visionTitle, c.visionText], [c.missionTitle, c.missionText], [c.qualityTitle, c.qualityText]].map(([h, t]) => (
                        <div key={h}><h2 className="text-sm font-bold uppercase tracking-[0.2em] text-amber">{h}</h2><p className="mt-4 leading-relaxed text-navy-200">{t}</p></div>
                    ))}
                </Container>
            </section>

            <section className="py-20" data-testid="goals">
                <Container>
                    <SectionHeading eyebrow={c.goalsEyebrow} title={c.goalsTitle} />
                    <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {S.goals.map((g, i) => (
                            <li key={g} className="flex gap-4 rounded-lg border border-slate-200 px-5 py-4"><span className="font-extrabold text-amber-600">{String(i + 1).padStart(2, "0")}</span><span className="font-semibold text-navy">{g}</span></li>
                        ))}
                    </ul>
                </Container>
            </section>

            <section className="bg-navy-50 py-20" data-testid="values">
                <Container>
                    <SectionHeading eyebrow={c.valuesEyebrow} title={c.valuesTitle} />
                    <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
                        <Photo file={COMPANY_IMAGES.values} alt={c.valuesTitle} className="w-full rounded-xl lg:col-span-4" data-testid="values-photo" />
                        <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:col-span-8">
                            {S.values.map((v) => (
                                <li key={v.t} className="border-t-4 border-amber pt-5"><h3 className="text-lg font-bold text-navy">{v.t}</h3><p className="mt-2 leading-relaxed">{v.d}</p></li>
                            ))}
                        </ul>
                    </div>
                </Container>
            </section>

            <section className="py-20" data-testid="why">
                <Container>
                    <SectionHeading eyebrow={c.whyEyebrow} title={c.whyTitle} />
                    <ul className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                        {S.whyUs.map((w) => (
                            <li key={w.t} className="border-t-4 border-navy pt-5"><h3 className="text-lg font-bold text-navy">{w.t}</h3><p className="mt-2 leading-relaxed">{w.d}</p></li>
                        ))}
                    </ul>
                </Container>
            </section>

            <section className="bg-navy-50 py-20" data-testid="awards">
                <Container>
                    <SectionHeading title={c.awardsTitle} />
                    <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {AWARD_IMAGES.map((file) => (
                            <li key={file} className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                                <Photo file={file} alt={c.awardsTitle} className="h-full w-full object-contain" />
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <CtaBand title={c.ctaTitle} text={c.ctaText} />
        </>
    );
}
