import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

// The Sönteva mark and name. `tone="light"` is for a white background: the name turns dark teal and the lime
// mark gets a thin dark teal outline so its shape shows on white.
export default function Logo({ tone = "dark" }) {
    const { S, p } = useI18n();
    const light = tone === "light";
    return (
        <Link to={p("home")} className="flex items-center gap-3" aria-label={S.common.logoAria} data-testid="logo">
            <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
                <rect x={light ? 1.5 : 0} y={light ? 1.5 : 0} width={light ? 61 : 64} height={light ? 61 : 64} rx="16" fill="#e1ff7c" stroke={light ? "#022d33" : "none"} strokeWidth={light ? 3 : 0} />
                <path d="M42 20c-3-4-8-6-13-5-6 1-9 6-7 10 2 4 7 5 12 7 5 2 8 4 7 9-1 5-7 7-12 6-4-1-8-3-10-6" fill="none" stroke="#011b00" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span className="leading-none">
                <span className={`block font-display text-lg font-bold tracking-wide sm:text-xl ${light ? "text-deep-800" : "text-[#fffffd]"}`}>SÖNTEVA</span>
                <span className={`mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.3em] ${light ? "text-deep-800/70" : "text-mist"}`}>Automatisierung</span>
            </span>
        </Link>
    );
}
