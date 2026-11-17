import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { ButtonLink } from "@/components/ui";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function NotFoundPage() {
    const { S, p } = useI18n();
    const n = S.notFound;
    useDocumentMeta(n.title, "");
    return (
        <>
            <PageHero eyebrow={n.eyebrow} title={n.heroTitle} lead={n.heroLead} />
            <Section tone="teal" pad="md" testid="not-found">
                <ButtonLink to={p("home")}>{n.home}</ButtonLink>
            </Section>
        </>
    );
}
