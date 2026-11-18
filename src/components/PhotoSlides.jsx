import { motion } from "motion/react";
import Carousel from "@/components/Carousel";
import Photo from "@/components/Photo";
import { Wrap } from "@/components/Section";
import { useMotionOk } from "@/lib/useMotionOk";

// Full-width photo slides, each with a dark panel lying over one side of the photo. Slides change by dots,
// arrows or swipe only. `slides` = [{ key, label, image, side: "left" | "right", children }].
export default function PhotoSlides({ slides, testid = "photo-slides" }) {
    const ok = useMotionOk();
    return (
        <section className="relative overflow-hidden border-t border-white/[.14] bg-deep-950" data-testid={testid}>
            <Carousel
                arrows
                testid="photo-carousel"
                slides={slides.map((s) => ({
                    key: s.key,
                    label: s.label,
                    render: (active) => (
                        <div className="relative flex min-h-[560px] items-center sm:min-h-[520px] lg:min-h-[clamp(600px,50vw,900px)]">
                            <motion.div className="absolute inset-0" initial={false} animate={{ scale: ok && active ? 1 : 1.05 }} transition={{ duration: ok ? 1.2 : 0 }}>
                                <Photo file={s.image} alt={s.label} className="h-full w-full object-cover" />
                            </motion.div>
                            <Wrap className={`relative flex py-14 pb-24 sm:pb-28 ${s.side === "right" ? "justify-end" : "justify-start"}`}>
                                <div className="w-full max-w-lg rounded-[1.75rem] border border-white/[.14] bg-deep-950/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-9">{s.children}</div>
                            </Wrap>
                        </div>
                    ),
                }))}
            />
        </section>
    );
}
