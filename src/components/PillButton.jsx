import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowCircleIcon } from "@/components/icons";
import { useMotionOk } from "@/lib/useMotionOk";

// "Learn more →" in the strings: the arrow is drawn as an icon here.
export const stripArrow = (label) => String(label).replace(/\s*[→>]\s*$/, "");

const MotionLink = motion.create(Link);
const MotionButton = motion.button;

const INNER = {
    primary: "bg-lime text-lime-ink hover:bg-[#eaff9c]",
    ghost: "border border-white/35 text-white hover:border-lime hover:text-lime",
};
const SIZE = { md: "px-8 py-[1.05rem] text-[0.95rem]", sm: "px-6 py-3 text-sm" };
const RING = { md: "p-[6px]", sm: "p-[5px]" };

// Pill button with the soft outer ring of the reference. `to` renders a router link, otherwise a button.
export default function PillButton({ to, variant = "primary", size = "md", arrow = true, className = "", children, ...rest }) {
    const ok = useMotionOk();
    const motionProps = ok ? { whileHover: { scale: 1.04 }, whileTap: { scale: 0.97 }, transition: { type: "spring", stiffness: 380, damping: 22 } } : {};
    const Comp = to ? MotionLink : MotionButton;
    return (
        <Comp
            {...(to ? { to } : { type: "button" })}
            className={`group inline-flex rounded-full bg-white/[.2] ${RING[size]} ${className}`}
            {...motionProps}
            {...rest}
        >
            <span className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors ${SIZE[size]} ${INNER[variant]}`}>
                {children}
                {arrow && <ArrowCircleIcon className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-0.5" />}
            </span>
        </Comp>
    );
}

// Small lime text link with the arrow icon ("Learn more").
export function ArrowLink({ to, className = "", children, ...rest }) {
    return (
        <Link to={to} className={`group inline-flex items-center gap-2 text-sm font-medium text-lime ${className}`} {...rest}>
            {children}
            <ArrowCircleIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
    );
}
