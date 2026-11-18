// Inline SVG icons of the home page, drawn for this site (24x24, drawn with currentColor). Decorative: always aria-hidden.

const base = { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" };
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

// Filled circle with a right arrow cut out (the arrow shows the background colour).
export const ArrowCircleIcon = (props) => (
    <svg {...base} {...props}>
        <path fillRule="evenodd" fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zM7 11h5.2V7.8l4.6 4.2-4.6 4.2V13H7z" />
    </svg>
);

export const RobotIcon = (props) => (
    <svg {...base} {...props}>
        <g {...line}>
            <rect x="5" y="8" width="14" height="11" rx="3" />
            <path d="M12 8V5.2M3 12v3M21 12v3M9.5 16.5h5" />
            <circle cx="12" cy="4" r="1.2" />
            <circle cx="9.5" cy="12.5" r=".6" fill="currentColor" />
            <circle cx="14.5" cy="12.5" r=".6" fill="currentColor" />
        </g>
    </svg>
);

export const FactoryIcon = (props) => (
    <svg {...base} {...props}>
        <g {...line}>
            <path d="M3 20.5V11l6 3.5V11l6 3.5V4.5h6v16z" />
            <path d="M7 18h.01M11 18h.01M15 18h.01M19 18h.01M18 8h.01" strokeWidth="2.2" />
        </g>
    </svg>
);

export const GearIcon = (props) => (
    <svg {...base} {...props}>
        <g {...line}>
            <circle cx="12" cy="12" r="3.2" />
            <circle cx="12" cy="12" r="6.6" />
            <path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8" />
        </g>
    </svg>
);

export const EyeIcon = (props) => (
    <svg {...base} {...props}>
        <g {...line}>
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
            <circle cx="12" cy="12" r="3" />
        </g>
    </svg>
);

export const TargetIcon = (props) => (
    <svg {...base} {...props}>
        <g {...line}>
            <circle cx="11" cy="13" r="8" />
            <circle cx="11" cy="13" r="4" />
            <path d="M11 13l8.5-8.5M16.5 4.5h3v3" />
        </g>
    </svg>
);

export const BoltIcon = (props) => (
    <svg {...base} {...props}>
        <path {...line} d="M13 2.5L4.5 13.5H11l-1 8 9-12h-6.5z" />
    </svg>
);

export const WrenchIcon = (props) => (
    <svg {...base} {...props}>
        <path {...line} d="M14.7 6.3a4 4 0 00-5.4 5L3.6 17a2 2 0 003 3l5.7-5.7a4 4 0 005-5.4l-2.4 2.4-2.4-.6-.6-2.4z" />
    </svg>
);

export const AwardIcon = (props) => (
    <svg {...base} {...props}>
        <g {...line}>
            <circle cx="12" cy="9" r="6" />
            <path d="M8.6 14L7 21.5l5-2.6 5 2.6-1.6-7.5" />
        </g>
    </svg>
);

export const FlagIcon = (props) => (
    <svg {...base} {...props}>
        <path {...line} d="M5 21.5V3.5M5 4.5h11.5l-2.3 3.9 2.3 3.9H5" />
    </svg>
);

export const MenuIcon = ({ open, ...props }) => (
    <svg {...base} {...props}>
        <path {...line} d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
    </svg>
);

export const ChevronDownIcon = (props) => (
    <svg {...base} {...props}>
        <path {...line} d="M6 9.5l6 6 6-6" />
    </svg>
);

// Icons of the six "why us" items, in the order of S.whyUs.
export const WHY_ICONS = [RobotIcon, TargetIcon, FlagIcon, BoltIcon, WrenchIcon, AwardIcon];

export const ChevronLeftIcon = (props) => (
    <svg {...base} {...props}>
        <path {...line} d="M14.5 6l-6 6 6 6" />
    </svg>
);

export const ChevronRightIcon = (props) => (
    <svg {...base} {...props}>
        <path {...line} d="M9.5 6l6 6-6 6" />
    </svg>
);
