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

describe("events page", () => {
    test("has one path per language: /veranstaltungen and /en/events", () => {
        expect(PAGE_PATHS.events).toEqual({ de: "/veranstaltungen", en: "/en/events" });
        expect(pagePath("de", "events")).toBe("/veranstaltungen");
        expect(pagePath("en", "events")).toBe("/en/events");
        expect(langFromPath("/veranstaltungen")).toBe("de");
        expect(langFromPath("/en/events")).toBe("en");
    });

    test("the language switch maps the events page in both directions, with or without a trailing slash", () => {
        expect(switchLangPath("/veranstaltungen", "en")).toBe("/en/events");
        expect(switchLangPath("/en/events", "de")).toBe("/veranstaltungen");
        expect(switchLangPath("/veranstaltungen/", "en")).toBe("/en/events");
        expect(switchLangPath("/en/events/", "de")).toBe("/veranstaltungen");
        expect(switchLangPath("/veranstaltungen", "de")).toBe("/veranstaltungen");
        expect(switchLangPath("/en/events", "en")).toBe("/en/events");
        expect(switchLangPath("/events", "en")).toBe("/en");
    });

    test("the texts are only the heading and the intro of the source page, no invented text", () => {
        expect(STRINGS.de.events).toEqual({ title: "Veranstaltungen", intro: "Entdecken Sie die neuesten Ausstellungen, Feiern und Branchenpräsentationen von IRTI Robotics." });
        expect(STRINGS.en.events).toEqual({ title: "Events", intro: "Explore IRTI Robotics’ latest exhibitions, celebrations, and industry showcases." });
        expect(STRINGS.de.nav.items.events).toBe("Veranstaltungen");
        expect(STRINGS.en.nav.items.events).toBe("Events");
    });

    test("the home page and company page carry the headings of the new sections", () => {
        expect(STRINGS.de.home.referencesTitle).toBe("Referenzen der IRTI-Gruppe");
        expect(STRINGS.en.home.referencesTitle).toBe("References of the IRTI group");
        for (const lang of LANGS) expect(STRINGS[lang].company.awardsTitle.trim()).not.toBe("");
    });

    test("no Pune address or +91 phone number is in any text", () => {
        expect(JSON.stringify(STRINGS)).not.toMatch(/Pune|\+91/);
    });
});
