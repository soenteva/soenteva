import { motion } from "motion/react";
import { useMotionOk } from "@/lib/useMotionOk";

// Card with the double frame of the reference: a thin outer border and an inner rounded surface.
const TONES = {
    teal: { outer: "border-white/[.12]", inner: "bg-gradient-to-b from-[#12393e] to-[#03282e]" },
    slate: { outer: "border-white/[.1]", inner: "bg-[#152a2d]" },
    lime: { outer: "border-lime/30 bg-lime/20", inner: "bg-lime text-lime-ink" },
    glow: { outer: "border-white/[.1]", inner: "bg-[linear-gradient(135deg,#172b32_0%,#2d4538_45%,#577144_100%)]" },
    moss: { outer: "border-white/[.12]", inner: "bg-[linear-gradient(160deg,#17353a_0%,#2f5240_55%,#4a6b3f_100%)]" },
};

const RADIUS = { card: "rounded-[2.25rem] p-3 sm:p-4", pill: "rounded-[2.5rem] p-2.5 sm:p-3.5" };
const INNER_RADIUS = { card: "rounded-[1.6rem]", pill: "rounded-[2rem]" };

// `hover` lifts the card on hover (not with reduced motion), `active` marks it with a lime frame,
// `shape="pill"` is the wide, rounder variant used for list rows.
export default function GlassCard({ as = "div", tone = "teal", shape = "card", hover = false, active = false, className = "", innerClassName = "", children, ...rest }) {
    const ok = useMotionOk();
    const Tag = motion[as];
    const t = TONES[tone];
    return (
        <Tag
            className={`border ${RADIUS[shape]} ${active ? "border-lime/40" : t.outer} ${className}`}
            {...(hover && ok ? { whileHover: { y: -6 }, transition: { type: "spring", stiffness: 320, damping: 24 } } : {})}
            {...rest}
        >
            <div className={`relative h-full overflow-hidden ${INNER_RADIUS[shape]} ${t.inner} ${innerClassName}`}>{children}</div>
        </Tag>
    );
}
