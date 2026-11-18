import GlassCard from "@/components/GlassCard";
import Photo from "@/components/Photo";
import { ArrowLink } from "@/components/PillButton";

// Card with the photo on top (it zooms slowly on hover), then title, text and a link. Use inside a <ul>.
export default function ImageCard({ image, alt, title, text, to, linkLabel }) {
    return (
        <GlassCard as="li" tone="slate" hover className="group" innerClassName="flex h-full flex-col">
            <div className="overflow-hidden">
                <Photo file={image} alt={alt} className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-[1.05rem] md:text-[clamp(0.8rem,1.9vw,1.15rem)] font-bold leading-snug text-[#fffffd] whole-words">{title}</h3>
                <p className="mb-6 mt-3 flex-1 text-base leading-relaxed text-mist">{text}</p>
                <div><ArrowLink to={to}>{linkLabel}</ArrowLink></div>
            </div>
        </GlassCard>
    );
}
