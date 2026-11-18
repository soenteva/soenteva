import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import Carousel from "@/components/Carousel";
import HeroSlider from "@/components/HeroSlider";
import ImageCard from "@/components/ImageCard";
import PhotoSlides from "@/components/PhotoSlides";
import SplitBlock from "@/components/SplitBlock";
import TabbedSection from "@/components/TabbedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import DisplayHeading, { splitTitle } from "@/components/DisplayHeading";
import GlassCard from "@/components/GlassCard";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import IconRow from "@/components/IconRow";
import LogoBand from "@/components/LogoBand";
import PillButton, { ArrowLink, stripArrow } from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SplitImageSection from "@/components/SplitImageSection";
import StatBand, { StatGrid } from "@/components/StatBand";
import { ButtonEl, ButtonLink, Eyebrow, Ph, SectionHeading } from "@/components/ui";
import { RobotIcon } from "@/components/icons";
import { CLIENT_LOGOS } from "@/data/images";
import { STRINGS } from "@/i18n";

let container, root;
beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); delete window.IntersectionObserver; });

const render = (ui, url = "/en") => act(() => root.render(<MemoryRouter initialEntries={[url]}>{ui}</MemoryRouter>));
const q = (s) => container.querySelector(s);
const all = (s) => [...container.querySelectorAll(s)];

describe("DisplayHeading", () => {
    test("splitTitle highlights the given text, or the last word when none is given", () => {
        expect(splitTitle("The future of smart industrial automation.", "smart")).toEqual(["The future of ", "smart", " industrial automation."]);
        expect(splitTitle("Smart factory with smart robotics")).toEqual(["Smart factory with smart ", "robotics", ""]);
        expect(splitTitle("Smart factory with smart robotics", "smart")).toEqual(["Smart factory with ", "smart", " robotics"]); // last occurrence
        expect(splitTitle("Alpha beta", "gamma")).toEqual(["Alpha beta", "", ""]);
        expect(splitTitle("Impressum")).toEqual(["Impressum", "", ""]); // a single word stays white
        expect(splitTitle("Impressum", "Impressum")).toEqual(["", "Impressum", ""]); // unless a highlight is asked for
    });

    test("renders one heading with one highlighted lime span, keeping the full text", () => {
        render(<DisplayHeading as="h1" title="Recognized quality" />);
        expect(all("h1")).toHaveLength(1);
        expect(q("h1").textContent).toBe("Recognized quality");
        expect(all("h1 span")).toHaveLength(1);
        expect(q("h1 span").textContent).toBe("quality");
        expect(q("h1 span").className).toContain("text-lime");
        expect(q("h1").className).toContain("font-display");
    });

    test("never splits a word: no hyphenation, no breaking inside words, for every size", () => {
        render(<>{["hero", "xl", "lg", "md", "sm"].map((size) => <DisplayHeading key={size} title="One two" size={size} testid={size} />)}</>);
        for (const size of ["hero", "xl", "lg", "md", "sm"]) {
            expect(q(`[data-testid="${size}"]`).className).toContain("whole-words");
            expect(q(`[data-testid="${size}"]`).className).not.toMatch(/hyphens:auto|overflow-wrap:anywhere/);
        }
    });

    test("takes the three parts of the hero title and can be centered", () => {
        const [a, b, c] = STRINGS.en.home.heroTitle;
        render(<DisplayHeading as="h1" parts={[a, b, c]} align="center" testid="x" />);
        expect(q('[data-testid="x"]').textContent).toBe(a + b + c);
        expect(q("h1 span").textContent).toBe(b);
        expect(q("h1").className).toContain("text-center");
    });
});

