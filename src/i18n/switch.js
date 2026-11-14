import { PAGE_PATHS, langFromPath, pagePath, stripTrailingSlash } from "@/i18n";
import { getApplications } from "@/data/applications";
import { getIndustries } from "@/data/industries";

const DETAIL = [
    { key: "industries", list: getIndustries },
    { key: "applications", list: getApplications },
];

// Same page in the other language. Detail pages map by id (the slugs differ per language);
// an unknown address goes to the home page of the other language.
export function switchLangPath(pathname, to) {
    const from = langFromPath(pathname);
    const path = stripTrailingSlash(pathname);
    if (from === to) return path;
    for (const key of Object.keys(PAGE_PATHS)) {
        if (PAGE_PATHS[key][from] === path) return pagePath(to, key);
    }
    for (const { key, list } of DETAIL) {
        const prefix = `${pagePath(from, key)}/`;
        if (path.startsWith(prefix)) {
            const item = list(from).find((x) => x.slug === decodeURIComponent(path.slice(prefix.length)));
            const target = item && list(to).find((x) => x.id === item.id);
            if (target) return `${pagePath(to, key)}/${target.slug}`;
        }
    }
    return pagePath(to, "home");
}
