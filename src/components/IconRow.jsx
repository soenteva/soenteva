import GlassCard from "@/components/GlassCard";

// Wide rounded row: lime icon disc, title, text (the "Why choose us" rows).
export default function IconRow({ icon: Icon, title, children, className = "", ...rest }) {
    return (
        <GlassCard as="li" shape="pill" hover className={className} innerClassName="flex items-center gap-4 bg-gradient-to-r from-[#0a5560] to-[#06404a] px-4 py-4 sm:gap-5 sm:px-5" {...rest}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime text-lime-ink sm:h-[62px] sm:w-[62px]">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
                <h3 className="font-display text-[0.95rem] font-bold leading-snug text-[#fffffd] sm:text-base xl:text-lg whole-words">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-mist sm:text-[0.95rem]">{children}</p>
            </div>
        </GlassCard>
    );
}
