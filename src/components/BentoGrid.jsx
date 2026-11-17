// Staggered three-column bento layout. Children are <BentoColumn>s: columns stack on a phone, two sit side by
// side on a tablet (the third one spans the full width below) and all three line up on a desktop.
export function BentoGrid({ className = "", children, ...rest }) {
    return <div className={`grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3 ${className}`} {...rest}>{children}</div>;
}

// `raised` lifts a column on desktop so the three columns end at about the same height.
export function BentoColumn({ raised = false, className = "", children }) {
    return <div className={`flex flex-col gap-5 ${raised ? "lg:-mt-[60px]" : ""} ${className}`}>{children}</div>;
}
