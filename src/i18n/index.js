import { useLocation } from "react-router-dom";
import { DE } from "@/i18n/strings.de";
import { EN } from "@/i18n/strings.en";

// Same pattern as the KCP site: German at "/...", English at "/en/...", one path per page and language.
export const LANGS = ["de", "en"];
export const DEFAULT_LANG = "de";

export const STRINGS = { de: DE, en: EN };

export const PAGE_PATHS = {
    home: { de: "/", en: "/en" },
    company: { de: "/unternehmen", en: "/en/company" },
    projects: { de: "/projekte", en: "/en/projects" },
    industries: { de: "/branchen", en: "/en/industries" },
    applications: { de: "/anwendungen", en: "/en/applications" },
    career: { de: "/karriere", en: "/en/career" },
    events: { de: "/veranstaltungen", en: "/en/events" },
    contact: { de: "/kontakt", en: "/en/contact" },
    legal: { de: "/impressum", en: "/en/legal-notice" },
    privacy: { de: "/datenschutz", en: "/en/privacy" },
};

export const pagePath = (lang, key) => PAGE_PATHS[key][lang === "en" ? "en" : "de"];

export const langFromPath = (pathname) => (pathname === "/en" || pathname.startsWith("/en/") ? "en" : "de");

// Value that is either plain text or { de, en }.
export const t = (value, lang) => (value && typeof value === "object" && !Array.isArray(value) && ("de" in value || "en" in value) ? value[lang] ?? value.de : value);

// "Automation für {title}" + { title: "Pharma" }
export const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

export const stripTrailingSlash = (pathname) => (pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname);

// Language, strings and path helper of the current page; the language comes from the URL only.
export function useI18n() {
    const { pathname } = useLocation();
    const lang = langFromPath(pathname);
    return { lang, S: STRINGS[lang], p: (key) => pagePath(lang, key) };
}
