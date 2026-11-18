import { useCallback, useEffect, useState } from "react";
import { useMotionOk } from "@/lib/useMotionOk";

// State of a slide show: the current slide, next/previous/go, and optional auto-advance.
// Auto-advance runs only when motion is allowed (not with reduced motion), pauses while `paused` is set
// (hover, keyboard focus) and restarts its timer after every change of slide.
export function useCarousel(count, { autoplay = false, interval = 7000 } = {}) {
    const ok = useMotionOk();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);
    const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
    const autoplayOn = autoplay && ok && count > 1;
    useEffect(() => {
        if (!autoplayOn || paused) return undefined;
        const id = setTimeout(next, interval);
        return () => clearTimeout(id);
    }, [autoplayOn, paused, index, interval, next]);
    return { index, go, next, prev, paused, setPaused, autoplayOn };
}