describe("PillButton", () => {
    test("is a router link with the arrow icon, or a button without `to`", () => {
        render(<><PillButton to="/en/contact">Get in touch</PillButton><PillButton onClick={() => {}} arrow={false}>Send</PillButton></>);
        const link = q("a");
        expect(link.getAttribute("href")).toBe("/en/contact");
        expect(link.textContent).toBe("Get in touch");
        expect(link.querySelector("svg").getAttribute("aria-hidden")).toBe("true");
        const button = q("button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.querySelector("svg")).toBeNull();
    });

    test("passes data attributes on, and the ghost variant has no filled lime surface", () => {
        render(<PillButton to="/" variant="ghost" arrow={false} data-testid="ghost">Go</PillButton>);
        expect(q('[data-testid="ghost"]').textContent).toBe("Go");
        expect(q('[data-testid="ghost"] span').className).not.toContain("bg-lime");
    });

    test("stripArrow removes the arrow of the strings, ArrowLink draws it as an icon", () => {
        expect(stripArrow("Learn more →")).toBe("Learn more");
        expect(stripArrow("Mehr erfahren →")).toBe("Mehr erfahren");
        expect(stripArrow("Learn more")).toBe("Learn more");
        render(<ArrowLink to="/x">Learn more</ArrowLink>);
        expect(q("a").getAttribute("href")).toBe("/x");
        expect(q("a svg")).not.toBeNull();
    });
});

describe("GlassCard", () => {
    test("has the double frame: thin outer border around the inner surface that holds the content", () => {
        render(<GlassCard data-testid="card"><p>Text</p></GlassCard>);
        const outer = q('[data-testid="card"]');
        expect(outer.className).toContain("border");
        expect(outer.firstElementChild.className).toContain("overflow-hidden");
        expect(outer.firstElementChild.textContent).toBe("Text");
    });

    test("renders as a list item, marks the active card and knows the lime tone", () => {
        render(<ul><GlassCard as="li" tone="lime" active>One</GlassCard></ul>);
        expect(q("ul > li")).not.toBeNull();
        expect(q("li").className).toContain("border-lime/40");
        expect(q("li > div").className).toContain("bg-lime");
    });
});

describe("Section, IconRow", () => {
    test("Section draws the band with divider, tone and a test id", () => {
        render(<Section tone="dark" testid="band"><p>Inside</p></Section>);
        const s = q('[data-testid="band"]');
        expect(s.tagName).toBe("SECTION");
        expect(s.className).toContain("bg-deep-950");
        expect(s.className).toContain("border-t");
        expect(s.textContent).toBe("Inside");
    });

    test("IconRow shows the icon disc, the title and the text", () => {
        render(<ul><IconRow icon={RobotIcon} title="Robotics experience">Text of the item</IconRow></ul>);
        expect(q("li h3").textContent).toBe("Robotics experience");
        expect(q("li p").textContent).toBe("Text of the item");
        expect(q("li svg")).not.toBeNull();
    });
});

describe("StatBand", () => {
    const items = STRINGS.en.stats;
    test("lists every figure with its label in a description list, and the note", () => {
        render(<StatBand items={items} note="Figures of the group." />);
        expect(all('[data-testid="stats"] dl > div')).toHaveLength(items.length);
        expect(all("dd").map((d) => d.textContent)).toEqual(items.map((i) => i.value));
        expect(all("dt").map((d) => d.textContent)).toEqual(items.map((i) => i.label));
        expect(q('[data-testid="stats"]').textContent).toContain("Figures of the group.");
    });
    test("works without a note", () => {
        render(<StatBand items={items} />);
        expect(q('[data-testid="stats"] p')).toBeNull();
    });
});

describe("ui.jsx building blocks in the new style", () => {
    test("SectionHeading: lime label, display heading with one lime word, text", () => {
        render(<SectionHeading eyebrow="Goals" title="Our goals" copy="Text" testid="sh" />);
        expect(q('[data-testid="sh"] p').className).toContain("text-lime");
        expect(q("h2").textContent).toBe("Our goals");
        expect(q("h2 span").textContent).toBe("goals");
        expect(q("h2").className).toContain("whole-words");
        expect(all("p").map((p) => p.textContent)).toEqual(["Goals", "Text"]);
    });
    test("Eyebrow is a small lime label", () => {
        render(<Eyebrow>Label</Eyebrow>);
        expect(q("p").className).toContain("text-lime");
    });
    test("ButtonLink and ButtonEl are pill buttons: primary is lime, dark and outline become the outlined pill, no arrow", () => {
        render(<><ButtonLink to="/x">A</ButtonLink><ButtonLink to="/y" variant="dark">B</ButtonLink><ButtonEl type="submit" variant="outline">C</ButtonEl></>);
        const [a, b] = all("a");
        expect(a.getAttribute("href")).toBe("/x");
        expect(a.querySelector("span").className).toContain("bg-lime");
        expect(b.querySelector("span").className).not.toContain("bg-lime");
        expect(q("button").getAttribute("type")).toBe("submit");
        expect(all("svg")).toHaveLength(0);
    });
    test("Ph keeps the light amber chip so missing values stay visible", () => {
        render(<><Ph text="Telefonnummer folgt" /><Ph value="plain" /></>);
        expect(q("span.placeholder-mark").textContent).toBe("[Telefonnummer folgt]");
        expect(container.textContent).toContain("plain");
        expect(all(".placeholder-mark")).toHaveLength(1);
    });
});

describe("PageHero", () => {
    test("breadcrumb with home link, lime label, title as the only h1 and the lead text", () => {
        render(<PageHero eyebrow="Company" title="About Sönteva and IRTI Robotics" lead="Lead text" crumbs={[{ label: "Company" }]} />);
        expect(q("nav a").getAttribute("href")).toBe("/en");
        expect(all("nav li").map((l) => l.textContent)).toEqual(["Home", "/Company"]);
        expect(all("h1")).toHaveLength(1);
        expect(q("h1 span").textContent).toBe("Robotics");
        expect(q("p.text-lg").textContent).toBe("Lead text");
        expect(q('[data-testid="page-hero"]').className).toContain("linear-gradient");
    });
    test("works without breadcrumb, label and lead", () => {
        render(<PageHero title="Impressum" />);
        expect(q("nav")).toBeNull();
        expect(q("h1").textContent).toBe("Impressum");
        expect(all("h1 span")).toHaveLength(0);
    });
});

describe("StatGrid", () => {
    const long = [{ value: "99 %", label: "A" }, { value: "30 bis 60 %", label: "B" }, { value: "200+", label: "C" }, { value: "0,001 mm", label: "D" }];
    test("is the figures card on its own, without the band", () => {
        render(<StatGrid items={[{ value: "1", label: "One" }, { value: "2", label: "Two" }]} />);
        expect(all("dd").map((d) => d.textContent)).toEqual(["1", "2"]);
        expect(q("section")).toBeNull();
    });
    test("the default layout keeps the big numbers, two columns on a phone and four from tablet width", () => {
        render(<StatGrid items={long} />);
        expect(q("dl").className).toContain("grid-cols-2");
        expect(q("dl").className).toContain("md:grid-cols-4");
        expect(q("dd").className).toContain("xl:text-[3.4rem]");
        expect(q("dd").className).toContain("lg:text-[2.75rem]"); // 1000+ still fits its column at 1024 px
        expect(q("dd").className).not.toContain("whitespace-nowrap");
    });
    test("wide: long values stay on one line with smaller numbers; one column, then two by two, then four sized to their content", () => {
        render(<StatGrid items={long} wide />);
        expect(all("dd").map((d) => d.textContent)).toEqual(["99 %", "30 bis 60 %", "200+", "0,001 mm"]); // texts unchanged
        expect(q("dl").className).toContain("grid-cols-1");
        expect(q("dl").className).toContain("md:grid-cols-2");
        expect(q("dl").className).toContain("xl:grid-cols-[repeat(4,auto)]");
        for (const dd of all("dd")) {
            expect(dd.className).toContain("whitespace-nowrap");
            expect(dd.className).toContain("lg:text-[2.5rem]");
            expect(dd.className).toContain("leading-[1.2]"); // lines can no longer touch
            expect(dd.className).not.toContain("leading-none");
        }
        // Dividers only where the four figures share one row.
        const cells = [...q("dl").children];
        expect(cells[0].className).not.toContain("border-l");
        expect(cells.slice(1).every((c) => c.className.includes("xl:border-l") && !c.className.includes("md:border-l"))).toBe(true);
    });
});

describe("LogoBand", () => {
    test("shows every logo exactly once, on a light tile, with the company name as alt text", () => {
        render(<LogoBand logos={CLIENT_LOGOS} />);
        expect(all("li")).toHaveLength(CLIENT_LOGOS.length);
        expect(all("img").map((i) => i.getAttribute("alt"))).toEqual(CLIENT_LOGOS.map((l) => l.name));
        expect(all("li").every((li) => li.className.includes("bg-white"))).toBe(true);
        expect(all("img").every((i) => i.getAttribute("loading") === "lazy")).toBe(true);
    });
    test("scrolls by hand (no hidden overflow) only when motion is reduced: see reducedMotion.test.jsx; otherwise it glides", () => {
        render(<LogoBand logos={CLIENT_LOGOS.slice(0, 3)} />);
        expect(q("div").className).toContain("overflow-hidden");
    });
});

describe("SplitImageSection", () => {
    test("framed: card with the image next to the content", () => {
        render(<SplitImageSection image="fanuc/fanuc-robot-home.webp" alt="Intro" imageTestid="pic" testid="split"><h2>Content</h2></SplitImageSection>);
        expect(q('[data-testid="pic"]').getAttribute("alt")).toBe("Intro");
        expect(q('[data-testid="pic"]').getAttribute("src")).toContain("/images/fanuc/fanuc-robot-home.webp");
        expect(q('[data-testid="split"] h2').textContent).toBe("Content");
    });
    test("bleed: image fills half the page on one side, the content sits on the panel; the side can be switched", () => {
        render(<SplitImageSection variant="bleed" imageSide="right" image="fanuc/fanuc-cell.webp" alt="Values" testid="split"><h2>Content</h2></SplitImageSection>);
        const img = q('[data-testid="split"] img');
        expect(img.getAttribute("alt")).toBe("Values");
        expect(img.className).toContain("object-cover");
        expect(img.parentElement.className).toContain("lg:order-2");
        expect(q('[data-testid="split"]').className).toContain("bg-deep-600");
    });
});

describe("CtaBand", () => {
    test.each([["en", "Send inquiry", "/en/contact"], ["de", "Anfrage senden", "/kontakt"]])("%s: heading with highlight, text and a button to the contact page", (lang, label, href) => {
        render(<CtaBand title="Let's automate smarter together" text="Talk to us." />, lang === "en" ? "/en" : "/");
        expect(q('[data-testid="cta-band"] h2').textContent).toBe("Let's automate smarter together");
        expect(q("h2 span").textContent).toBe("together");
        expect(q("p").textContent).toBe("Talk to us.");
        expect(q("a").textContent).toBe(label);
        expect(q("a").getAttribute("href")).toBe(href);
    });
});

describe("Reveal", () => {
    test("shows its content right away when the browser cannot observe scrolling", () => {
        render(<Reveal className="x"><p>Visible</p></Reveal>);
        expect(q(".x").getAttribute("style")).toBeNull();
        expect(q(".x").textContent).toBe("Visible");
    });
    test("starts hidden and lifted when the browser can observe scrolling and motion is allowed", () => {
        window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
        render(<Reveal className="x"><p>Appears</p></Reveal>);
        expect(q(".x").getAttribute("style")).toContain("opacity: 0");
        expect(q(".x").textContent).toBe("Appears");
    });
});

// ---------------------------------------------------------------- slides, tabs, blocks, header, footer
const key = (el, k) => act(() => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true })));
const tap = (el) => act(() => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })));
const slidesOf = (labels) => labels.map((label) => ({ key: label, label, render: () => <p>{label} text</p> }));
const hiddenFlags = () => all('[aria-roledescription="slide"]').map((el) => el.getAttribute("aria-hidden"));
const currentDot = () => all('[data-testid="carousel-dots"] button').findIndex((b) => b.getAttribute("aria-current") === "true");

