import { getApplications, getMoreApplications, applicationPath } from "@/data/applications";
import { getIndustries, industryPath } from "@/data/industries";
import { COMPANY, NAV } from "@/data/site";
import { LANGS, STRINGS } from "@/i18n";

describe.each(LANGS)("content in %s", (lang) => {
    const apps = getApplications(lang);
    const industries = getIndustries(lang);
    const S = STRINGS[lang];

    test("every application has the content its page needs and a unique slug", () => {
        expect(apps).toHaveLength(10);
        expect(new Set(apps.map((a) => a.slug)).size).toBe(10);
        for (const a of apps) {
            expect(a.id && a.title && a.short && a.tagline && a.lead).toBeTruthy();
            expect(a.overview.length).toBeGreaterThan(0);
            expect(a.benefits.length).toBeGreaterThanOrEqual(5);
            expect(a.solutions.length).toBeGreaterThanOrEqual(3);
            expect(a.cta.title && a.cta.text).toBeTruthy();
        }
    });

    test("every industry has text and only points to applications that exist", () => {
        expect(industries).toHaveLength(11);
        expect(new Set(industries.map((i) => i.slug)).size).toBe(11);
        const ids = apps.map((a) => a.id);
        for (const i of industries) {
            expect(i.id && i.title && i.short).toBeTruthy();
            expect(i.paragraphs.length).toBeGreaterThan(0);
            for (const r of i.related) expect(ids).toContain(r);
        }
    });

    test("projects only link to applications that exist and the form offers its services", () => {
        const ids = apps.map((a) => a.id);
        expect(S.projects.items).toHaveLength(6);
        for (const p of S.projects.items) if (p.application) expect(ids).toContain(p.application);
        expect(S.services.length).toBe(11);
    });

    test("no India-only content has been carried over", () => {
        const all = JSON.stringify({ apps, more: getMoreApplications(lang), industries, S });
        expect(all).not.toMatch(/Pune|\+91|Diwali|Holi|Maharashtra|Indiens größter|India's largest/);
    });

    test("every application and industry has a path in this language", () => {
        const prefix = lang === "en" ? "/en/" : "/";
        for (const a of apps) expect(applicationPath(lang, a.id)).toBe(`${prefix}${lang === "en" ? "applications" : "anwendungen"}/${a.slug}`);
        for (const i of industries) expect(industryPath(lang, i.id)).toBe(`${prefix}${lang === "en" ? "industries" : "branchen"}/${i.slug}`);
    });
});

test("German and English lists have the same entries in the same order", () => {
    expect(getApplications("en").map((a) => a.id)).toEqual(getApplications("de").map((a) => a.id));
    expect(getIndustries("en").map((i) => i.id)).toEqual(getIndustries("de").map((i) => i.id));
    expect(getMoreApplications("en")).toHaveLength(getMoreApplications("de").length);
    expect(STRINGS.en.projects.items.map((p) => p.application)).toEqual(STRINGS.de.projects.items.map((p) => p.application));
});

test("English slugs differ from German ones, so each language has its own address", () => {
    const de = getApplications("de").map((a) => a.slug);
    const en = getApplications("en").map((a) => a.slug);
    for (const s of en) expect(de).not.toContain(s);
});

test("details the customer still has to confirm are marked as placeholders in both languages", () => {
    for (const key of ["phone", "email", "managingDirector", "vatId"]) {
        expect(COMPANY[key].placeholder).toBe(true);
        expect(COMPANY[key].text.de).toBeTruthy();
        expect(COMPANY[key].text.en).toBeTruthy();
    }
});

test("every navigation entry has a label in both languages", () => {
    for (const n of NAV) for (const lang of LANGS) expect(STRINGS[lang].nav.items[n.key]).toBeTruthy();
});
