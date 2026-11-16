import { photo } from "@/data/images";

// Image from public/images. `alt` is required: the title of the page or section it is shown in, or the company name of a logo.
// Loaded lazily with its pixel size, so the page does not jump while images arrive.
export default function Photo({ file, alt, className = "", eager = false, ...rest }) {
    const p = photo(file);
    return <img src={p.url} alt={alt} width={p.width} height={p.height} loading={eager ? "eager" : "lazy"} decoding="async" className={className} {...rest} />;
}
