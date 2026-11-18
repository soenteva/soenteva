import { useId, useRef, useState } from "react";
import GlassCard from "@/components/GlassCard";
import Photo from "@/components/Photo";
import PillButton, { ArrowLink } from "@/components/PillButton";
import { ChevronDownIcon } from "@/components/icons";
import { useMediaQuery } from "@/lib/useMediaQuery";

// Tabs with a list of items each. The selected item shows its photo:
//  - on a wide screen the photo sits on the left of the list (hover or focus selects, click or tap selects too);
//  - on a phone or tablet the selected row opens in place with its photo, so the photo is always next to what was tapped.
// Everything is operable by tap, mouse and keyboard (arrow keys move between the tabs).
// `tabs` = [{ id, label, more: { to, label }, items: [{ key, title, text, to, linkLabel, image, alt }] }].
const num = (i) => String(i + 1).padStart(2, "0");

// The photo of an item. A new `key` per photo restarts the CSS fade-in; the photo itself is swapped at once.
function Detail({ item }) {
    return (
        <div key={item.image} className="photo-fade-in">
            <Photo file={item.image} alt={item.alt} className="aspect-[16/10] w-full object-cover" />
        </div>
    );
}

function Info({ item }) {
    if (!item.text && !item.to) return null;
    return (
        <div className="space-y-4 p-5 sm:p-6">
            {item.text && <p className="text-base leading-relaxed text-mist">{item.text}</p>}
            {item.to && <ArrowLink to={item.to}>{item.linkLabel}</ArrowLink>}
        </div>
    );
}

export default function TabbedSection({ tabs, testid }) {
    const uid = useId();
    const wide = useMediaQuery("(min-width: 1024px)");
    const [tab, setTab] = useState(0);
    const [active, setActive] = useState(0);
    const refs = useRef([]);
    const current = tabs[tab];
    const item = current.items[Math.min(active, current.items.length - 1)];
    const choose = (i) => { setTab(i); setActive(0); };
    const onKey = (e) => {
        const last = tabs.length - 1;
        const to = { ArrowRight: tab === last ? 0 : tab + 1, ArrowLeft: tab === 0 ? last : tab - 1, Home: 0, End: last }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        choose(to);
        refs.current[to]?.focus();
    };
    return (
        <div data-testid={testid}>
            <div role="tablist" className="flex flex-wrap gap-3" onKeyDown={onKey}>
                {tabs.map((t, i) => (
                    <button
                        key={t.id}
                        ref={(el) => { refs.current[i] = el; }}
                        type="button"
                        role="tab"
                        id={`${uid}-tab-${t.id}`}
                        aria-selected={i === tab}
                        aria-controls={`${uid}-panel`}
                        tabIndex={i === tab ? 0 : -1}
                        onClick={() => choose(i)}
                        className={`rounded-full border px-6 py-3 text-sm font-semibold transition-colors ${i === tab ? "border-lime bg-lime text-lime-ink" : "border-white/25 text-[#fffffd] hover:border-lime hover:text-lime"}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${current.id}`} className="mt-10">
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
                    {wide && (
                        <GlassCard tone="moss" className="lg:sticky lg:top-44" data-testid="tab-photo">
                            <Detail item={item} />
                            <Info item={item} />
                        </GlassCard>
                    )}
                    <ul className="border-t border-white/[.14]" data-testid="tab-items">
                        {current.items.map((it, i) => {
                            const on = it.key === item.key;
                            return (
                                <li key={it.key} className="border-b border-white/[.14]">
                                    <button
                                        type="button"
                                        aria-current={on ? "true" : undefined}
                                        aria-expanded={wide ? undefined : on}
                                        onClick={() => setActive(i)}
                                        onFocus={() => setActive(i)}
                                        onPointerEnter={(e) => { if (wide && e.pointerType === "mouse") setActive(i); }}
                                        className="flex w-full items-center justify-between gap-4 py-4 text-left"
                                    >
                                        <span className="flex items-baseline gap-4">
                                            <span className="font-display text-xs font-bold text-lime/80">{num(i)}</span>
                                            <span className={`font-display text-[clamp(0.85rem,3.6vw,1.05rem)] font-bold leading-snug whole-words transition-colors ${on ? "text-lime" : "text-[#fffffd]"}`}>{it.title}</span>
                                        </span>
                                        {!wide && <ChevronDownIcon className={`h-4 w-4 shrink-0 transition-transform ${on ? "rotate-180 text-lime" : "text-mist"}`} />}
                                    </button>
                                    {!wide && on && (
                                        <GlassCard tone="moss" className="mb-5" data-testid="tab-photo">
                                            <Detail item={it} />
                                            <Info item={it} />
                                        </GlassCard>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {current.more && <div className="mt-10"><PillButton to={current.more.to} variant="ghost" arrow={false}>{current.more.label}</PillButton></div>}
            </div>
        </div>
    );
}
