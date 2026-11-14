import { Link } from "react-router-dom";
import { t, useI18n } from "@/i18n";

export const Container = ({ className = "", children }) => (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>
);

export const Eyebrow = ({ children, light = false }) => (
    <p className={`mb-3 text-xs font-bold uppercase tracking-[0.22em] ${light ? "text-amber" : "text-amber-600"}`}>{children}</p>
);

export const SectionHeading = ({ eyebrow, title, copy, light = false, className = "", testid }) => (
    <div className={`max-w-3xl ${className}`} data-testid={testid}>
        {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
        <h2 className={`text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${light ? "text-white" : "text-navy"}`}>{title}</h2>
        {copy && <p className={`mt-4 text-lg leading-relaxed ${light ? "text-navy-200" : "text-slate-600"}`}>{copy}</p>}
    </div>
);

const BTN = "inline-flex items-center justify-center rounded-md px-6 py-3.5 text-sm font-bold transition-colors";
const VARIANTS = {
    primary: "bg-amber text-navy-900 hover:bg-amber-600",
    ghost: "border border-white/40 text-white hover:border-amber hover:text-amber",
    dark: "bg-navy text-white hover:bg-navy-700",
    outline: "border border-navy/30 text-navy hover:border-navy hover:bg-navy-50",
};

export const ButtonLink = ({ to, variant = "primary", children, className = "", ...rest }) => (
    <Link to={to} className={`${BTN} ${VARIANTS[variant]} ${className}`} {...rest}>{children}</Link>
);

export const ButtonEl = ({ variant = "primary", children, className = "", ...rest }) => (
    <button className={`${BTN} ${VARIANTS[variant]} ${className}`} {...rest}>{children}</button>
);

// Marks a value the customer still has to confirm; shown highlighted so it is not overlooked.
// `value` is a COMPANY field (plain text or PLACEHOLDER({de,en})), `text` a placeholder text of the current language.
export const Ph = ({ value, text }) => {
    const { lang } = useI18n();
    if (text) return <span className="placeholder-mark" data-testid="placeholder">[{text}]</span>;
    return value && value.placeholder ? <span className="placeholder-mark" data-testid="placeholder">[{t(value.text, lang)}]</span> : <>{value}</>;
};
