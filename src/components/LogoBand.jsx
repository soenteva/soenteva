import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import Photo from "@/components/Photo";
import { useMotionOk } from "@/lib/useMotionOk";

// One row of logo tiles. Each logo is a light tile, so logos made for white backgrounds stay legible on the dark page.
// With motion allowed the row glides back and forth (and pauses on hover); with reduced motion it is a plain
// row the visitor scrolls by hand. Every logo appears exactly once.
export default function LogoBand({ logos, className = "" }) {
    const ok = useMotionOk();
    const viewport = useRef(null);
    const track = useRef(null);

    useEffect(() => {
        const box = viewport.current;
        const row = track.current;
        if (!ok || !box || !row) return undefined;
        const distance = row.scrollWidth - box.clientWidth;
        if (distance <= 0) return undefined;
        const controls = animate(row, { x: [0, -distance, 0] }, { duration: distance / 45, ease: "linear", repeat: Infinity });
        const pause = () => controls.pause();
        const play = () => controls.play();
        box.addEventListener("pointerenter", pause);
        box.addEventListener("pointerleave", play);
        return () => {
            box.removeEventListener("pointerenter", pause);
            box.removeEventListener("pointerleave", play);
            controls.stop();
        };
    }, [ok, logos]);

    return (
        <div
            ref={viewport}
            className={`${ok ? "overflow-hidden" : "overflow-x-auto"} [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] ${className}`}
        >
            <ul ref={track} className="flex w-max gap-3 py-1">
                {logos.map((logo) => (
                    <li key={logo.file} className="flex h-20 w-36 shrink-0 items-center justify-center rounded-2xl bg-white/95 p-3 sm:h-24 sm:w-44 sm:p-4">
                        <Photo file={logo.file} alt={logo.name} className="h-full w-full object-contain" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