describe("Carousel", () => {
    afterEach(() => { jest.useRealTimers(); });

    test("shows one slide, keeps the others hidden from keyboard and screen readers, dots and arrows are named after the slides", () => {
        render(<Carousel slides={slidesOf(["A", "B", "C"])} />);
        expect(hiddenFlags()).toEqual(["false", "true", "true"]);
        expect(all('[aria-roledescription="slide"]').map((el) => el.hasAttribute("inert"))).toEqual([false, true, true]);
        expect(all('[data-testid="carousel-dots"] button').map((b) => b.getAttribute("aria-label"))).toEqual(["A", "B", "C"]);
        expect(q('[data-testid="carousel-next"]').getAttribute("aria-label")).toBe("B");
        expect(q('[data-testid="carousel-prev"]').getAttribute("aria-label")).toBe("C");
        expect(q('[aria-roledescription="carousel"]').getAttribute("aria-label")).toBe("A");
    });

    test("dots, the next and previous arrows change the slide and wrap around", () => {
        render(<Carousel slides={slidesOf(["A", "B", "C"])} />);
        tap(q('[data-testid="carousel-next"]'));
        expect(hiddenFlags()).toEqual(["true", "false", "true"]);
        tap(q('[data-testid="carousel-prev"]'));
        tap(q('[data-testid="carousel-prev"]'));
        expect(hiddenFlags()).toEqual(["true", "true", "false"]); // wrapped to the last slide
        tap(q('[data-testid="carousel-next"]'));
        expect(currentDot()).toBe(0);
        tap(all('[data-testid="carousel-dots"] button')[2]);
        expect(currentDot()).toBe(2);
    });

    test("a swipe of the finger changes the slide, a tiny movement does not", () => {
        render(<Carousel slides={slidesOf(["A", "B", "C"])} />);
        const box = q('[aria-roledescription="carousel"]');
        const drag = (from, to) => { act(() => box.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: from }))); act(() => box.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: to }))); };
        drag(300, 100);
        expect(currentDot()).toBe(1); // swipe left: next
        drag(100, 300);
        expect(currentDot()).toBe(0); // swipe right: previous
        drag(200, 190);
        expect(currentDot()).toBe(0);
    });

    test("auto-advance moves on after the interval, pauses while the pointer or focus is on it and goes on afterwards", () => {
        jest.useFakeTimers();
        render(<Carousel autoplay interval={1000} slides={slidesOf(["A", "B", "C"])} />);
        act(() => { jest.advanceTimersByTime(1000); });
        expect(currentDot()).toBe(1);
        act(() => { jest.advanceTimersByTime(1000); });
        expect(currentDot()).toBe(2);
        const box = q('[aria-roledescription="carousel"]');
        act(() => box.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
        act(() => { jest.advanceTimersByTime(5000); });
        expect(currentDot()).toBe(2); // paused
        act(() => box.dispatchEvent(new MouseEvent("mouseout", { bubbles: true })));
        act(() => { jest.advanceTimersByTime(1000); });
        expect(currentDot()).toBe(0); // wrapped round
    });

    test("without autoplay it never moves by itself; with a single slide there are no controls", () => {
        jest.useFakeTimers();
        render(<Carousel slides={slidesOf(["A", "B"])} />);
        act(() => { jest.advanceTimersByTime(60000); });
        expect(currentDot()).toBe(0);
        render(<Carousel slides={slidesOf(["Only"])} />);
        expect(q('[data-testid="carousel-dots"]')).toBeNull();
    });
});

