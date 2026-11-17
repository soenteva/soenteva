import { motion } from "motion/react";
import { canObserve, useMotionOk } from "@/lib/useMotionOk";

// Fades and lifts its content in when it scrolls into view (once). With reduced motion, or without
// IntersectionObserver, the content is shown right away, so it is never hidden.
export default function Reveal({ as = "div", delay = 0, y = 28, className = "", children, ...rest }) {
    const ok = useMotionOk();
    const Tag = ok && canObserve() ? motion[as] : as;
    if (Tag === as) return <Tag className={className} {...rest}>{children}</Tag>;
    return (
        <Tag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
            {...rest}
        >
            {children}
        </Tag>
    );
}
