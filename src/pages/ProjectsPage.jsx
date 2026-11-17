import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import GlassCard from "@/components/GlassCard";
import Photo from "@/components/Photo";
import { ArrowLink } from "@/components/PillButton";
import Section from "@/components/Section";
import { getApplicationById, applicationPath } from "@/data/applications";
import { PROJECT_IMAGES } from "@/data/images";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function ProjectsPage() {
    const { lang, S } = useI18n();
    const pr = S.projects;
    useDocumentMeta(pr.title, pr.description);
    return (
        <>
            <PageHero eyebrow={pr.title} title={pr.heroTitle} crumbs={[{ label: pr.title }]} lead={pr.heroLead} />
            <Section tone="teal" testid="projects">
                <ul className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
                    {pr.items.map((item, i) => {
                        const app = item.application ? getApplicationById(lang, item.application) : null;
                        return (
                            <GlassCard as="li" key={item.title} hover data-testid="project-card" innerClassName="flex h-full flex-col">
                                <div className="relative">
                                    <Photo file={PROJECT_IMAGES[i]} alt={item.title} className="aspect-[16/9] w-full object-cover" />
                                    <span className="absolute bottom-3 left-5 font-display text-4xl font-bold text-lime [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                                </div>
                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <h2 className="font-display text-[clamp(0.8rem,3.4vw,1.3rem)] font-bold leading-snug text-[#fffffd] whole-words">{item.title}</h2>
                                    {app && <ArrowLink to={applicationPath(lang, app.id)} className="mt-5">{pr.toApplication} {app.title}</ArrowLink>}
                                </div>
                            </GlassCard>
                        );
                    })}
                </ul>
            </Section>
            <CtaBand title={pr.ctaTitle} text={pr.ctaText} />
        </>
    );
}
