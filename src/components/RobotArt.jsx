// Own line drawing of a six-axis robot arm on a conveyor (no third-party artwork).
export default function RobotArt({ className = "" }) {
    return (
        <svg viewBox="0 0 560 520" className={className} role="img" aria-label="Schematische Darstellung eines Industrieroboters an einer Förderstrecke" data-testid="robot-art">
            <defs>
                <linearGradient id="armGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FAAF3A" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#FAAF3A" stopOpacity="0.55" />
                </linearGradient>
            </defs>
            {/* floor and conveyor */}
            <line x1="20" y1="470" x2="540" y2="470" stroke="#c3d3e0" strokeOpacity="0.35" strokeWidth="2" />
            <rect x="300" y="446" width="230" height="24" rx="4" fill="none" stroke="#c3d3e0" strokeOpacity="0.5" strokeWidth="2" />
            <g fill="none" stroke="#c3d3e0" strokeOpacity="0.5" strokeWidth="2">
                <circle cx="322" cy="458" r="5" /><circle cx="360" cy="458" r="5" /><circle cx="398" cy="458" r="5" />
                <circle cx="436" cy="458" r="5" /><circle cx="474" cy="458" r="5" /><circle cx="512" cy="458" r="5" />
            </g>
            <rect x="338" y="410" width="44" height="36" rx="3" fill="#FAAF3A" fillOpacity="0.16" stroke="#FAAF3A" strokeWidth="2" />
            <rect x="430" y="418" width="36" height="28" rx="3" fill="none" stroke="#c3d3e0" strokeOpacity="0.6" strokeWidth="2" />
            {/* base */}
            <path d="M150 470 L170 420 H290 L310 470 Z" fill="#0a2338" stroke="#c3d3e0" strokeOpacity="0.7" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="196" y="396" width="68" height="28" rx="6" fill="#0d2d48" stroke="#c3d3e0" strokeOpacity="0.7" strokeWidth="2.5" />
            {/* lower arm */}
            <g className="animate-sway" style={{ transformOrigin: "230px 400px" }}>
                <rect x="212" y="236" width="36" height="170" rx="18" fill="#0d2d48" stroke="url(#armGlow)" strokeWidth="3" />
                <circle cx="230" cy="400" r="17" fill="#113959" stroke="#FAAF3A" strokeWidth="3" />
                {/* upper arm */}
                <g className="animate-swayFast" style={{ transformOrigin: "230px 250px" }}>
                    <path d="M230 250 L372 196" stroke="#0d2d48" strokeWidth="38" strokeLinecap="round" />
                    <path d="M230 250 L372 196" stroke="url(#armGlow)" strokeWidth="3" strokeLinecap="round" fill="none" transform="translate(0 -19)" />
                    <path d="M230 250 L372 196" stroke="url(#armGlow)" strokeWidth="3" strokeLinecap="round" fill="none" transform="translate(0 19)" />
                    <circle cx="230" cy="250" r="22" fill="#113959" stroke="#FAAF3A" strokeWidth="3" />
                    <circle cx="230" cy="250" r="7" fill="#FAAF3A" />
                    {/* wrist and gripper */}
                    <g>
                        <circle cx="372" cy="196" r="14" fill="#113959" stroke="#FAAF3A" strokeWidth="3" />
                        <path d="M372 210 V256" stroke="#c3d3e0" strokeWidth="10" strokeLinecap="round" />
                        <path d="M352 262 H392 M352 262 V292 M392 262 V292" stroke="#FAAF3A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </g>
                </g>
            </g>
        </svg>
    );
}
