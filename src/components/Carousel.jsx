import { useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useCarousel } from "@/lib/useCarousel";
import { useMotionOk } from "@/lib/useMotionOk";

// Slide show: all slides sit on top of each other (the tallest decides the height), the current one fades in.
// Dots and arrows are labelled with the heading of the slide they lead to (no extra texts); swipe works on touch.
// `slides` = [{ key, label, render(active) }]. Auto-advance (`autoplay`) pauses on hover and focus and is off
// with reduced motion; the slides then change only by the visitor's choice, without animation.
export default function Carousel({ slides, autoplay = false, interval = 7000, arrows = true, className = "", controlsClassName = "", testid }) {
    const ok = useMotionOk();
    const c = useCarousel(slides.length, { autoplay, interval });
    const start = useRef(null);
    const many = slides.length > 1;
    const target = (i) => slides[(i + slides.length) % slides.length].label;
    return (
        <div
            className={`relative touch-pan-y ${className}`}
            role="group"
            aria-roledescription="carousel"
            aria-label={slides[c.index].label}
            data-testid={testid}
            onMouseEnter={() => c.setPaused(true)}
            onMouseLeave={() => c.setPaused(false)}
            onFocus={() => c.setPaused(true)}
            onBlur={() => c.setPaused(false)}
            onPointerDown={(e) => { start.current = e.clientX; }}
            onPointerUp={(e) => {
                if (start.current == null) return;
                const dx = e.clientX - start.current;
                start.current = null;
                if (Math.abs(dx) > 50) (dx < 0 ? c.next : c.prev)();
            }}
            onPointerCancel={() => { start.current = null; }}
        >
            <div className="grid" aria-live={c.autoplayOn && !c.paused ? "off" : "polite"}>
                {slides.map((s, i) => {
                    const active = i === c.index;
                    return (
                        <motion.div
                            key={s.key}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={s.label}
                            aria-hidden={!active}
                            inert={!active}
                            className="[grid-area:1/1]"
                            initial={false}
                            animate={{ opacity: active ? 1 : 0 }}
                            transition={{ duration: ok ? 0.7 : 0 }}
                            style={{ pointerEvents: active ? "auto" : "none", zIndex: active ? 1 : 0 }}
                            data-active={active}
                        >
                            {s.render(active)}
                        </motion.div>
                    );
                })}
            </div>
            {many && (
                <div className={`pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-4 sm:bottom-7 ${controlsClassName}`}>
                    {arrows && (
                        <button type="button" onClick={c.prev} aria-label={target(c.index - 1)} className="pointer-events-auto hidden h-11 w-11 place-items-center rounded-full border border-white/30 bg-deep-950/60 text-white backdrop-blur transition-colors hover:border-lime hover:bg-lime hover:text-lime-ink sm:grid" data-testid="carousel-prev">
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                    )}
                    <div className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-deep-950/55 px-4 py-2.5 backdrop-blur" data-testid="carousel-dots">
                        {slides.map((s, i) => (
                            <button
                                key={s.key}
                                type="button"
                                onClick={() => c.go(i)}
                                aria-label={s.label}
                                aria-current={i === c.index ? "true" : undefined}
                                className={`h-2.5 rounded-full transition-all duration-300 ${i === c.index ? "w-8 bg-lime" : "w-2.5 bg-white/50 hover:bg-white"}`}
                            />
                        ))}
                    </div>
                    {arrows && (
                        <button type="button" onClick={c.next} aria-label={target(c.index + 1)} className="pointer-events-auto hidden h-11 w-11 place-items-center rounded-full border border-white/30 bg-deep-950/60 text-white backdrop-blur transition-colors hover:border-lime hover:bg-lime hover:text-lime-ink sm:grid" data-testid="carousel-next">
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
