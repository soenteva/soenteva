import CtaBand from "@/components/CtaBand";
import DisplayHeading from "@/components/DisplayHeading";
import HeroSlider from "@/components/HeroSlider";
import IconRow from "@/components/IconRow";
import ImageCard from "@/components/ImageCard";
import LogoBand from "@/components/LogoBand";
import PhotoSlides from "@/components/PhotoSlides";
import PillButton, { stripArrow } from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SplitBlock from "@/components/SplitBlock";
import TabbedSection from "@/components/TabbedSection";
import { WHY_ICONS } from "@/components/icons";
import { applicationPath, getApplicationById, getApplications, getMoreApplications } from "@/data/applications";
import { HOME_BLOCK_IMAGES, HOME_CARD_IMAGES, HOME_HERO_IMAGES, HOME_SLIDE_IMAGES } from "@/data/home";
import { APPLICATION_IMAGES, CLIENT_LOGOS, INDUSTRY_IMAGES, PROJECT_IMAGES } from "@/data/images";
import { getIndustries, industryPath } from "@/data/industries";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

const body = "text-base leading-relaxed text-mist";

export default function HomePage() {
    const { lang, S, p } = useI18n();
    const h = S.home;
    const learnMore = stripArrow(S.common.learnMore);
    const recognized = S.whyUs[S.whyUs.length - 1]; // "Recognized quality": the FANUC awards
    useDocumentMeta("", h.description);

    // 1. Hero slider
    const heroSlides = [
        {
            key: "intro", label: h.heroTitle.join(""), image: HOME_HERO_IMAGES[0],
            children: (
                <>
                    <DisplayHeading as="h1" parts={h.heroTitle} size="hero" testid="hero-title" />
                    <div className="mt-8 flex flex-wrap gap-4">
                        <PillButton to={p("contact")} data-testid="hero-contact">{h.ctaContact}</PillButton>
                        <PillButton to={p("applications")} variant="ghost" arrow={false}>{h.ctaApplications}</PillButton>
                    </div>
                    <p className={`mt-8 max-w-[28rem] ${body}`}>{h.heroLead}</p>
                </>
            ),
        },
        {
            key: "process", label: h.processTitle, image: HOME_HERO_IMAGES[1],
            children: (
                <>
                    <DisplayHeading as="h2" title={h.processTitle} size="hero" />
                    <p className={`mt-6 max-w-[28rem] ${body}`}>{h.processCopy}</p>
                    <div className="mt-8"><PillButton to={p("contact")}>{S.common.inquiry}</PillButton></div>
                </>
            ),
        },
        {
            key: "more", label: h.moreTitle, image: HOME_HERO_IMAGES[2],
            children: (
                <>
                    <DisplayHeading as="h2" title={h.moreTitle} size="hero" />
                    <p className={`mt-6 max-w-[28rem] ${body}`}>{getMoreApplications(lang).map((m) => m.title).join(", ")}.</p>
                    <div className="mt-8"><PillButton to={p("contact")}>{stripArrow(h.moreCta)}</PillButton></div>
                </>
            ),
        },
    ];

    // 2. Tabs: applications, industries, projects
    const tabs = [
        {
            id: "applications", label: S.nav.items.applications, more: { to: p("applications"), label: S.nav.allApplications },
            items: getApplications(lang).map((a) => ({ key: a.id, title: a.title, text: a.short, to: applicationPath(lang, a.id), linkLabel: learnMore, image: APPLICATION_IMAGES[a.id][0], alt: a.title })),
        },
        {
            id: "industries", label: S.nav.items.industries, more: { to: p("industries"), label: S.nav.allIndustries },
            items: getIndustries(lang).map((i) => ({ key: i.id, title: i.title, text: i.short, to: industryPath(lang, i.id), linkLabel: learnMore, image: INDUSTRY_IMAGES[i.id].photos[0], alt: i.title })),
        },
        {
            id: "projects", label: S.nav.items.projects, more: { to: p("projects"), label: S.nav.items.projects },
            items: S.projects.items.map((item, i) => {
                const app = item.application ? getApplicationById(lang, item.application) : null;
                return { key: `project-${i}`, title: item.title, text: "", to: app ? applicationPath(lang, app.id) : "", linkLabel: app ? `${S.projects.toApplication} ${app.title}` : "", image: PROJECT_IMAGES[i], alt: item.title };
            }),
        },
    ];

    // 3. Photo slides with the dark panel
    const photoSlides = [
        {
            key: "industries", label: h.industriesTitle, image: HOME_SLIDE_IMAGES.industries, side: "left",
            children: (
                <>
                    <DisplayHeading as="h2" title={h.industriesTitle} size="lg" />
                    <p className={`mt-5 ${body}`}>{h.industriesCopy}</p>
                    <div className="mt-7"><PillButton to={p("industries")}>{S.nav.allIndustries}</PillButton></div>
                </>
            ),
        },
        {
            key: "awards", label: recognized.t, image: HOME_SLIDE_IMAGES.awards, side: "right",
            children: (
                <>
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-lime">{S.company.awardsTitle}</p>
                    <DisplayHeading as="h2" title={recognized.t} size="lg" />
                    <p className={`mt-5 ${body}`}>{recognized.d}</p>
                    <div className="mt-7"><PillButton to={p("company")}>{h.introMore}</PillButton></div>
                </>
            ),
        },
        {
            key: "stats", label: h.statsNote, image: HOME_SLIDE_IMAGES.stats, side: "left",
            children: (
                <>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-8" data-testid="stats">
                        {S.stats.map((s) => (
                            <div key={s.label} className="flex flex-col">
                                <dd className="order-1 font-display text-[1.75rem] font-bold leading-[1.2] text-[#fffffd] sm:text-4xl">{s.value}</dd>
                                <dt className="order-2 mt-2 text-sm font-medium text-lime sm:text-base">{s.label}</dt>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-8 text-xs text-mist/70">{h.statsNote}</p>
                </>
            ),
        },
    ];

    // 5. Cards: company, projects, career
    const cards = [
        { key: "company", image: HOME_CARD_IMAGES.company, title: S.company.title, text: S.company.heroLead, to: p("company") },
        { key: "projects", image: HOME_CARD_IMAGES.projects, title: S.projects.title, text: S.projects.heroLead, to: p("projects") },
        { key: "career", image: HOME_CARD_IMAGES.career, title: S.career.title, text: S.career.heroLead, to: p("career") },
    ];

    return (
        <>
            <HeroSlider slides={heroSlides} />

            <Section tone="teal" testid="tabs">
                <Reveal className="mb-10 max-w-3xl">
                    <DisplayHeading title={h.appsTitle} />
                    <p className={`mt-5 ${body}`}>{h.appsCopy}</p>
                </Reveal>
                <TabbedSection tabs={tabs} testid="home-tabs" />
            </Section>

            <PhotoSlides slides={photoSlides} />

            <SplitBlock image={HOME_BLOCK_IMAGES.about} alt={h.introTitle} imageTestid="intro-photo" testid="intro" tone="teal">
                <DisplayHeading title={h.introTitle} />
                <div className="mt-6 space-y-4">{h.introText.map((t) => <p key={t} className={body}>{t}</p>)}</div>
                <PillButton to={p("company")} className="mt-8">{h.introMore}</PillButton>
            </SplitBlock>

            <SplitBlock image={HOME_BLOCK_IMAGES.why} alt={h.whyTitle} imageSide="right" tone="dark" testid="why-us">
                <DisplayHeading title={h.whyTitle} />
                <ul className="mt-8 space-y-4">
                    {S.whyUs.map((w, i) => <IconRow key={w.t} icon={WHY_ICONS[i]} title={w.t}>{w.d}</IconRow>)}
                </ul>
            </SplitBlock>

            <SplitBlock image={HOME_BLOCK_IMAGES.vision} alt={S.company.visionTitle} tone="teal" testid="vision">
                <div className="space-y-10">
                    {[[S.company.visionTitle, S.company.visionText], [S.company.missionTitle, S.company.missionText]].map(([title, text]) => (
                        <div key={title}>
                            <DisplayHeading title={title} size="lg" />
                            <p className={`mt-4 ${body}`}>{text}</p>
                        </div>
                    ))}
                </div>
            </SplitBlock>

            <Section tone="dark" testid="cards">
                <ul className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-3">
                    {cards.map((c) => <ImageCard key={c.key} image={c.image} alt={c.title} title={c.title} text={c.text} to={c.to} linkLabel={learnMore} />)}
                </ul>
            </Section>

            <Section tone="teal" pad="md" testid="references-band">
                <div data-testid="references">
                    <DisplayHeading title={h.referencesTitle} size="sm" className="mb-5" />
                    <LogoBand logos={CLIENT_LOGOS} />
                </div>
            </Section>

            <CtaBand title={h.ctaTitle} text={h.ctaText} />
        </>
    );
}