describe("HeroSlider and PhotoSlides", () => {
    const slides = [
        { key: "a", label: "First", image: "applications/assembly.webp", children: <h1>First text</h1> },
        { key: "b", label: "Second", image: "industries/pick-place.webp", side: "right", children: <h2>Second text</h2> },
    ];
    test("HeroSlider: a photo per slide behind the text, the first photo loads at once, the text sits in the slide", () => {
        render(<HeroSlider slides={slides} />);
        expect(q('[data-testid="hero"]').tagName).toBe("SECTION");
        expect(all("img").map((i) => i.getAttribute("loading"))).toEqual(["eager", "lazy"]);
        expect(all("img").map((i) => i.getAttribute("alt"))).toEqual(["First", "Second"]);
        expect(all('[aria-roledescription="slide"]').map((el) => el.textContent)).toEqual(["First text", "Second text"]);
        expect(q('[aria-roledescription="slide"] .bg-gradient-to-r')).not.toBeNull(); // dark overlay
    });
    test("PhotoSlides: the dark panel lies over the chosen side of the photo", () => {
        render(<PhotoSlides slides={[{ ...slides[0], side: "left" }, slides[1]]} />);
        const rows = all('[aria-roledescription="slide"] .relative.flex.py-14');
        expect(rows.map((r) => r.className.includes("justify-end"))).toEqual([false, true]);
        expect(all('[aria-roledescription="slide"] .backdrop-blur-sm').map((el) => el.textContent)).toEqual(["First text", "Second text"]);
        expect(q('[data-testid="photo-slides"]').className).toContain("overflow-hidden");
    });
    test("PhotoSlides: the slides grow with the width on wide screens (600px up to 900px), so less of the photo is cropped, and the photo stays undistorted", () => {
        render(<PhotoSlides slides={slides} />);
        const rows = all('[aria-roledescription="slide"] > .relative.flex');
        expect(rows).toHaveLength(2);
        rows.forEach((r) => {
            expect(r.className).toContain("sm:min-h-[520px]");
            expect(r.className).toContain("lg:min-h-[clamp(600px,50vw,900px)]");
        });
        all("img").forEach((i) => expect(i.className).toContain("object-cover"));
    });
});

