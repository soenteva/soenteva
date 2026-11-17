import { BentoColumn, BentoGrid } from "@/components/BentoGrid";
import DisplayHeading from "@/components/DisplayHeading";
import GlassCard from "@/components/GlassCard";
import GlassCtaBand from "@/components/GlassCtaBand";
import IconRow from "@/components/IconRow";
import LogoBand from "@/components/LogoBand";
import Photo from "@/components/Photo";
import PillButton, { ArrowLink, stripArrow } from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SplitImageSection from "@/components/SplitImageSection";
import StatBand from "@/components/StatBand";
import { AwardIcon, BoltIcon, EyeIcon, FactoryIcon, FlagIcon, GearIcon, RobotIcon, TargetIcon, WrenchIcon } from "@/components/icons";
import { applicationPath, getApplicationById, getMoreApplications } from "@/data/applications";
import { HOME_AWARD_IMAGES, HOME_FEATURED_APPLICATIONS, HOME_HERO_IMAGE, HOME_INDUSTRIES, HOME_PROCESS_IMAGES, HOME_PROMO_IMAGE } from "@/data/home";
import { CLIENT_LOGOS, COMPANY_IMAGES, INDUSTRY_IMAGES } from "@/data/images";
import { getIndustryById, industryPath } from "@/data/industries";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

const FEATURE_ICONS = [RobotIcon, FactoryIcon, GearIcon];
const WHY_ICONS = [RobotIcon, TargetIcon, FlagIcon, BoltIcon, WrenchIcon, AwardIcon];
const AWARD_TONES = ["teal", "moss", "moss", "teal"];
const num = (i) => String(i + 1).padStart(2, "0");
const body = "text-base leading-relaxed text-mist";

const IMAGE_SHAPE = { 1: "aspect-[16/8]", 2: "aspect-[4/3] lg:aspect-[4/5.2]", 3: "aspect-[4/3] md:aspect-[16/7] lg:aspect-[4/5.4]" };

