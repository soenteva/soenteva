import { Link } from "react-router-dom";
import DisplayHeading from "@/components/DisplayHeading";
import Section from "@/components/Section";
import { Eyebrow } from "@/components/ui";
import { useI18n } from "@/i18n";

// Top band of every inner page: breadcrumb, small lime label, display title, lead text.
export default function PageHero({ eyebrow, title, lead, crumbs = [] }) {
    const { S, p } = useI18n();
    return (
        <Section tone="hero" pad="none" divider={false} className="py-14 sm:py-20 lg:py-24" testid="page-hero">
            {crumbs.length > 0 && (
                <nav aria-label={S.common.breadcrumbs} className="mb-6 text-sm text-mist">
                    <ol className="flex flex-wrap items-center gap-2">
                        <li><Link to={p("home")} className="hover:text-lime">{S.common.crumbHome}</Link></li>
                        {crumbs.map((c) => (
                            <li key={c.label} className="flex items-center gap-2"><span aria-hidden="true">/</span>{c.to ? <Link to={c.to} className="hover:text-lime">{c.label}</Link> : <span className="text-[#fffffd]">{c.label}</span>}</li>
                        ))}
                    </ol>
                </nav>
            )}
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <DisplayHeading as="h1" title={title} size="page" className="max-w-5xl" />
            {lead && <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mist">{lead}</p>}
        </Section>
    );
}
