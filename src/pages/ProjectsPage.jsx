import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import { Container } from "@/components/ui";
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
            <section className="py-20" data-testid="projects">
                <Container>
                    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pr.items.map((item, i) => {
                            const app = item.application ? getApplicationById(lang, item.application) : null;
                            return (
                                <li key={item.title} className="flex flex-col overflow-hidden rounded-xl border border-slate-200" data-testid="project-card">
                                    <div className="relative h-48 overflow-hidden bg-navy">
                                        <Photo file={PROJECT_IMAGES[i]} alt={item.title} className="h-full w-full object-cover" />
                                        <span className="absolute bottom-3 left-5 text-6xl font-extrabold text-amber [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                                    </div>
                                    <div className="flex flex-1 flex-col p-7">
                                        <h2 className="text-xl font-bold text-navy">{item.title}</h2>
                                        {app && <Link to={applicationPath(lang, app.id)} className="mt-5 text-sm font-bold text-navy underline decoration-amber decoration-2 underline-offset-4">{pr.toApplication} {app.title}</Link>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </Container>
            </section>
            <CtaBand title={pr.ctaTitle} text={pr.ctaText} />
        </>
    );
}
