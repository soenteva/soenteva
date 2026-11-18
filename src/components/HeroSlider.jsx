import { motion } from "motion/react";
import Carousel from "@/components/Carousel";
import Photo from "@/components/Photo";
import { Wrap } from "@/components/Section";
import { useMotionOk } from "@/lib/useMotionOk";

// Full-width hero slider: a photo behind a dark gradient, the slide text on the left, auto-advancing.
// `slides` = [{ key, label, image, children }].
export default function HeroSlider({ slides, testid = "hero" }) {
    const ok = useMotionOk();
    return (
        <section className="relative overflow-hidden bg-deep-950" data-testid={testid}>
            <Carousel
                autoplay
                interval={7000}
                testid="hero-slider"
                slides={slides.map((s, i) => ({
                    key: s.key,
                    label: s.label,
                    render: (active) => (
                        <div className="relative flex min-h-[540px] items-center sm:min-h-[580px] lg:min-h-[660px]">
                            <motion.div className="absolute inset-0" initial={false} animate={{ scale: ok && active ? 1 : 1.07 }} transition={{ duration: ok ? 7 : 0, ease: "linear" }}>
                                <Photo file={s.image} alt={s.label} eager={i === 0} className="h-full w-full object-cover" />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-r from-deep-950/95 via-deep-950/75 to-deep-950/25" aria-hidden="true" />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-deep-950/70 to-transparent" aria-hidden="true" />
                            <Wrap className="relative py-16 pb-24 sm:pb-28">
                                <div className="max-w-2xl">{s.children}</div>
                            </Wrap>
                        </div>
                    ),
                }))}
            />
        </section>
    );
}
