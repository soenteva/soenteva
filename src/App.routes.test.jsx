import fs from "fs";
import path from "path";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { getApplications, getMoreApplications } from "@/data/applications";
import { getIndustries } from "@/data/industries";
import { COMPANY } from "@/data/site";
import { HOME_HERO_IMAGES, HOME_SLIDE_IMAGES } from "@/data/home";
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

    const keyDown = (el, key) => act(() => el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })));
    const slide = (rootSel) => all(`${rootSel} [aria-roledescription="slide"]`);

    test("the home page follows the new section order: header, hero slider, tabs, photo slides, three 50/50 blocks, cards, logo strip, contact band, footer", () => {
        open(p("home"));
        const order = ["navbar", "hero", "tabs", "photo-slides", "intro", "why-us", "vision", "cards", "references-band", "cta-band", "footer"];
        const els = order.map((id) => q(`[data-testid="${id}"]`));
        els.forEach((el, i) => expect(`${order[i]} ${el !== null}`).toBe(`${order[i]} true`));
        for (let i = 1; i < els.length; i += 1) expect(els[i - 1].compareDocumentPosition(els[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(q("h1").textContent).toContain(HERO[lang]);
        expect(all("h1")).toHaveLength(1);
        expect(document.title).toBe(S.meta.defaultTitle);
        expect(document.documentElement.lang).toBe(lang);
    });

    test("the hero slider has three slides built from the existing texts; one is shown, the dots and arrows are named after the slides", () => {
        open(p("home"));
        const h = S.home;
        const slides = slide('[data-testid="hero"]');
        expect(slides).toHaveLength(3);
        const labels = [h.heroTitle.join(""), h.processTitle, h.moreTitle];
        expect(slides.map((el) => el.getAttribute("aria-label"))).toEqual(labels);
        expect(slides.map((el) => el.getAttribute("aria-hidden"))).toEqual(["false", "true", "true"]);
        expect(slides[0].textContent).toBe(h.heroTitle.join("") + h.ctaContact + h.ctaApplications + h.heroLead);
        expect(slides[1].textContent).toBe(h.processTitle + h.processCopy + S.common.inquiry);
        expect(all('[data-testid="hero"] [data-testid="carousel-dots"] button').map((b) => b.getAttribute("aria-label"))).toEqual(labels);
        expect(q('[data-testid="hero"] [data-testid="carousel-next"]').getAttribute("aria-label")).toBe(labels[1]);
        expect(q('[data-testid="hero"] [data-testid="carousel-prev"]').getAttribute("aria-label")).toBe(labels[2]);
        const photos = all('[data-testid="hero"] img');
        expect(photos.map((img) => new URL(img.getAttribute("src"), "http://localhost").pathname)).toEqual(HOME_HERO_IMAGES.map((f) => `/images/${f}`));
        expect(photos.map((img) => img.getAttribute("loading"))).toEqual(["eager", "lazy", "lazy"]);
        expect(photos.every((img) => fs.existsSync(fileOf(img)))).toBe(true);
        expect(q('[data-testid="hero"] h1').className).toContain("whole-words");
        expect(q('[data-testid="hero-contact"]').getAttribute("href")).toBe(p("contact"));
    });

    test("the tabs: applications, industries and projects, each with its items; tap or click selects an item and shows its photo and link", () => {
        open(p("home"));
        const tabBtns = all('[data-testid="home-tabs"] [role="tab"]');
        expect(tabBtns.map((b) => b.textContent)).toEqual([S.nav.items.applications, S.nav.items.industries, S.nav.items.projects]);
        expect(tabBtns.map((b) => b.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
        expect(q('[data-testid="home-tabs"] [role="tabpanel"]')).not.toBeNull();
        // Applications: all of them, the first one selected with its photo and link
        let rows = all('[data-testid="tab-items"] > li > button');
        expect(rows.map((b) => b.textContent.slice(2))).toEqual(apps.map((a) => a.title));
        expect(rows[0].getAttribute("aria-current")).toBe("true");
        const photoPath = () => new URL(q('[data-testid="tab-photo"] img').getAttribute("src"), "http://localhost").pathname;
        expect(photoPath()).toBe(`/images/${APPLICATION_IMAGES[apps[0].id][0]}`);
        expect(q('[data-testid="tab-photo"] a').getAttribute("href")).toBe(`${p("applications")}/${apps[0].slug}`);
        // Tap the third application: it becomes the selected one and its photo and link show
        click(rows[2]);
        rows = all('[data-testid="tab-items"] > li > button');
        expect(rows.map((b) => b.getAttribute("aria-current"))).toEqual(rows.map((_, i) => (i === 2 ? "true" : null)));
        expect(photoPath()).toBe(`/images/${APPLICATION_IMAGES[apps[2].id][0]}`);
        expect(q('[data-testid="tab-photo"] img').getAttribute("alt")).toBe(apps[2].title);
        expect(q('[data-testid="tab-photo"] a').getAttribute("href")).toBe(`${p("applications")}/${apps[2].slug}`);
        expect(q('[data-testid="tab-photo"]').textContent).toContain(apps[2].short);
        expect(hrefs('[data-testid="home-tabs"] a')).toContain(p("applications"));
        // Industries
        click(tabBtns[1]);
        expect(all('[data-testid="home-tabs"] [role="tab"]').map((b) => b.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
        rows = all('[data-testid="tab-items"] > li > button');
        expect(rows.map((b) => b.textContent.slice(2))).toEqual(industries.map((i) => i.title));
        expect(photoPath()).toBe(`/images/${INDUSTRY_IMAGES[industries[0].id].photos[0]}`);
        expect(q('[data-testid="tab-photo"] a').getAttribute("href")).toBe(`${p("industries")}/${industries[0].slug}`);
        // Projects: one has no application, so no link, but its photo shows
        click(all('[data-testid="home-tabs"] [role="tab"]')[2]);
        rows = all('[data-testid="tab-items"] > li > button');
        expect(rows.map((b) => b.textContent.slice(2))).toEqual(S.projects.items.map((i) => i.title));
        expect(q('[data-testid="tab-photo"] a').getAttribute("href")).toBe(`${p("applications")}/${apps.find((a) => a.id === S.projects.items[0].application).slug}`);
        click(rows[5]);
        expect(photoPath()).toBe(`/images/${PROJECT_IMAGES[5]}`);
        expect(q('[data-testid="tab-photo"] a')).toBeNull();
    });

    test("the tabs work from the keyboard: arrow keys move between the tabs and Home / End jump to the first / last", () => {
        open(p("home"));
        const selected = () => all('[data-testid="home-tabs"] [role="tab"]').findIndex((b) => b.getAttribute("aria-selected") === "true");
        const first = () => all('[data-testid="home-tabs"] [role="tab"]')[0];
        keyDown(first(), "ArrowRight");
        expect(selected()).toBe(1);
        keyDown(all('[data-testid="home-tabs"] [role="tab"]')[1], "End");
        expect(selected()).toBe(2);
        keyDown(all('[data-testid="home-tabs"] [role="tab"]')[2], "ArrowRight");
        expect(selected()).toBe(0);
        keyDown(first(), "ArrowLeft");
        expect(selected()).toBe(2);
        keyDown(all('[data-testid="home-tabs"] [role="tab"]')[2], "Home");
        expect(selected()).toBe(0);
        expect(all('[data-testid="home-tabs"] [role="tab"]').map((b) => b.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
    });

    test("the photo slides show industries, the awards photo and the four figures, each from existing texts", () => {
        open(p("home"));
        const h = S.home;
        const recognized = S.whyUs[S.whyUs.length - 1];
        const slides = slide('[data-testid="photo-slides"]');
        expect(slides.map((el) => el.getAttribute("aria-label"))).toEqual([h.industriesTitle, recognized.t, h.statsNote]);
        expect(slides[0].textContent).toBe(h.industriesTitle + h.industriesCopy + S.nav.allIndustries);
        expect(slides[1].textContent).toBe(S.company.awardsTitle + recognized.t + recognized.d + h.introMore);
        expect(all('[data-testid="stats"] dd').map((d) => d.textContent)).toEqual(S.stats.map((x) => x.value));
        expect(all('[data-testid="stats"] dt').map((d) => d.textContent)).toEqual(S.stats.map((x) => x.label));
        expect(slides[2].textContent).toContain(h.statsNote);
        const photos = all('[data-testid="photo-slides"] img');
        expect(photos.map((img) => new URL(img.getAttribute("src"), "http://localhost").pathname)).toEqual([HOME_SLIDE_IMAGES.industries, HOME_SLIDE_IMAGES.awards, HOME_SLIDE_IMAGES.stats].map((f) => `/images/${f}`));
        expect(AWARD_IMAGES).toContain(HOME_SLIDE_IMAGES.awards);
        expect(photos.every((img) => fs.existsSync(fileOf(img)))).toBe(true);
        expect(hrefs('[data-testid="photo-slides"] a')).toEqual([p("industries"), p("company")]);
        // the next slide is reachable by its dot
        click(all('[data-testid="photo-slides"] [data-testid="carousel-dots"] button')[1]);
        expect(slide('[data-testid="photo-slides"]').map((el) => el.getAttribute("aria-hidden"))).toEqual(["true", "false", "true"]);
    });

    test("three 50/50 blocks and three image cards use the existing texts and images", () => {
        open(p("home"));
        const h = S.home;
        expect(q('[data-testid="intro"] h2').textContent).toBe(h.introTitle);
        expect(all('[data-testid="intro"] p').map((e) => e.textContent)).toEqual(h.introText);
        expect(q('[data-testid="intro"] a').getAttribute("href")).toBe(p("company"));
        expect(q('[data-testid="intro-photo"]').getAttribute("alt")).toBe(h.introTitle);
        expect(all('[data-testid="why-us"] h3').map((e) => e.textContent)).toEqual(S.whyUs.map((w) => w.t));
        expect(all('[data-testid="why-us"] li p').map((e) => e.textContent)).toEqual(S.whyUs.map((w) => w.d));
        expect(all('[data-testid="vision"] h2').map((e) => e.textContent)).toEqual([S.company.visionTitle, S.company.missionTitle]);
        expect(all('[data-testid="vision"] p').map((e) => e.textContent)).toEqual([S.company.visionText, S.company.missionText]);
        // image left, right, left
        expect(q('[data-testid="why-us"] img').parentElement.className).toContain("lg:order-2");
        expect(q('[data-testid="intro"] img').parentElement.className).not.toContain("lg:order-2");
        // cards: company, projects, career, photo on top
        const cardEls = all('[data-testid="cards"] li');
        expect(cardEls).toHaveLength(3);
        expect(all('[data-testid="cards"] h3').map((e) => e.textContent)).toEqual([S.company.title, S.projects.title, S.career.title]);
        expect(all('[data-testid="cards"] li p').map((e) => e.textContent)).toEqual([S.company.heroLead, S.projects.heroLead, S.career.heroLead]);
        expect(hrefs('[data-testid="cards"] a')).toEqual([p("company"), p("projects"), p("career")]);
        for (const li of cardEls) expect(li.querySelector("img")).not.toBeNull();
        expect(cardEls.every((li) => li.firstElementChild.firstElementChild.querySelector("img"))).toBe(true); // the photo comes first
        const photos = all('[data-testid="cards"] img');
        expect(photos.every((img) => fs.existsSync(fileOf(img)))).toBe(true);
        expect(q('[data-testid="cta-band"] h2').textContent).toBe(h.ctaTitle);
    });


    // Every kind of page: static pages, a detail page of each kind, the 404 page and the legal pages.
    const allUrls = () => [...Object.keys(PAGE_PATHS).map(p), `${p("applications")}/${apps[0].slug}`, `${p("industries")}/${industries[0].slug}`, `${p("applications")}/does-not-exist`];

    test("every page has the same white header and wide dark footer (no separate home version)", () => {
        for (const url of allUrls()) {
            open(url);
            expect(q('[data-testid="logo"] rect').getAttribute("fill")).toBe("#e1ff7c");
            expect(q('[data-testid="navbar"]').className).toContain("bg-white");
            expect(q('[data-testid="navbar"] nav a[href="' + p("company") + '"]')).not.toBeNull();
            expect(q('[data-testid="footer"]').className).toContain("bg-deep-950");
            expect(q('[data-testid="footer-address"]').textContent).toContain("Karlsruhe");
            expect(hrefs('[data-testid="footer"] a')).toContain(p("contact"));
            expect(q('[data-testid="nav-contact"]').getAttribute("href")).toBe(p("contact"));
            expect(container.firstElementChild.className).toContain("bg-deep-950");
        }
    });

    test("no page uses a class of the old navy, amber or slate palette; only the placeholder chip stays light amber", () => {
        for (const url of allUrls()) {
            open(url);
            const header = q('[data-testid="navbar"]'); // the header is white on purpose
            const classes = all("*").filter((el) => !header.contains(el)).map((el) => (typeof el.className === "string" ? el.className : "")).join(" ");
            expect(`${url}: ${classes.match(/(?<![a-z])(navy|amber|slate)-[\w/[\].]+/g) || []}`).toBe(`${url}: `);
            expect(` ${classes} `).not.toMatch(/\sbg-white\s|\stext-black\s/); // translucent white (bg-white/20) is the pill ring and fine
        }
    });

    test("every h1, h2 and h3 of every page is set in the display font with whole words; the h1 is a page title in the hero band", () => {
        for (const url of allUrls()) {
            open(url);
            expect(all("h1")).toHaveLength(1);
            expect(q('[data-testid="page-hero"] h1, [data-testid="hero"] h1')).not.toBeNull();
            for (const h of all("main h1, main h2, main h3, footer h3")) {
                const cls = h.className;
                expect(`${url} ${h.textContent.slice(0, 30)} ${/font-display/.test(cls)} ${/whole-words/.test(cls)}`).toBe(`${url} ${h.textContent.slice(0, 30)} true true`);
            }
        }
    });

    test("page titles: a title of several words has exactly one lime word, a one-word title stays white", () => {
        open(p("company"));
        expect(all("h1 span")).toHaveLength(1);
        expect(q("h1 span").textContent).toBe(S.company.heroTitle.split(" ").pop());
        open(p("events"));
        expect(S.events.title.split(" ")).toHaveLength(1);
        expect(all("h1 span")).toHaveLength(0);
    });

    test("every text on the home page is an existing text of the site (strings, application, industry and project data): nothing invented, nothing from the design reference", () => {
        open(p("home"));
        expect(container.textContent).not.toMatch(/lorem|ipsum|arobotic|youtube|logoipsum|testimonial|newsletter|\bblog\b|fanuc\.eu/i);
        const flat = (v) => (typeof v === "string" ? [v] : Array.isArray(v) ? [v.join(""), ...v.flatMap(flat)] : v && typeof v === "object" ? Object.values(v).flatMap(flat) : []);
        const moreApps = `${getMoreApplications(lang).map((m) => m.title).join(", ")}.`;
        const projectLinks = apps.map((a) => `${S.projects.toApplication} ${a.title}`);
        const knownList = [...flat(S), ...flat(apps), ...flat(industries), ...flat(getMoreApplications(lang)), moreApps, ...projectLinks, ...flat(COMPANY)];
        // The arrow of "Learn more →" is drawn as an icon, so the plain words are fine too.
        const known = new Set(knownList.flatMap((t) => [t.trim(), t.trim().replace(/\s*→$/, "")]));
        const textOf = (el) => el.textContent.trim();
        // Highlighted words sit inside a heading; the heading as a whole is checked below.
        const leaves = all("main *").filter((el) => textOf(el) && !el.closest("h1, h2, h3") && [...el.children].every((c) => ["svg", "img"].includes(c.tagName.toLowerCase())));
        const headings = all("main h1, main h2, main h3");
        const unknown = [...leaves, ...headings].map(textOf).filter((t) => !known.has(t) && !/^\d{2}$/.test(t));
        expect(unknown).toEqual([]);
        expect(leaves.length + headings.length).toBeGreaterThan(70); // a real page was checked
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

    test("the figures of the applications page use the wide layout and show the values unchanged", () => {
        open(p("applications"));
        expect(all('[data-testid="applications-figures"] dd').map((d) => d.textContent)).toEqual(S.applications.figures.map((f) => f.value));
        expect(q('[data-testid="applications-figures"] dl').className).toContain("xl:grid-cols-[repeat(4,auto)]");
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
