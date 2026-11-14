import { LANGS, PAGE_PATHS, STRINGS, fill, langFromPath, pagePath, t } from "@/i18n";
import { switchLangPath } from "@/i18n/switch";
import { getApplications } from "@/data/applications";
import { getIndustries } from "@/data/industries";

// Shape of a text tree: same keys, same array lengths. Texts differ per language, so a string is just "s".
// Parts lists of the legal texts may split their text differently, so only their placeholders, values and links count.
const shape = (value, key) => {
    if (Array.isArray(value)) return (key === "parts" ? value.filter((x) => typeof x !== "string") : value).map((x) => shape(x));
    if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k], k)]));
    return typeof value;
};

test("German and English texts have exactly the same structure", () => {
    expect(shape(STRINGS.en)).toEqual(shape(STRINGS.de));
});

test("no text is empty in either language", () => {
    const empty = [];
    const walk = (v, path) => {
        if (typeof v === "string") { if (!v.trim() && !/application$/.test(path)) empty.push(path); } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
        else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
    };
    for (const lang of LANGS) walk(STRINGS[lang], lang);
    expect(empty).toEqual([]);
});

test("German pages live at the root and English pages under /en, with one path each", () => {
    for (const [key, paths] of Object.entries(PAGE_PATHS)) {
        expect(paths.en === "/en" || paths.en.startsWith("/en/")).toBe(true);
        expect(paths.de.startsWith("/en")).toBe(false);
        expect(langFromPath(paths.de)).toBe("de");
        expect(langFromPath(paths.en)).toBe("en");
        expect(pagePath("de", key)).toBe(paths.de);
        expect(pagePath("en", key)).toBe(paths.en);
    }
    expect(langFromPath("/english")).toBe("de");
    expect(langFromPath("/en/company")).toBe("en");
});

test("t picks the language of a { de, en } value and leaves plain text alone", () => {
    expect(t({ de: "Hallo", en: "Hello" }, "en")).toBe("Hello");
    expect(t({ de: "Hallo", en: "Hello" }, "de")).toBe("Hallo");
    expect(t("plain", "en")).toBe("plain");
    expect(fill("Automation für {title}", { title: "Pharma" })).toBe("Automation für Pharma");
});

describe("switching the language keeps the same page", () => {
    test.each(Object.keys(PAGE_PATHS))("page %s", (key) => {
        expect(switchLangPath(PAGE_PATHS[key].de, "en")).toBe(PAGE_PATHS[key].en);
        expect(switchLangPath(PAGE_PATHS[key].en, "de")).toBe(PAGE_PATHS[key].de);
    });

    test.each(getApplications("de").map((a) => [a.id]))("application %s maps to its English slug and back", (id) => {
        const de = getApplications("de").find((a) => a.id === id);
        const en = getApplications("en").find((a) => a.id === id);
        expect(switchLangPath(`/anwendungen/${de.slug}`, "en")).toBe(`/en/applications/${en.slug}`);
        expect(switchLangPath(`/en/applications/${en.slug}`, "de")).toBe(`/anwendungen/${de.slug}`);
    });

    test.each(getIndustries("de").map((i) => [i.id]))("industry %s maps to its English slug and back", (id) => {
        const de = getIndustries("de").find((i) => i.id === id);
        const en = getIndustries("en").find((i) => i.id === id);
        expect(switchLangPath(`/branchen/${de.slug}`, "en")).toBe(`/en/industries/${en.slug}`);
        expect(switchLangPath(`/en/industries/${en.slug}`, "de")).toBe(`/branchen/${de.slug}`);
    });

    test("a trailing slash is ignored, the current language stays and unknown addresses go to the home page", () => {
        expect(switchLangPath("/kontakt/", "en")).toBe("/en/contact");
        expect(switchLangPath("/kontakt", "de")).toBe("/kontakt");
        expect(switchLangPath("/gibt-es-nicht", "en")).toBe("/en");
        expect(switchLangPath("/en/nothing-here", "de")).toBe("/");
        expect(switchLangPath("/anwendungen/gibt-es-nicht", "en")).toBe("/en");
    });
});
