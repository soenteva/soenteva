import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import Carousel from "@/components/Carousel";
import LogoBand from "@/components/LogoBand";
import TabbedSection from "@/components/TabbedSection";
import PillButton from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import { CLIENT_LOGOS } from "@/data/images";

// A visitor who asked for reduced motion: no scroll reveal, no gliding logo row, no hover movement.
let container, root;
beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {}); // motion prints a developer notice when reduced motion is on
    window.matchMedia = (query) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
    });
    window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});
beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

const render = (ui) => act(() => root.render(<MemoryRouter>{ui}</MemoryRouter>));

test("Reveal shows its content at once, without opacity or transform styles", () => {
    render(<Reveal className="x"><p>Visible</p></Reveal>);
    expect(q(".x").getAttribute("style")).toBeNull();
});

test("LogoBand becomes a row the visitor scrolls by hand, with every logo still there once", () => {
    render(<LogoBand logos={CLIENT_LOGOS} />);
    expect(q("div").className).toContain("overflow-x-auto");
    expect(q("div").className).not.toContain("overflow-hidden");
    expect(container.querySelectorAll("img")).toHaveLength(CLIENT_LOGOS.length);
});

test("buttons and cards still render and work, without hover motion props", () => {
    render(<><PillButton to="/kontakt">Kontakt</PillButton><GlassCard hover data-testid="c">Card</GlassCard></>);
    expect(container.querySelector("a").getAttribute("href")).toBe("/kontakt");
    expect(container.querySelector('[data-testid="c"]').textContent).toBe("Card");
    expect(container.querySelector('[data-testid="c"]').getAttribute("style")).toBeNull();
});

test("the hero slider does not move by itself, and a slide change is instant (no fade)", () => {
    jest.useFakeTimers();
    const slides = ["A", "B", "C"].map((label) => ({ key: label, label, render: () => <p>{label}</p> }));
    render(<Carousel autoplay interval={1000} slides={slides} />);
    const dot = () => [...container.querySelectorAll('[data-testid="carousel-dots"] button')].findIndex((b) => b.getAttribute("aria-current") === "true");
    act(() => { jest.advanceTimersByTime(30000); });
    expect(dot()).toBe(0);
    act(() => container.querySelector('[data-testid="carousel-next"]').dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })));
    expect(dot()).toBe(1);
    expect([...container.querySelectorAll('[aria-roledescription="slide"]')].map((el) => el.getAttribute("aria-hidden"))).toEqual(["true", "false", "true"]);
    jest.useRealTimers();
});

test("the tabs still work, with the photo changing without animation", () => {
    const tabs = [{ id: "a", label: "A", items: [
        { key: "1", title: "One", text: "t1", to: "/x", linkLabel: "More", image: "applications/assembly.webp", alt: "One" },
        { key: "2", title: "Two", text: "t2", to: "/y", linkLabel: "More", image: "industries/pick-place.webp", alt: "Two" },
    ] }];
    render(<TabbedSection tabs={tabs} />);
    act(() => container.querySelectorAll('[data-testid="tab-items"] > li > button')[1].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })));
    expect(container.querySelector('[data-testid="tab-photo"] img').getAttribute("alt")).toBe("Two");
    expect(container.querySelector('[data-testid="tab-photo"] [style]')).toBeNull(); // no script-animated wrapper
    // the fade is a CSS animation; index.css switches every animation off for reduced motion
    expect(require("fs").readFileSync("src/index.css", "utf8")).toMatch(/prefers-reduced-motion: reduce[\s\S]*animation: none !important/);
});

function q(s) { return container.querySelector(s); }
