// A full-width band of the home page: background tone, divider line on top, vertical rhythm, centered 1140 px column.
const TONES = {
    teal: "bg-deep-800",
    dark: "bg-deep-950",
    panel: "bg-deep-600",
    hero: "bg-[linear-gradient(90deg,#063d44_0%,#052f38_38%,#031a22_100%)]",
    glass: "bg-[#132a30]",
};
const PADS = {
    lg: "py-16 md:py-24 lg:py-[120px]",
    md: "py-14 md:py-16 lg:py-[70px]",
    none: "",
};

export const Wrap = ({ className = "", children }) => (
    <div className={`mx-auto w-full max-w-[1140px] px-5 sm:px-8 xl:px-0 ${className}`}>{children}</div>
);

export default function Section({ tone = "teal", pad = "lg", divider = true, wrap = true, className = "", testid, children, ...rest }) {
    return (
        <section className={`relative ${TONES[tone]} ${PADS[pad]} ${divider ? "border-t border-white/[.14]" : ""} ${className}`} data-testid={testid} {...rest}>
            {wrap ? <Wrap>{children}</Wrap> : children}
        </section>
    );
}
