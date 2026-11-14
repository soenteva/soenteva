import PageHero from "@/components/PageHero";
import { Container, SectionHeading, Ph } from "@/components/ui";
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
            <section className="py-20" data-testid="career-intro">
                <Container className="max-w-4xl space-y-5 text-lg leading-relaxed">
                    {c.intro.map((t) => <p key={t}>{t}</p>)}
                </Container>
            </section>
            <section className="bg-navy-50 py-20" data-testid="rewards">
                <Container>
                    <SectionHeading eyebrow={c.rewardsEyebrow} title={c.rewardsTitle} />
                    <ul className="mt-10 grid gap-6 md:grid-cols-3">
                        {c.rewards.map((r) => <li key={r.t} className="border-t-4 border-amber bg-white p-7"><h3 className="text-lg font-bold text-navy">{r.t}</h3><p className="mt-2 leading-relaxed">{r.d}</p></li>)}
                    </ul>
                </Container>
            </section>
            <section className="py-20" data-testid="open-application">
                <Container className="max-w-4xl">
                    <SectionHeading title={c.applyTitle} copy={c.applyCopy} />
                    <p className="mt-6 text-lg">{c.applyTo} <span className="font-bold text-navy"><Ph value={COMPANY.email} /></span></p>
                </Container>
            </section>
        </>
    );
}
