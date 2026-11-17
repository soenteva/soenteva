import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { Ph } from "@/components/ui";
import { COMPANY } from "@/data/site";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

const Draft = ({ text }) => (
    <p className="mb-10 rounded-2xl border border-lime/30 border-l-4 border-l-lime bg-lime/10 px-5 py-4 text-sm font-semibold text-[#fffffd]" data-testid="legal-draft">{text}</p>
);
const H = ({ children }) => <h2 className="mt-10 font-display text-[clamp(0.95rem,4vw,1.25rem)] font-bold leading-snug text-[#fffffd] whole-words">{children}</h2>;
const P = ({ children }) => <p className="mt-3 leading-relaxed text-mist">{children}</p>;
const linkCls = "font-semibold text-lime underline decoration-lime/50 decoration-2 underline-offset-4 hover:decoration-lime";

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
            <Section tone="teal" pad="md" testid="impressum">
                <div className="max-w-3xl">
                    <Draft text={l.draft} />
                    <H>{i.h.info}</H>
                    <P><strong className="text-[#fffffd]">{COMPANY.name}</strong><br />{COMPANY.streetFromRegister}<br />{COMPANY.city}</P>
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
                </div>
            </Section>
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
            <Section tone="teal" pad="md" testid="datenschutz">
                <div className="max-w-3xl">
                    <Draft text={l.draft} />
                    {v.sections.map((sec) => (
                        <div key={sec.h}>
                            <H>{sec.h}</H>
                            <P><Parts parts={sec.parts} /></P>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    );
}