export default function HomePage() {
    const { lang, S, p } = useI18n();
    const h = S.home;
    const learnMore = stripArrow(S.common.learnMore);
    const recognized = S.whyUs[S.whyUs.length - 1]; // "Recognized quality": the FANUC awards
    useDocumentMeta("", h.description);
    // Step card of the process bento (step 0 is the lime tile).
    const step = (i) => (
        <Reveal delay={0.08 * i}>
            <GlassCard tone="slate" hover innerClassName="flex flex-col p-6">
                <span className="font-display text-sm font-bold text-lime">{num(i)}</span>
                <h3 className="mt-3 font-display text-[clamp(1.1rem,2vw,1.35rem)] font-bold leading-tight text-[#fffffd] whole-words">{S.process[i].t}</h3>
                <p className={`mt-4 ${body}`}>{S.process[i].d}</p>
                <Photo file={HOME_PROCESS_IMAGES[i]} alt={S.process[i].t} className={`mt-6 w-full rounded-2xl object-cover ${IMAGE_SHAPE[i]}`} />
            </GlassCard>
        </Reveal>
    );
    return (
        <>
            <Section tone="hero" divider={false} testid="hero">
                <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-12">
                    <div>
                        <DisplayHeading as="h1" parts={h.heroTitle} size="hero" testid="hero-title" />
                        <div className="mt-8 flex flex-wrap gap-4 md:mt-10">
                            <PillButton to={p("contact")} data-testid="hero-contact">{h.ctaContact}</PillButton>
                            <PillButton to={p("applications")} variant="ghost" arrow={false}>{h.ctaApplications}</PillButton>
                        </div>
                        <p className={`mt-8 max-w-[28rem] ${body}`}>{h.heroLead}</p>
                    </div>
                    <Reveal delay={0.1} className="hidden sm:block sm:max-w-xl lg:max-w-none" data-testid="hero-photo">
                        <GlassCard tone="moss" hover>
                            <Photo file={HOME_HERO_IMAGE} alt={h.heroTitle.join("")} eager className="aspect-[4/3] w-full object-cover" />
                        </GlassCard>
                    </Reveal>
                </div>
            </Section>

            <Section tone="dark" pad="md">
                <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
                    <div className="min-w-0" data-testid="references">
                        <DisplayHeading title={h.referencesTitle} size="sm" className="mb-5" />
                        <LogoBand logos={CLIENT_LOGOS} />
                    </div>
                    <GlassCard tone="moss" data-testid="more-applications" innerClassName="bg-plus">
                        <div className="flex items-center gap-4 p-5">
                            <Photo file={HOME_PROMO_IMAGE} alt={h.moreTitle} className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
                            <div className="min-w-0">
                                <h3 className="font-display text-lg font-bold leading-snug text-[#fffffd] whole-words">{h.moreTitle}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-mist">{getMoreApplications(lang).map((m) => m.title).join(", ")}.</p>
                                <ArrowLink to={p("contact")} className="mt-3">{stripArrow(h.moreCta)}</ArrowLink>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </Section>

            <SplitImageSection image={COMPANY_IMAGES.home} alt={h.introTitle} imageTestid="intro-photo" testid="intro">
                <Reveal>
                    <DisplayHeading title={h.introTitle} />
                    <div className="mt-6 space-y-4">{h.introText.map((t) => <p key={t} className={body}>{t}</p>)}</div>
                    <PillButton to={p("company")} className="mt-8">{h.introMore}</PillButton>
                    <div className="mt-10 grid gap-5 border-t border-white/[.14] pt-10 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {[[EyeIcon, S.company.visionTitle, S.company.visionText], [TargetIcon, S.company.missionTitle, S.company.missionText]].map(([Icon, title, text]) => (
                            <GlassCard key={title} hover innerClassName="flex items-start gap-4 p-5">
                                <Icon className="mt-1 h-9 w-9 shrink-0 text-lime" />
                                <div>
                                    <h3 className="font-display text-lg font-bold text-[#fffffd] whole-words">{title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </Reveal>
            </SplitImageSection>

            <StatBand items={S.stats} note={h.statsNote} />

            <Section tone="teal" testid="applications">
                <Reveal className="mx-auto max-w-3xl text-center">
                    <DisplayHeading title={h.appsTitle} align="center" />
                    <p className={`mt-5 ${body}`}>{h.appsCopy}</p>
                </Reveal>
                <ul className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {HOME_FEATURED_APPLICATIONS.map((id, i) => {
                        const a = getApplicationById(lang, id);
                        const Icon = FEATURE_ICONS[i];
                        return (
                            <GlassCard as="li" key={id} hover active={i === 1} className={i === 2 ? "md:col-span-2 xl:col-span-1" : ""} innerClassName="flex h-full flex-col p-6">
                                <span className="grid h-[76px] w-[76px] place-items-center rounded-full bg-deep-950 text-lime"><Icon className="h-9 w-9" /></span>
                                <h3 className="mt-6 font-display text-[1.05rem] font-bold leading-snug text-[#fffffd] whole-words">{a.title}</h3>
                                <p className="mt-3 flex-1 text-base leading-relaxed text-mist">{a.short}</p>
                                <ArrowLink to={applicationPath(lang, id)} className="mt-6">{learnMore}</ArrowLink>
                            </GlassCard>
                        );
                    })}
                </ul>
                <div className="mt-12 text-center"><PillButton to={p("applications")}>{S.nav.allApplications}</PillButton></div>
            </Section>

            <Section tone="dark" testid="process">
                <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <DisplayHeading title={h.processTitle} />
                        <p className={`mt-5 ${body}`}>{h.processCopy}</p>
                    </div>
                    <PillButton to={p("contact")} className="self-start md:self-auto md:shrink-0">{S.common.inquiry}</PillButton>
                </Reveal>
                <BentoGrid className="mt-12 lg:mt-20">
                    <BentoColumn>
                        <Reveal>
                            <GlassCard tone="lime" hover innerClassName="bg-plus p-5">
                                <div className="flex items-center gap-4">
                                    <span className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-full bg-deep-950 font-display text-xl font-bold text-lime">{num(0)}</span>
                                    <h3 className="font-display text-xl font-bold leading-snug text-lime-ink whole-words">{S.process[0].t}</h3>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-lime-ink/80">{S.process[0].d}</p>
                            </GlassCard>
                        </Reveal>
                        {step(1)}
                    </BentoColumn>
                    {[2, 3].map((i) => (
                        <BentoColumn key={i} raised={i === 3} className={i === 3 ? "md:col-span-2 lg:col-span-1" : ""}>
                            {step(i)}
                        </BentoColumn>
                    ))}
                </BentoGrid>
            </Section>

            <SplitImageSection variant="bleed" image={COMPANY_IMAGES.values} alt={h.whyTitle} testid="why-us">
                <Reveal>
                    <DisplayHeading title={h.whyTitle} />
                    <ul className="mt-9 space-y-4">
                        {S.whyUs.map((w, i) => <IconRow key={w.t} icon={WHY_ICONS[i]} title={w.t}>{w.d}</IconRow>)}
                    </ul>
                </Reveal>
            </SplitImageSection>

            <Section tone="teal" testid="awards">
                <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
                    <Reveal>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-lime">{S.company.awardsTitle}</p>
                        <DisplayHeading title={recognized.t} />
                        <p className={`mt-6 ${body}`}>{recognized.d}</p>
                        <PillButton to={p("company")} className="mt-8">{h.introMore}</PillButton>
                    </Reveal>
                    <ul className="grid gap-5 sm:grid-cols-2">
                        {HOME_AWARD_IMAGES.map((file, i) => (
                            <GlassCard as="li" key={file} tone={AWARD_TONES[i]} hover>
                                <Photo file={file} alt={S.company.awardsTitle} className="aspect-[4/3] w-full object-cover" />
                            </GlassCard>
                        ))}
                    </ul>
                </div>
            </Section>

            <Section tone="dark" testid="industries">
                <Reveal className="mx-auto max-w-3xl text-center">
                    <DisplayHeading title={h.industriesTitle} align="center" />
                    <p className={`mt-5 ${body}`}>{h.industriesCopy}</p>
                </Reveal>
                <ul className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-3">
                    {HOME_INDUSTRIES.map((id) => {
                        const ind = getIndustryById(lang, id);
                        return (
                            <GlassCard as="li" key={id} tone="slate" hover innerClassName="flex h-full flex-col p-4 lg:p-5">
                                <Photo file={INDUSTRY_IMAGES[id].photos[0]} alt={ind.title} className="aspect-[3/2] w-full rounded-2xl object-cover" />
                                <h3 className="mt-6 font-display text-[clamp(0.9rem,1.9vw,1.25rem)] font-bold leading-snug text-[#fffffd] whole-words">{ind.title}</h3>
                                <p className="mb-6 mt-3 flex-1 text-base leading-relaxed text-mist">{ind.short}</p>
                                <div><PillButton to={industryPath(lang, id)} size="sm" arrow={false}>{learnMore}</PillButton></div>
                            </GlassCard>
                        );
                    })}
                </ul>
                <div className="mt-12 text-center"><PillButton to={p("industries")} variant="ghost" arrow={false}>{S.nav.allIndustries}</PillButton></div>
            </Section>

            <GlassCtaBand title={h.ctaTitle} text={h.ctaText} />
        </>
    );
}
