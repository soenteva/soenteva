import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { BentoColumn, BentoGrid } from "@/components/BentoGrid";
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

describe("Section, BentoGrid, IconRow", () => {
    test("Section draws the band with divider, tone and a test id", () => {
        render(<Section tone="dark" testid="band"><p>Inside</p></Section>);
        const s = q('[data-testid="band"]');
        expect(s.tagName).toBe("SECTION");
        expect(s.className).toContain("bg-deep-950");
        expect(s.className).toContain("border-t");
        expect(s.textContent).toBe("Inside");
    });

    test("BentoGrid keeps its columns in order and raises the marked column", () => {
        render(<BentoGrid data-testid="grid"><BentoColumn>A</BentoColumn><BentoColumn>B</BentoColumn><BentoColumn raised>C</BentoColumn></BentoGrid>);
        const cols = [...q('[data-testid="grid"]').children];
        expect(cols.map((c) => c.textContent)).toEqual(["A", "B", "C"]);
        expect(cols[2].className).toContain("lg:-mt-");
        expect(cols[0].className).not.toContain("lg:-mt-");
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
        render(<SplitImageSection variant="bleed" imageSide="right" image="fanuc/fanuc-robot-values.webp" alt="Values" testid="split"><h2>Content</h2></SplitImageSection>);
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
