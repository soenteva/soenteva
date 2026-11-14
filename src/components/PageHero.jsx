import { Link } from "react-router-dom";
import { Container, Eyebrow } from "@/components/ui";
import { useI18n } from "@/i18n";

export default function PageHero({ eyebrow, title, lead, crumbs = [] }) {
    const { lang, S, p } = useI18n();
    return (
        <section className="relative overflow-hidden bg-navy text-white" data-testid="page-hero">
            <div className="bg-dots absolute inset-0 opacity-70" aria-hidden="true" />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber/10 blur-3xl" aria-hidden="true" />
            <Container className="relative py-16 sm:py-20">
                {crumbs.length > 0 && (
                    <nav aria-label={S.common.breadcrumbs} className="mb-6 text-sm text-navy-200">
                        <ol className="flex flex-wrap items-center gap-2">
                            <li><Link to={p("home")} className="hover:text-amber">{S.common.crumbHome}</Link></li>
                            {crumbs.map((c) => (
                                <li key={c.label} className="flex items-center gap-2"><span aria-hidden="true">/</span>{c.to ? <Link to={c.to} className="hover:text-amber">{c.label}</Link> : <span className="text-white">{c.label}</span>}</li>
                            ))}
                        </ol>
                    </nav>
                )}
                {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
                <h1 className={`${lang === "de" ? "hyphens-auto " : ""}max-w-4xl text-[2rem] font-extrabold leading-tight tracking-tight sm:text-5xl`}>{title}</h1>
                {lead && <p className="mt-6 max-w-3xl text-lg leading-relaxed text-navy-200">{lead}</p>}
            </Container>
        </section>
    );
}
