import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { Container, Ph } from "@/components/ui";
import { COMPANY } from "@/data/site";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

const Draft = ({ text }) => (
    <p className="mb-10 rounded-lg border-l-4 border-amber bg-amber-100 px-5 py-4 text-sm font-semibold text-navy-900" data-testid="legal-draft">{text}</p>
);
const H = ({ children }) => <h2 className="mt-10 text-xl font-extrabold text-navy">{children}</h2>;
const P = ({ children }) => <p className="mt-3 leading-relaxed">{children}</p>;
const linkCls = "font-bold text-navy underline decoration-amber decoration-2 underline-offset-4";

const COMPANY_FIELDS = { name: COMPANY.name, street: COMPANY.streetFromRegister, city: COMPANY.city, email: COMPANY.email };

// Renders the parts of a privacy section: text, placeholder, company value or link.
function Parts({ parts }) {
    const { S, p } = useI18n();
    return parts.map((part, i) => {
        if (typeof part === "string") return <span key={i}>{part}</span>;
        if (part.ph) return <Ph key={i} text={S.legal.ph[part.ph]} />;
        if (part.co) return <Ph key={i} value={COMPANY_FIELDS[part.co]} />;
        return <Link key={i} to={p(part.link)} className={linkCls}>{part.text}</Link>;
    });
}

export function ImpressumPage() {
    const { S } = useI18n();
    const l = S.legal;
    const i = l.imprint;
    useDocumentMeta(i.title, i.description);
    return (
        <>
            <PageHero eyebrow={S.common.legalEyebrow} title={i.title} crumbs={[{ label: i.title }]} />
            <section className="py-16" data-testid="impressum">
                <Container className="max-w-3xl">
                    <Draft text={l.draft} />
                    <H>{i.h.info}</H>
                    <P><strong className="text-navy">{COMPANY.name}</strong><br />{COMPANY.streetFromRegister}<br />{COMPANY.city}</P>
                    <H>{i.h.represented}</H>
                    <P>{i.managing} <Ph value={COMPANY.managingDirector} /></P>
                    <H>{i.h.register}</H>
                    <P>{i.registerText}<br />{i.registerCourt} {COMPANY.register}</P>
                    <H>{i.h.vat}</H>
                    <P>{i.vatText} <Ph value={COMPANY.vatId} /></P>
                    <H>{i.h.contact}</H>
                    <P>{i.phone} <Ph value={COMPANY.phone} /><br />{i.email} <Ph value={COMPANY.email} /></P>
                    <H>{i.h.responsible}</H>
                    <P><Ph text={l.ph.responsible} /></P>
                    <H>{i.h.disputes}</H>
                    <P><Ph text={l.ph.disputes} /></P>
                </Container>
            </section>
        </>
    );
}

export function PrivacyPage() {
    const { S } = useI18n();
    const l = S.legal;
    const v = l.privacy;
    useDocumentMeta(v.title, v.description);
    return (
        <>
            <PageHero eyebrow={S.common.legalEyebrow} title={v.heroTitle} crumbs={[{ label: v.title }]} />
            <section className="py-16" data-testid="datenschutz">
                <Container className="max-w-3xl">
                    <Draft text={l.draft} />
                    {v.sections.map((sec) => (
                        <div key={sec.h}>
                            <H>{sec.h}</H>
                            <P><Parts parts={sec.parts} /></P>
                        </div>
                    ))}
                </Container>
            </section>
        </>
    );
}