describe("TabbedSection", () => {
    const tabs = [
        { id: "one", label: "One", more: { to: "/en/applications", label: "All" }, items: [
            { key: "a", title: "Alpha", text: "About alpha", to: "/en/applications/alpha", linkLabel: "Learn more", image: "applications/assembly.webp", alt: "Alpha" },
            { key: "b", title: "Beta", text: "About beta", to: "/en/applications/beta", linkLabel: "Learn more", image: "industries/pick-place.webp", alt: "Beta" },
        ] },
        { id: "two", label: "Two", items: [{ key: "c", title: "Gamma", text: "", to: "", linkLabel: "", image: "fanuc/fanuc.webp", alt: "Gamma" }] },
    ];
    const src = () => new URL(q('[data-testid="tab-photo"] img').getAttribute("src"), "http://localhost").pathname;
    afterEach(() => { delete window.matchMedia; });

    test("phone and touch: a tap on an item opens it in place with its own photo, text and link; one item is always open", () => {
        render(<TabbedSection tabs={tabs} testid="t" />);
        expect(all('[role="tab"]').map((b) => b.getAttribute("aria-selected"))).toEqual(["true", "false"]);
        expect(all('[data-testid="tab-photo"]')).toHaveLength(1);
        expect(src()).toBe("/images/applications/assembly.webp");
        const rows = all('[data-testid="tab-items"] > li > button');
        expect(rows.map((b) => b.getAttribute("aria-expanded"))).toEqual(["true", "false"]);
        tap(rows[1]);
        expect(all('[data-testid="tab-items"] > li > button').map((b) => b.getAttribute("aria-expanded"))).toEqual(["false", "true"]);
        expect(src()).toBe("/images/industries/pick-place.webp");
        expect(q('[data-testid="tab-photo"]').textContent).toContain("About beta");
        expect(q('[data-testid="tab-photo"] a').getAttribute("href")).toBe("/en/applications/beta");
        expect(q('[data-testid="tab-photo"] .photo-fade-in')).not.toBeNull(); // a CSS fade, not a script animation
        expect(q('[data-testid="tab-items"] > li:nth-child(2)').contains(q('[data-testid="tab-photo"]'))).toBe(true); // the photo sits in the tapped row
    });

    test("a tab switch shows that tab's items, starts at the first item, and an item without link or text shows only its photo", () => {
        render(<TabbedSection tabs={tabs} testid="t" />);
        tap(all('[data-testid="tab-items"] > li > button')[1]);
        tap(all('[role="tab"]')[1]);
        expect(all('[data-testid="tab-items"] > li').map((li) => li.querySelector("button span:last-child").textContent)).toEqual(["Gamma"]);
        expect(src()).toBe("/images/fanuc/fanuc.webp");
        expect(q('[data-testid="tab-photo"] a')).toBeNull();
        expect(q('[data-testid="tab-photo"] p')).toBeNull();
        tap(all('[role="tab"]')[0]);
        expect(all('[data-testid="tab-items"] > li > button')[0].getAttribute("aria-expanded")).toBe("true"); // back at the first item
    });

    test("wide screen: the photo stands left of the list and follows a click or keyboard focus on an item, swapped at once", () => {
        window.matchMedia = (query) => ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} });
        render(<TabbedSection tabs={tabs} testid="t" />);
        const photo = q('[data-testid="tab-photo"]');
        expect(q('[data-testid="tab-items"]').contains(photo)).toBe(false);
        expect(src()).toBe("/images/applications/assembly.webp");
        act(() => all('[data-testid="tab-items"] > li > button')[1].focus());
        expect(src()).toBe("/images/industries/pick-place.webp");
        tap(all('[data-testid="tab-items"] > li > button')[0]);
        expect(src()).toBe("/images/applications/assembly.webp");
        expect(all('[data-testid="tab-items"] > li > button').every((b) => !b.hasAttribute("aria-expanded"))).toBe(true);
        expect(q('[role="tabpanel"] a[href="/en/applications"]').textContent).toBe("All");
    });

    test("the tabs form a proper tablist: arrow keys, roving tab index, panel named by its tab", () => {
        render(<TabbedSection tabs={tabs} testid="t" />);
        const tabEls = () => all('[role="tab"]');
        key(tabEls()[0], "ArrowRight");
        expect(tabEls().map((b) => b.getAttribute("aria-selected"))).toEqual(["false", "true"]);
        expect(tabEls().map((b) => b.tabIndex)).toEqual([-1, 0]);
        expect(q('[role="tabpanel"]').getAttribute("aria-labelledby")).toBe(tabEls()[1].id);
        expect(tabEls()[0].getAttribute("aria-controls")).toBe(q('[role="tabpanel"]').id);
        key(tabEls()[1], "ArrowLeft");
        expect(tabEls()[0].getAttribute("aria-selected")).toBe("true");
    });
});

