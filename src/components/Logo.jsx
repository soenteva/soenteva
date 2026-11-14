import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

export default function Logo({ light = true }) {
    const { S, p } = useI18n();
    return (
        <Link to={p("home")} className="flex items-center gap-3" aria-label={S.common.logoAria} data-testid="logo">
            <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0" aria-hidden="true">
                <rect width="64" height="64" rx="12" fill={light ? "#FAAF3A" : "#113959"} />
                <path d="M42 20c-3-4-8-6-13-5-6 1-9 6-7 10 2 4 7 5 12 7 5 2 8 4 7 9-1 5-7 7-12 6-4-1-8-3-10-6" fill="none" stroke={light ? "#113959" : "#FAAF3A"} strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span className="leading-none">
                <span className={`block text-xl font-extrabold tracking-wide ${light ? "text-white" : "text-navy"}`}>SÖNTEVA</span>
                <span className={`mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${light ? "text-navy-200" : "text-slate-500"}`}>Automatisierung</span>
            </span>
        </Link>
    );
}
