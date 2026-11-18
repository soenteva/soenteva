import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";

// Block in two equal halves: a full-bleed photo and the text. Use it several times in a row and alternate
// `imageSide` ("left" / "right") and `tone` ("teal" / "dark").
const TONES = { teal: "bg-deep-800", dark: "bg-deep-950" };

export default function SplitBlock({ image, alt, imageSide = "left", tone = "teal", testid, imageTestid, children }) {
    return (
        <section className={`border-t border-white/[.14] ${TONES[tone]}`} data-testid={testid}>
            <div className="grid lg:grid-cols-2">
                <div className={`relative min-h-[300px] overflow-hidden bg-deep-950 sm:min-h-[400px] lg:min-h-[540px] ${imageSide === "right" ? "lg:order-2" : ""}`}>
                    <Photo file={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" data-testid={imageTestid} />
                </div>
                <div className="flex items-center px-5 py-14 sm:px-8 lg:px-[72px] lg:py-24">
                    <Reveal className="w-full max-w-[560px]">{children}</Reveal>
                </div>
            </div>
        </section>
    );
}