describe("SplitBlock and ImageCard", () => {
    test("SplitBlock: photo and text in two halves; the photo side and the tone can be switched", () => {
        render(<><SplitBlock image="fanuc/fanuc.webp" alt="A" testid="x" imageSide="right" tone="dark"><p>Text</p></SplitBlock><SplitBlock image="fanuc/fanuc-cell.webp" alt="B" testid="y"><p>Other</p></SplitBlock></>);
        expect(q('[data-testid="x"]').className).toContain("bg-deep-950");
        expect(q('[data-testid="y"]').className).toContain("bg-deep-800");
        expect(q('[data-testid="x"] img').parentElement.className).toContain("lg:order-2");
        expect(q('[data-testid="y"] img').parentElement.className).not.toContain("lg:order-2");
        expect(q('[data-testid="x"] .grid').className).toContain("lg:grid-cols-2");
        expect(q('[data-testid="x"]').textContent).toBe("Text");
    });
    test("ImageCard: photo on top, then title, text and a link", () => {
        render(<ul><ImageCard image="fanuc/fanuc.webp" alt="Alt" title="Title" text="Text" to="/en/company" linkLabel="Learn more" /></ul>);
        const li = q("li");
        expect(li.firstElementChild.firstElementChild.querySelector("img").getAttribute("alt")).toBe("Alt"); // photo first
        expect(li.querySelector("h3").textContent).toBe("Title");
        expect(li.querySelector("p").textContent).toBe("Text");
        expect(li.querySelector("a").getAttribute("href")).toBe("/en/company");
        expect(li.className).toContain("group");
    });
});

