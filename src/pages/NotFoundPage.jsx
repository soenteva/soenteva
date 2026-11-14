import PageHero from "@/components/PageHero";
import { ButtonLink, Container } from "@/components/ui";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function NotFoundPage() {
    const { S, p } = useI18n();
    const n = S.notFound;
    useDocumentMeta(n.title, "");
    return (
        <>
            <PageHero eyebrow={n.eyebrow} title={n.heroTitle} lead={n.heroLead} />
            <section className="py-20" data-testid="not-found">
                <Container><ButtonLink to={p("home")} variant="dark">{n.home}</ButtonLink></Container>
            </section>
        </>
    );
}
