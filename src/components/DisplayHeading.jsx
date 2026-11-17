import "@fontsource/unbounded/latin-700.css";

// Large display heading with one highlighted word (lime). Words are never split (no hyphens, no break inside a
// word: class whole-words), so the sizes below are chosen to fit the longest German words. Give `parts` = [before, highlighted, after]
// (e.g. the hero title of the strings) or a `title` with the `highlight` text in it; without `highlight`
// the last word is highlighted.
export const splitTitle = (title, highlight) => {
    const text = String(title);
    const hl = highlight || text.split(/\s+/).filter(Boolean).pop();
    const at = text.lastIndexOf(hl);
    if (at < 0) return [text, "", ""];
    return [text.slice(0, at), hl, text.slice(at + hl.length)];
};

// Arbitrary sizes (not text-4xl & co.): those carry their own line-height and would override the heading's.
const SIZES = {
    // Hero: sized by the screen width so its longest German word ("Industrieautomation.") always fits whole;
    // at lg the heading shares the row with the photo and is a little smaller.
    hero: "text-[clamp(1.15rem,5.9vw,3.5rem)] leading-[1.2] lg:text-[clamp(2rem,3.6vw,3rem)]",
    xl: "text-[1.45rem] leading-[1.25] sm:text-[2.25rem] lg:text-[2.75rem] xl:text-[3.25rem]",
    lg: "text-[1.3rem] leading-[1.3] sm:text-[1.875rem] lg:text-[2.25rem]",
    md: "text-[1.25rem] leading-[1.3] sm:text-[1.5rem]",
    sm: "text-[1.125rem] leading-snug",
};

export default function DisplayHeading({ as: Tag = "h2", title, highlight, parts, size = "xl", align = "left", className = "", testid }) {
    const [pre, hl, post] = parts || splitTitle(title, highlight);
    return (
        <Tag
            className={`font-display font-bold text-[#fffffd] whole-words ${SIZES[size]} ${align === "center" ? "text-center" : ""} ${className}`}
            data-testid={testid}
        >
            {pre}{hl && <span className="text-lime">{hl}</span>}{post}
        </Tag>
    );
}