describe("white header and wide dark footer", () => {
    test("Navbar: white, logo and language switch on top, the navigation row below with the contact button inside it; burger on small screens", () => {
        render(<Navbar />);
        const header = q('[data-testid="navbar"]');
        expect(header.className).toContain("bg-white");
        expect(q('[data-testid="navbar"] nav').className).toContain("justify-between");
        expect(all("nav a").map((a) => a.getAttribute("href"))).toEqual(expect.arrayContaining(["/en/company", "/en/projects", "/en/industries", "/en/applications", "/en/career", "/en/events", "/en/contact"]));
        expect(q('[data-testid="nav-contact"]').closest("nav")).not.toBeNull();
        expect(q('[data-testid="menu-toggle"]').parentElement.className).toContain("lg:hidden");
        expect(q('[data-testid="lang-switch"]').parentElement.className).toContain("hidden");
        expect(q('[data-testid="logo"] svg rect').getAttribute("stroke")).toBe("#022d33"); // the lime mark gets an outline on white
        tap(q('[data-testid="menu-toggle"]'));
        expect(q('[data-testid="mobile-menu"]').className).toContain("bg-white");
        expect(all('[data-testid="mobile-menu"] a').length).toBeGreaterThan(20);
    });
    test("Logo: dark tone by default (no outline, white name), light tone for white backgrounds", () => {
        render(<><Logo /><Logo tone="light" /></>);
        const [dark, light] = all('[data-testid="logo"]');
        expect(dark.querySelector("rect").getAttribute("stroke")).toBe("none");
        expect(dark.querySelector("span span").className).toContain("text-[#fffffd]");
        expect(light.querySelector("span span").className).toContain("text-deep-800");
    });
    test("Footer: full width, lime top edge, columns of content, all ten applications, address, legal links", () => {
        render(<Footer />);
        const f = q('[data-testid="footer"]');
        expect(f.className).toContain("bg-deep-950");
        expect(f.className).toContain("border-lime");
        expect(f.firstElementChild.className).toContain("lg:grid-cols-[13rem_1fr_2fr_1.2fr]");
        expect(f.firstElementChild.className).toContain("max-w-[1440px]");
        expect(all('[data-testid="footer"] ul')[1].querySelectorAll("li")).toHaveLength(10);
        expect(q('[data-testid="footer-address"]').textContent).toContain("Karlsruhe");
        const links = all('[data-testid="footer"] a').map((a) => a.getAttribute("href"));
        expect(links).toEqual(expect.arrayContaining(["/en/legal-notice", "/en/privacy", "/en/contact", "/en/events"]));
    });
});
