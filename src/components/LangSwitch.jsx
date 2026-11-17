import { Link, useLocation } from "react-router-dom";
import { LANGS, langFromPath, useI18n } from "@/i18n";
import { switchLangPath } from "@/i18n/switch";

// DE | EN: links to the same page in the other language (also usable without JavaScript state).
export default function LangSwitch({ testid = "lang-switch", className = "" }) {
    const { pathname } = useLocation();
    const { S } = useI18n();
    const current = langFromPath(pathname);
    return (
        <div className={`flex items-center text-sm font-bold ${className}`} role="group" aria-label={S.nav.langSwitch} data-testid={testid}>
            {LANGS.map((l, i) => (
                <span key={l} className="flex items-center">
                    {i > 0 && <span className="px-1.5 text-white/40" aria-hidden="true">|</span>}
                    <Link
                        to={switchLangPath(pathname, l)}
                        lang={l}
                        hrefLang={l}
                        aria-current={l === current ? "true" : undefined}
                        className={l === current ? "text-lime" : "text-[#fffffd] hover:text-lime"}
                        data-testid={`${testid}-${l}`}
                    >
                        {l.toUpperCase()}
                    </Link>
                </span>
            ))}
        </div>
    );
}
