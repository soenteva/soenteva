import { useEffect, useState } from "react";

// True while the media query matches. False where matchMedia does not exist (the test DOM).
export function useMediaQuery(query) {
    const get = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches;
    const [matches, setMatches] = useState(get);
    useEffect(() => {
        if (typeof window.matchMedia !== "function") return undefined;
        const mq = window.matchMedia(query);
        const update = () => setMatches(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [query]);
    return matches;
}
