import DisplayHeading from "@/components/DisplayHeading";
import PillButton from "@/components/PillButton";
import { t, useI18n } from "@/i18n";

// Shared building blocks of the pages: the small lime label, the section heading, buttons, placeholder marks.

export const Eyebrow = ({ children }) => (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-lime">{children}</p>
);

// Eyebrow, display heading (last word in lime unless `highlight` names one) and an optional text.
export const SectionHeading = ({ eyebrow, title, copy, highlight, className = "", testid }) => (
    <div className={`max-w-4xl ${className}`} data-testid={testid}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <DisplayHeading title={title} highlight={highlight} />
        {copy && <p className="mt-5 text-base leading-relaxed text-mist">{copy}</p>}
    </div>
);

const GHOST = new Set(["ghost", "dark", "outline"]);

// Pill buttons: a lime one (primary) and an outlined one (ghost; "dark" and "outline" are the same).
export const ButtonLink = ({ to, variant = "primary", children, className = "", ...rest }) => (
    <PillButton to={to} variant={GHOST.has(variant) ? "ghost" : "primary"} arrow={false} className={className} {...rest}>{children}</PillButton>
);

export const ButtonEl = ({ variant = "primary", children, className = "", ...rest }) => (
    <PillButton variant={GHOST.has(variant) ? "ghost" : "primary"} arrow={false} className={className} {...rest}>{children}</PillButton>
);

// Marks a value the customer still has to confirm; shown highlighted so it is not overlooked.
// `value` is a COMPANY field (plain text or PLACEHOLDER({de,en})), `text` a placeholder text of the current language.
export const Ph = ({ value, text }) => {
    const { lang } = useI18n();
    if (text) return <span className="placeholder-mark" data-testid="placeholder">[{text}]</span>;
    return value && value.placeholder ? <span className="placeholder-mark" data-testid="placeholder">[{t(value.text, lang)}]</span> : <>{value}</>;
};
