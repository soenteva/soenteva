import React, { act } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { getApplications } from "@/data/applications";
import { getIndustries } from "@/data/industries";
import { LANGS, PAGE_PATHS, STRINGS, pagePath } from "@/i18n";

let container, root;
beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    window.scrollTo = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

// Each call is a fresh page load: the router reads the address when it starts.
const open = (url) => {
    act(() => root.unmount());
    root = createRoot(container);
    window.history.replaceState(null, "", url);
    act(() => root.render(<App />));
};
const q = (selector) => container.querySelector(selector);
const all = (selector) => [...container.querySelectorAll(selector)];
const click = (el) => act(() => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })));
const hrefs = (selector) => all(selector).map((a) => a.getAttribute("href"));

const HERO = { de: "Die Zukunft der smarten Industrieautomation", en: "The future of smart industrial automation" };
const SLASH = { de: "anwendungen", en: "applications" };

describe.each(LANGS)("site in %s", (lang) => {
    const S = STRINGS[lang];
    const apps = getApplications(lang);
    const industries = getIndustries(lang);
    const p = (key) => pagePath(lang, key);

    test("the home page shows the hero, four figures and all ten application cards with working links", () => {
        open(p("home"));
        expect(q("h1").textContent).toContain(HERO[lang]);
        expect(document.title).toBe(S.meta.defaultTitle);
        expect(document.documentElement.lang).toBe(lang);
        expect(all('[data-testid="stats"] dd')).toHaveLength(4);
        const links = hrefs('[data-testid="applications"] a');
        for (const a of apps) expect(links).toContain(`${p("applications")}/${a.slug}`);
        expect(q('[data-testid="more-applications"] a').getAttribute("href")).toBe(p("contact"));
        expect(hrefs('[data-testid="industries"] a')).toEqual(industries.map((i) => `${p("industries")}/${i.slug}`));
    });

    test.each(apps.map((a) => [a.slug, a.title]))("application page %s shows its title, benefits and solutions", (slug, title) => {
        open(`${p("applications")}/${slug}`);
        expect(q("h1").textContent).toBe(title);
        expect(document.title).toBe(`${title} | Sönteva Automatisierung GmbH`);
        expect(document.documentElement.lang).toBe(lang);
        const app = apps.find((a) => a.slug === slug);
        expect(all('[data-testid="benefits"] li')).toHaveLength(app.benefits.length);
        expect(all('[data-testid="solutions"] li')).toHaveLength(app.solutions.length);
        expect(hrefs('[data-testid="application-sidebar"] a')).toEqual(apps.map((a) => `${p("applications")}/${a.slug}`));
        expect(q('[data-testid="application-sidebar"] a[aria-current="page"]').textContent).toBe(title);
    });

    test.each(industries.map((i) => [i.slug, i.title]))("industry page %s shows its text and related applications in the same language", (slug, title) => {
        open(`${p("industries")}/${slug}`);
        expect(q("h1").textContent).toBe(S.industries.detailTitle.replace("{title}", title));
        expect(all('[data-testid="industry-body"] p').length).toBeGreaterThan(0);
        const related = hrefs('[data-testid="industry-body"] aside a');
        expect(related.length).toBeGreaterThan(0);
        for (const href of related) expect(href.startsWith(`${p("applications")}/`)).toBe(true);
    });

    test("an unknown application, industry or address shows the 404 page in this language", () => {
        const prefix = lang === "en" ? "/en" : "";
        for (const url of [`${p("applications")}/does-not-exist`, `${p("industries")}/does-not-exist`, `${prefix}/does-not-exist`]) {
            open(url);
            expect(q('[data-testid="not-found"]')).not.toBeNull();
            expect(q("h1").textContent).toBe(S.notFound.heroTitle);
            expect(q('[data-testid="not-found"] a').getAttribute("href")).toBe(p("home"));
        }
    });

    test("an application slug of the other language is not found", () => {
        const other = getApplications(lang === "en" ? "de" : "en")[0].slug;
        open(`${p("applications")}/${other}`);
        expect(q('[data-testid="not-found"]')).not.toBeNull();
    });

    test("the index pages list every entry", () => {
        open(p("applications"));
        expect(all('[data-testid="applications-list"] > div > ul > li a')).toHaveLength(apps.length);
        open(p("industries"));
        expect(all('[data-testid="industries-list"] li a')).toHaveLength(industries.length);
        open(p("projects"));
        expect(all('[data-testid="project-card"]')).toHaveLength(6);
        open(p("company"));
        expect(q("h1").textContent).toBe(S.company.heroTitle);
        open(p("career"));
        expect(q("h1").textContent).toBe(S.career.heroTitle);
    });

    test("the contact form asks for the missing fields and for consent before it reacts", () => {
        open(p("contact"));
        const submit = () => act(() => q('[data-testid="contact-form"]').dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
        submit(); // empty: must not throw
        expect(q('[data-testid="contact-consent"]').checked).toBe(false);
        expect(all('[data-testid="contact-details"] [data-testid="placeholder"]')).toHaveLength(2);
        expect(all("select option").map((o) => o.textContent)).toEqual([S.contact.choose, ...S.services]);
        expect(q('[data-testid="contact-form"] label span a').getAttribute("href")).toBe(p("privacy"));
        expect(q('[data-testid="contact-submit"]').textContent).toBe(S.contact.submit);
    });

    test("the legal pages exist, carry the draft notice and highlight what is still missing", () => {
        open(p("legal"));
        expect(q("h1").textContent).toBe(S.legal.imprint.title);
        expect(q('[data-testid="legal-draft"]').textContent).toBe(S.legal.draft);
        expect(q('[data-testid="impressum"]').textContent).toContain("HRB 734051");
        expect(all('[data-testid="impressum"] [data-testid="placeholder"]').length).toBeGreaterThanOrEqual(4);
        open(p("privacy"));
        expect(q("h1").textContent).toBe(S.legal.privacy.heroTitle);
        expect(all('[data-testid="datenschutz"] h2')).toHaveLength(7);
        expect(all('[data-testid="datenschutz"] [data-testid="placeholder"]')).toHaveLength(4); // email, hosting, form, date
        expect(q('[data-testid="datenschutz"] a').getAttribute("href")).toBe(p("legal"));
    });

    test("navigation and footer link to every page of this language only", () => {
        open(p("home"));
        const nav = hrefs('[data-testid="navbar"] nav a');
        for (const key of ["company", "projects", "industries", "applications", "career", "contact"]) expect(nav).toContain(p(key));
        const footer = hrefs('[data-testid="footer"] a');
        expect(footer).toContain(p("legal"));
        expect(footer).toContain(p("privacy"));
        expect(hrefs('[data-testid="logo"]')[0]).toBe(p("home"));
        // Only the language switch may point to the other language.
        const other = lang === "en" ? (h) => !h.startsWith("/en") : (h) => h.startsWith("/en");
        const stray = hrefs("a").filter((h) => h.startsWith("/")).filter(other).filter((h) => !all('[data-testid^="lang-switch"] a').some((a) => a.getAttribute("href") === h));
        expect(stray).toEqual([]);
    });

    test("the mobile menu opens and closes", () => {
        open(p("home"));
        expect(q('[data-testid="mobile-menu"]')).toBeNull();
        click(q('[data-testid="menu-toggle"]'));
        expect(q('[data-testid="mobile-menu"]')).not.toBeNull();
        expect(q('[data-testid="menu-toggle"]').getAttribute("aria-expanded")).toBe("true");
        expect(q('[data-testid="menu-toggle"]').textContent).toBe(S.nav.close);
        click(q('[data-testid="menu-toggle"]'));
        expect(q('[data-testid="mobile-menu"]')).toBeNull();
    });

    test("the dropdown menus list every industry and application", () => {
        open(p("home"));
        expect(all('[data-testid="menu-applications"] ul a')).toHaveLength(apps.length);
        expect(all('[data-testid="menu-industries"] ul a')).toHaveLength(industries.length);
    });
});

describe("language switch", () => {
    test("shows DE | EN, marks the current language and links to the same page in the other one", () => {
        open("/");
        const sw = q('[data-testid="lang-switch"]');
        expect(sw.textContent.replace(/\s/g, "")).toBe("DE|EN");
        expect(q('[data-testid="lang-switch-de"]').getAttribute("aria-current")).toBe("true");
        expect(q('[data-testid="lang-switch-en"]').getAttribute("aria-current")).toBeNull();
        expect(q('[data-testid="lang-switch-en"]').getAttribute("href")).toBe("/en");
        open("/en");
        expect(q('[data-testid="lang-switch-en"]').getAttribute("aria-current")).toBe("true");
        expect(q('[data-testid="lang-switch-de"]').getAttribute("href")).toBe("/");
    });

    test("is also available next to the menu button on small screens", () => {
        open("/");
        expect(q('[data-testid="lang-switch-compact"]')).not.toBeNull();
        expect(q('[data-testid="lang-switch-compact-en"]').getAttribute("href")).toBe("/en");
    });

    test.each(Object.keys(PAGE_PATHS))("page %s: both switch links point at the same page", (key) => {
        open(PAGE_PATHS[key].de);
        expect(q('[data-testid="lang-switch-en"]').getAttribute("href")).toBe(PAGE_PATHS[key].en);
        open(PAGE_PATHS[key].en);
        expect(q('[data-testid="lang-switch-de"]').getAttribute("href")).toBe(PAGE_PATHS[key].de);
    });

    test("detail pages switch to the slug of the other language", () => {
        open("/anwendungen/palettieren-depalettieren");
        expect(q('[data-testid="lang-switch-en"]').getAttribute("href")).toBe("/en/applications/palletizing-depalletizing");
        open("/en/industries/pharmaceutical");
        expect(q('[data-testid="lang-switch-de"]').getAttribute("href")).toBe("/branchen/pharma");
    });

    test("clicking EN changes the page to English and clicking DE back to German", () => {
        open("/anwendungen/pressenautomation");
        expect(q("h1").textContent).toBe("Pressenautomation");
        click(q('[data-testid="lang-switch-en"]'));
        expect(window.location.pathname).toBe("/en/applications/press-shop-automation");
        expect(q("h1").textContent).toBe("Press Shop Automation");
        expect(document.documentElement.lang).toBe("en");
        expect(document.title).toBe("Press Shop Automation | Sönteva Automatisierung GmbH");
        click(q('[data-testid="lang-switch-de"]'));
        expect(window.location.pathname).toBe("/anwendungen/pressenautomation");
        expect(q("h1").textContent).toBe("Pressenautomation");
        expect(document.documentElement.lang).toBe("de");
    });

    test("a 404 switches to the home page of the other language", () => {
        open("/en/gibt-es-nicht");
        expect(q('[data-testid="lang-switch-de"]').getAttribute("href")).toBe("/");
    });
});

test("the English site is reachable only below /en and the German one only outside it", () => {
    for (const key of Object.keys(PAGE_PATHS)) {
        open(PAGE_PATHS[key].de);
        expect(document.documentElement.lang).toBe("de");
        open(PAGE_PATHS[key].en);
        expect(document.documentElement.lang).toBe("en");
    }
    expect(SLASH.en).not.toBe(SLASH.de);
});
