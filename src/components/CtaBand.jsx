import { Container, ButtonLink } from "@/components/ui";
import { useI18n } from "@/i18n";

export default function CtaBand({ title, text, label, to }) {
    const { S, p } = useI18n();
    return (
        <section className="bg-amber" data-testid="cta-band">
            <Container className="flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-extrabold leading-tight text-navy-900 sm:text-3xl">{title}</h2>
                    {text && <p className="mt-3 text-base leading-relaxed text-navy-800">{text}</p>}
                </div>
                <ButtonLink to={to || p("contact")} variant="dark" className="shrink-0">{label || S.common.inquiry}</ButtonLink>
            </Container>
        </section>
    );
}
