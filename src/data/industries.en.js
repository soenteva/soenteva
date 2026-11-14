// Industries in English. Source: irti-robotics.com, edited for clarity. `id` is the German slug;
// the lists in industries.de.js and industries.en.js must stay in the same order (a test checks this).
// `related` holds application ids (= German application slugs).

export const INDUSTRIES_EN = [
    {
        id: "elektronik",
        slug: "electronics",
        title: "Electronics",
        short: "Circuit boards, assembly, inspection and packaging.",
        paragraphs: [
            "We deliver robotic automation for the electronics industry, helping manufacturers achieve high precision, consistency and throughput in fast-moving production environments. Our systems support key processes such as PCB handling, component assembly, pick and place, soldering, inspection, testing, packaging and palletizing. Industrial robots and vision inspection improve quality control, reduce defect rates and optimize production.",
            "For miniaturization and high volumes, the solutions deliver accuracy, repeatability and traceability across the whole manufacturing process. They reduce manual handling and cycle times and ensure reliable operation with sensitive components, from consumer electronics to industrial and automotive electronics.",
        ],
        related: ["montageautomation", "inspektion-vision", "palettieren-depalettieren"],
    },
    {
        id: "metall-maschinenbau",
        slug: "metal-machinery",
        title: "Metal and Machinery",
        short: "CNC tending, sheet metal handling, presses, grinding and deburring.",
        paragraphs: [
            "We deliver robotic automation for metalworking and machinery, helping manufacturers improve productivity, precision and workplace safety in demanding environments. Our solutions support key processes such as CNC machine tending, sheet metal handling, press shop automation, turning, deburring and grinding, material handling, inspection and palletizing. With industrial robots, vision and intelligent automation we ensure consistent quality and reliable performance.",
            "Designed for heavy loads, high temperatures and continuous production, the systems reduce manual intervention and downtime and increase workplace safety. They make cycle times more consistent, raise throughput and support high-mix as well as high-volume production, from raw material handling to palletizing of finished components.",
        ],
        related: ["maschinenbeschickung", "pressenautomation", "materialhandhabung"],
    },
    {
        id: "lager-logistik",
        slug: "warehousing-logistics",
        title: "Warehousing and Logistics",
        short: "Picking, palletizing, sorting and conveyor integration.",
        paragraphs: [
            "We deliver robotic automation for warehousing and logistics that makes material handling, storage and order fulfillment more efficient. The solutions support key warehouse processes such as robotic picking and placing, palletizing and depalletizing, sorting, conveyor integration and automated goods movement. With industrial robots, vision and warehouse automation, operations achieve higher throughput, greater accuracy and lower operating costs.",
            "For large volumes and high variety, the systems raise efficiency, scalability and workplace safety. They reduce manual handling and errors in picking and sorting and work reliably in demanding distribution and fulfillment centers, from inbound handling to palletizing and dispatch.",
        ],
        related: ["palettieren-depalettieren", "materialhandhabung", "kollaborative-roboter"],
    },
    {
        id: "elektromobilitaet",
        slug: "e-mobility",
        title: "E-Mobility",
        short: "Battery production, powertrain assembly and component manufacturing.",
        paragraphs: [
            "We deliver robotic automation for electric mobility, with more efficiency, accuracy and scalability in battery production, powertrain assembly and component manufacturing. The systems automate processes such as robotic assembly, component handling, inspection and material transfer, so that manufacturers produce at high quality and on a large scale.",
            "With industrial robots, intelligent vision and automated material handling we optimize production lines, reduce errors and keep quality consistent. Tailored solutions support sustainable, future-proof manufacturing and the growing needs of the electric mobility market.",
        ],
        related: ["montageautomation", "inspektion-vision", "anlagenautomation"],
    },
    {
        id: "schmieden-giessen",
        slug: "forging-casting",
        title: "Forging and Casting",
        short: "Automation for forming processes at high temperatures.",
        paragraphs: [
            "Robots, material handling, press tending, furnace loading and in-line inspection make forging and casting more productive and safer. Typical applications are in automotive, aerospace, heavy engineering and defense.",
            "You can find more information on the page about forging and casting automation.",
        ],
        related: ["schmieden-giessen", "maschinenbeschickung", "inspektion-vision"],
    },
    {
        id: "konsumgueter",
        slug: "consumer-goods",
        title: "Consumer Goods",
        short: "Handling, packaging, labeling, inspection and palletizing.",
        paragraphs: [
            "We deliver robotic automation for the consumer goods industry, helping manufacturers produce high volumes quickly, accurately and consistently. Our solutions support processes such as product handling, pick and place, packaging, labeling, inspection, palletizing and depalletizing on consumer goods lines.",
            "For production environments with high variety and fast changeovers, the systems increase flexibility, reduce downtime and keep product quality consistent, from primary packaging to palletizing at the end of the line.",
        ],
        related: ["palettieren-depalettieren", "materialhandhabung", "kollaborative-roboter"],
    },
    {
        id: "pharma",
        slug: "pharmaceutical",
        title: "Pharmaceutical",
        short: "Handling, filling, packaging, inspection and labeling.",
        paragraphs: [
            "We deliver robotic automation for the pharmaceutical industry. Our systems simplify key processes such as material handling, filling, packaging, inspection, labeling and palletizing. Industrial robots, vision and intelligent process automation provide accuracy, consistency and efficiency while meeting strict regulatory requirements.",
            "The solutions are designed for high pharmaceutical standards and improve traceability, contamination control and process reliability in production and packaging. Automation reduces manual intervention and human error and supports compliance with GMP and other regulatory requirements, from raw material handling to palletizing of the finished product.",
        ],
        related: ["inspektion-vision", "kollaborative-roboter", "palettieren-depalettieren"],
    },
    {
        id: "luft-raumfahrt",
        slug: "aerospace",
        title: "Aerospace",
        short: "Component handling, machining, inspection, assembly and surface finishing.",
        paragraphs: [
            "We deliver precise robotic automation for aerospace, helping manufacturers meet strict requirements for quality, accuracy and standards compliance. Our systems are designed for applications such as component handling, machining automation, inspection, assembly, surface finishing and palletizing, and ensure consistent performance with high-value, complex components.",
            "With industrial robots, vision and intelligent process automation we improve traceability, reduce manual intervention and increase process reliability. Scalable solutions support lightweight materials, tight tolerances and mission-critical manufacturing processes along the value chain.",
        ],
        related: ["inspektion-vision", "montageautomation", "skulptur-3d-druck"],
    },
    {
        id: "kunststoff",
        slug: "plastics",
        title: "Plastics",
        short: "Injection molding, blow molding and extrusion: removal, trimming, packaging.",
        paragraphs: [
            "We deliver robust robotic automation for the plastics industry and support manufacturers in injection molding, blow molding and extrusion. Our systems handle part removal, trimming, inspection, assembly, packaging and palletizing and ensure steady cycle times and higher productivity.",
            "Designed for continuous operation, the solutions reduce manual handling, improve quality consistency and increase workplace safety. From handling molded parts to end-of-line automation, plastics manufacturers achieve scalable, efficient production.",
        ],
        related: ["maschinenbeschickung", "palettieren-depalettieren", "inspektion-vision"],
    },
    {
        id: "energie",
        slug: "energy",
        title: "Energy",
        short: "Power generation, renewable energy and energy equipment.",
        paragraphs: [
            "We deliver reliable robotic automation for the energy sector, in power generation, renewable energy systems and the manufacturing of energy infrastructure. Our solutions are used for component handling, precision assembly, welding, inspection and testing and ensure consistent quality and dependable performance in demanding operating environments.",
            "Designed for continuous operation and high loads, our solutions improve process consistency and product quality and support safe, efficient operation. From equipment manufacturing to integrated automation systems, we create scalable, robust and future-proof production capabilities.",
        ],
        related: ["anlagenautomation", "montageautomation", "inspektion-vision"],
    },
    {
        id: "cam",
        slug: "cam-applications",
        title: "CAM Applications",
        short: "Computer-aided manufacturing: sculpturing, surface finishing, multi-axis milling.",
        paragraphs: [
            "We deliver computer-aided manufacturing (CAM) solutions for high-precision production processes, including complex sculpturing, surface finishing and multi-axis milling. Our CAM-integrated automation systems execute toolpaths for demanding geometries, free-form surfaces and detailed sculptures precisely on a wide range of materials.",
            "Designed for precise, repeatable manufacturing, our CAM solutions improve surface quality, dimensional accuracy and process consistency. From integrating the digital design to automated sculpturing and finishing, we support manufacturers in achieving high-quality results and efficient workflows.",
        ],
        related: ["skulptur-3d-druck", "maschinenbeschickung"],
    },
];
