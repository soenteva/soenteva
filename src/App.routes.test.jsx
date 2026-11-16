import fs from "fs";
import path from "path";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { getApplications } from "@/data/applications";
import { getIndustries } from "@/data/industries";
import { APPLICATION_IMAGES, AWARD_IMAGES, CLIENT_LOGOS, EVENT_PHOTOS, INDUSTRY_IMAGES, PROJECT_IMAGES } from "@/data/images";
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
// The file in public/ an <img> points at.
const fileOf = (img) => path.join(process.cwd(), "public", decodeURI(new URL(img.getAttribute("src"), "http://localhost").pathname));
const alts = (selector) => all(selector).map((img) => img.getAttribute("alt"));

const HERO = { de: "Die Zukunft der intelligenten Industrieautomation", en: "The future of smart industrial automation" };
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
        for (const key of ["company", "projects", "industries", "applications", "career", "events", "contact"]) expect(nav).toContain(p(key));
        const footer = hrefs('[data-testid="footer"] a');
        expect(footer).toContain(p("events"));
        expect(footer).toContain(p("legal"));
        expect(footer).toContain(p("privacy"));
        expect(hrefs('[data-testid="logo"]')[0]).toBe(p("home"));
        // Only the language switch may point to the other language.
        const other = lang === "en" ? (h) => !h.startsWith("/en") : (h) => h.startsWith("/en");
        const stray = hrefs("a").filter((h) => h.startsWith("/")).filter(other).filter((h) => !all('[data-testid^="lang-switch"] a').some((a) => a.getAttribute("href") === h));
        expect(stray).toEqual([]);
    });

    test("the events page shows its heading, the intro of the source page and the whole gallery, lazy-loaded", () => {
        open(p("events"));
        expect(window.location.pathname).toBe(lang === "en" ? "/en/events" : "/veranstaltungen");
        expect(q("h1").textContent).toBe(lang === "en" ? "Events" : "Veranstaltungen");
        expect(q("h1").textContent).toBe(S.events.title);
        expect(q('[data-testid="page-hero"] p.text-lg').textContent).toBe(S.events.intro);
        expect(document.title).toBe(`${S.events.title} | Sönteva Automatisierung GmbH`);
        expect(document.documentElement.lang).toBe(lang);
        const photos = all('[data-testid="events-gallery"] img');
        expect(photos).toHaveLength(EVENT_PHOTOS.length);
        for (const img of photos) {
            expect(img.getAttribute("loading")).toBe("lazy");
            expect(img.getAttribute("alt")).toBe(S.events.title);
            expect(Number(img.getAttribute("width"))).toBeGreaterThan(0);
            expect(Number(img.getAttribute("height"))).toBeGreaterThan(0);
        }
        expect(photos.map((img) => new URL(img.getAttribute("src"), "http://localhost").pathname)).toEqual(EVENT_PHOTOS.map((f) => `/images/${f}`));
        // Nothing but the heading, the intro and the photos: no other text on the page apart from navigation and footer.
        expect(all('main h2, main h3, main figcaption, main p').map((e) => e.textContent)).toEqual([S.events.intro]);
    });

    test("the events page is only reachable under its own path of this language", () => {
        const other = lang === "en" ? "/veranstaltungen" : "/en/events";
        open(other);
        expect(document.documentElement.lang).toBe(lang === "en" ? "de" : "en");
        open(`${lang === "en" ? "/en" : ""}/events-gibt-es-nicht`);
        expect(q('[data-testid="not-found"]')).not.toBeNull();
    });

    test("the home page shows all client logos under the references heading, with the company name as alt text", () => {
        open(p("home"));
        const section = q('[data-testid="references"]');
        expect(section.querySelector("h2").textContent).toBe(lang === "en" ? "References of the IRTI group" : "Referenzen der IRTI-Gruppe");
        const logos = all('[data-testid="references"] img');
        expect(logos).toHaveLength(37);
        expect(alts('[data-testid="references"] img')).toEqual(CLIENT_LOGOS.map((l) => l.name));
        for (const img of logos) expect(img.getAttribute("loading")).toBe("lazy");
        expect(logos.map((img) => fs.existsSync(fileOf(img)))).not.toContain(false);
        expect(q('[data-testid="intro-photo"]').getAttribute("alt")).toBe(S.home.introTitle);
    });

    test("the company page shows the team photo, the values photo and all nine awards", () => {
        open(p("company"));
        expect(q('[data-testid="company-photo"]').getAttribute("alt")).toBe(S.company.heroTitle);
        expect(q('[data-testid="values-photo"]').getAttribute("alt")).toBe(S.company.valuesTitle);
        expect(q('[data-testid="awards"] h2').textContent).toBe(S.company.awardsTitle);
        expect(all('[data-testid="awards"] img').map((img) => new URL(img.getAttribute("src"), "http://localhost").pathname)).toEqual(AWARD_IMAGES.map((f) => `/images/${f}`));
        expect(alts('[data-testid="awards"] img')).toEqual(AWARD_IMAGES.map(() => S.company.awardsTitle));
    });

    test("the projects page shows one photo per project, titled like the project", () => {
        open(p("projects"));
        expect(alts('[data-testid="project-card"] img')).toEqual(S.projects.items.map((i) => i.title));
        expect(all('[data-testid="project-card"] img').map((img) => new URL(img.getAttribute("src"), "http://localhost").pathname)).toEqual(PROJECT_IMAGES.map((f) => `/images/${f}`));
    });

    test("the industry overview shows a picture per industry and each detail page its photos, titled like the page", () => {
        open(p("industries"));
        expect(alts('[data-testid="industries-list"] img')).toEqual(industries.map((i) => i.title));
        for (const i of industries) {
            open(`${p("industries")}/${i.slug}`);
            const photos = all('[data-testid="industry-photos"] img');
            expect(photos).toHaveLength(INDUSTRY_IMAGES[i.id].photos.length);
            for (const img of photos) expect(img.getAttribute("alt")).toBe(q("h1").textContent);
        }
    });

    test("every solution of an application page shows its picture, titled like the solution", () => {
        for (const a of apps) {
            open(`${p("applications")}/${a.slug}`);
            expect(alts('[data-testid="solutions"] img')).toEqual(a.solutions.map((s) => s.t));
            expect(all('[data-testid="solutions"] img')).toHaveLength(APPLICATION_IMAGES[a.id].length);
        }
        open(p("applications"));
        expect(q('[data-testid="applications-banner"]').getAttribute("alt")).toBe(S.applications.heroTitle);
    });

    test("every page of this language has images that exist and carry alt text, and no Pune address or +91 number", () => {
        const urls = [...Object.keys(PAGE_PATHS).map(p), ...apps.map((a) => `${p("applications")}/${a.slug}`), ...industries.map((i) => `${p("industries")}/${i.slug}`), `${lang === "en" ? "/en" : ""}/does-not-exist`];
        let total = 0;
        for (const url of urls) {
            open(url);
            for (const img of all("img")) {
                total += 1;
                expect(`${url} ${img.getAttribute("src")} alt="${(img.getAttribute("alt") || "").trim()}"`).not.toMatch(/alt=""$/);
                expect(`${url} ${img.getAttribute("src")} ${fs.existsSync(fileOf(img))}`).toMatch(/true$/);
            }
            expect(container.textContent).not.toMatch(/Pune|\+91/);
        }
        expect(total).toBeGreaterThan(200);
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

    test("the events page switches between /veranstaltungen and /en/events by click", () => {
        open("/veranstaltungen");
        expect(q("h1").textContent).toBe("Veranstaltungen");
        expect(q('[data-testid="lang-switch-en"]').getAttribute("href")).toBe("/en/events");
        click(q('[data-testid="lang-switch-en"]'));
        expect(window.location.pathname).toBe("/en/events");
        expect(q("h1").textContent).toBe("Events");
        expect(document.documentElement.lang).toBe("en");
        expect(all('[data-testid="events-gallery"] img')).toHaveLength(EVENT_PHOTOS.length);
        click(q('[data-testid="lang-switch-de"]'));
        expect(window.location.pathname).toBe("/veranstaltungen");
        expect(q("h1").textContent).toBe("Veranstaltungen");
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
