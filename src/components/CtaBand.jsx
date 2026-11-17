import DisplayHeading from "@/components/DisplayHeading";
import PillButton from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { useI18n } from "@/i18n";

// Closing band of a page: heading with one highlighted word, text and a pill button to the contact page.
export default function CtaBand({ title, highlight, text, label, to }) {
    const { S, p } = useI18n();
    return (
        <Section tone="glass" pad="md" testid="cta-band">
            <Reveal className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
                <div className="max-w-2xl">
                    <DisplayHeading title={title} highlight={highlight} size="lg" />
                    {text && <p className="mt-4 text-base leading-relaxed text-mist">{text}</p>}
                </div>
                <PillButton to={to || p("contact")} className="self-start md:self-auto md:shrink-0">{label || S.common.inquiry}</PillButton>
            </Reveal>
        </Section>
    );
}
