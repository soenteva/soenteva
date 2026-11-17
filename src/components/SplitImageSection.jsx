import GlassCard from "@/components/GlassCard";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";

// Image on one side, content on the other.
//  variant="framed": the image sits in a double-framed card next to the content (inside the 1140 px column).
//  variant="bleed":  the image fills one half of the page edge to edge and the content sits on a colored panel.
export default function SplitImageSection({ variant = "framed", imageSide = "left", image, alt, imageTestid, tone = "teal", testid, children }) {
    if (variant === "bleed") {
        return (
            <section className="border-t border-white/[.14] bg-deep-600" data-testid={testid}>
                <div className="grid lg:grid-cols-2">
                    <div className={`relative min-h-[260px] overflow-hidden bg-deep-950 sm:min-h-[360px] lg:min-h-full ${imageSide === "right" ? "lg:order-2" : ""}`}>
                        <Photo file={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" data-testid={imageTestid} />
                    </div>
                    <div className="px-5 py-14 sm:px-8 md:py-20 lg:px-[70px] lg:py-[90px]">
                        <div className="max-w-[660px]">{children}</div>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <Section tone={tone} testid={testid}>
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,378px)_minmax(0,1fr)] lg:gap-14 xl:gap-[100px]">
                <Reveal className={`mx-auto w-full max-w-[378px] lg:max-w-none ${imageSide === "right" ? "lg:order-2" : ""}`}>
                    <GlassCard tone="moss">
                        <Photo file={image} alt={alt} className="aspect-[3/4] w-full object-cover sm:aspect-[378/490]" data-testid={imageTestid} />
                    </GlassCard>
                </Reveal>
                <div>{children}</div>
            </div>
        </Section>
    );
}
