import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import LogoBand from "@/components/LogoBand";
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

function q(s) { return container.querySelector(s); }
