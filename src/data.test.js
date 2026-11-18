import fs from "fs";
import path from "path";
import { getApplications, getMoreApplications, applicationPath } from "@/data/applications";
import { APPLICATION_BANNER, APPLICATION_IMAGES, AWARD_IMAGES, CLIENT_LOGOS, COMPANY_IMAGES, EVENT_PHOTOS, IMAGE_FILES, INDUSTRY_IMAGES, PROJECT_IMAGES, imageUrl, photo } from "@/data/images";
import { HOME_BLOCK_IMAGES, HOME_CARD_IMAGES, HOME_HERO_IMAGES, HOME_SLIDE_IMAGES } from "@/data/home";
import { getIndustries, industryPath } from "@/data/industries";
import { COMPANY, NAV } from "@/data/site";
import { LANGS, STRINGS } from "@/i18n";

describe.each(LANGS)("content in %s", (lang) => {
    const apps = getApplications(lang);
    const industries = getIndustries(lang);
    const S = STRINGS[lang];

    test("every application has the content its page needs and a unique slug", () => {
        expect(apps).toHaveLength(10);
        expect(new Set(apps.map((a) => a.slug)).size).toBe(10);
        for (const a of apps) {
            expect(a.id && a.title && a.short && a.tagline && a.lead).toBeTruthy();
            expect(a.overview.length).toBeGreaterThan(0);
            expect(a.benefits.length).toBeGreaterThanOrEqual(5);
            expect(a.solutions.length).toBeGreaterThanOrEqual(3);
            expect(a.cta.title && a.cta.text).toBeTruthy();
        }
    });

    test("every industry has text and only points to applications that exist", () => {
        expect(industries).toHaveLength(11);
        expect(new Set(industries.map((i) => i.slug)).size).toBe(11);
        const ids = apps.map((a) => a.id);
        for (const i of industries) {
            expect(i.id && i.title && i.short).toBeTruthy();
            expect(i.paragraphs.length).toBeGreaterThan(0);
            for (const r of i.related) expect(ids).toContain(r);
        }
    });

    test("projects only link to applications that exist and the form offers its services", () => {
        const ids = apps.map((a) => a.id);
        expect(S.projects.items).toHaveLength(6);
        for (const p of S.projects.items) if (p.application) expect(ids).toContain(p.application);
        expect(S.services.length).toBe(11);
    });

    test("no India-only content has been carried over", () => {
        const all = JSON.stringify({ apps, more: getMoreApplications(lang), industries, S });
        expect(all).not.toMatch(/Pune|\+91|Diwali|Holi|Maharashtra|Indiens größter|India's largest/);
    });

    test("every application and industry has a path in this language", () => {
        const prefix = lang === "en" ? "/en/" : "/";
        for (const a of apps) expect(applicationPath(lang, a.id)).toBe(`${prefix}${lang === "en" ? "applications" : "anwendungen"}/${a.slug}`);
        for (const i of industries) expect(industryPath(lang, i.id)).toBe(`${prefix}${lang === "en" ? "industries" : "branchen"}/${i.slug}`);
    });
});

test("German and English lists have the same entries in the same order", () => {
    expect(getApplications("en").map((a) => a.id)).toEqual(getApplications("de").map((a) => a.id));
    expect(getIndustries("en").map((i) => i.id)).toEqual(getIndustries("de").map((i) => i.id));
    expect(getMoreApplications("en")).toHaveLength(getMoreApplications("de").length);
    expect(STRINGS.en.projects.items.map((p) => p.application)).toEqual(STRINGS.de.projects.items.map((p) => p.application));
});

test("English slugs differ from German ones, so each language has its own address", () => {
    const de = getApplications("de").map((a) => a.slug);
    const en = getApplications("en").map((a) => a.slug);
    for (const s of en) expect(de).not.toContain(s);
});

test("details the customer still has to confirm are marked as placeholders in both languages", () => {
    for (const key of ["phone", "email", "managingDirector", "vatId"]) {
        expect(COMPANY[key].placeholder).toBe(true);
        expect(COMPANY[key].text.de).toBeTruthy();
        expect(COMPANY[key].text.en).toBeTruthy();
    }
});

test("every navigation entry has a label in both languages", () => {
    for (const n of NAV) for (const lang of LANGS) expect(STRINGS[lang].nav.items[n.key]).toBeTruthy();
});

describe("images", () => {
    const root = path.join(process.cwd(), "public", "images");
    const onDisk = (dir = "") => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? onDisk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
    const size = (file) => fs.statSync(path.join(root, file)).size;
    const ref = (file) => `${imageUrl(file)} (${file})`;

    test("every referenced image file exists, is not empty and is not larger than 1.5 MB", () => {
        for (const file of IMAGE_FILES) {
            expect(fs.existsSync(path.join(root, file))).toBe(true);
            expect(size(file)).toBeGreaterThan(0);
            expect(`${ref(file)} ${size(file) <= 1.5 * 1024 * 1024}`).toBe(`${ref(file)} true`);
        }
    });

    test("no image file in public/images is larger than 1.5 MB, none is unused, and all together stay below 25 MB", () => {
        const files = onDisk().map((f) => f.split(path.sep).join("/"));
        expect(files.length).toBeGreaterThan(0);
        for (const f of files) expect(`${f} ${size(f) <= 1.5 * 1024 * 1024}`).toBe(`${f} true`);
        expect(files.sort()).toEqual([...IMAGE_FILES].sort());
        expect(files.reduce((sum, f) => sum + size(f), 0)).toBeLessThan(25 * 1024 * 1024);
    });

    test("no photo shows twice in one industry or application page, and the home hero photos are landscape and at least 1600 px wide", () => {
        for (const [id, { photos }] of Object.entries(INDUSTRY_IMAGES)) expect(`${id} ${new Set(photos).size}`).toBe(`${id} ${photos.length}`);
        for (const [id, files] of Object.entries(APPLICATION_IMAGES)) expect(`${id} ${new Set(files).size}`).toBe(`${id} ${files.length}`);
        for (const f of HOME_HERO_IMAGES) {
            const { width, height } = photo(f);
            expect(`${f} ${width >= 1600 && width > height}`).toBe(`${f} true`);
        }
    });

    test("the images that carried a third-party watermark (eurobots, a stock-photo site) or a burned-in video player bar are gone and nothing refers to them", () => {
        const removed = [
            "fanuc/fanuc-robot-values.webp", "industries/tile-forging.webp", // watermarks
            "applications/press.webp", "applications/sand-core-handling.webp", "industries/pallet.webp", // video player bar and icons
        ];
        for (const f of removed) {
            expect(IMAGE_FILES).not.toContain(f);
            expect(fs.existsSync(path.join(root, f))).toBe(false);
        }
        expect(JSON.stringify({ CLIENT_LOGOS, INDUSTRY_IMAGES, APPLICATION_IMAGES, PROJECT_IMAGES, EVENT_PHOTOS, COMPANY_IMAGES })).not.toMatch(/fanuc-robot-values|tile-forging|applications\/press\.webp|sand-core-handling|industries\/pallet\.webp/);
        expect(INDUSTRY_IMAGES["schmieden-giessen"].tile).toBe("applications/molten-metal.webp");
    });

    test("the home page never shows one photo twice next to each other: every hero, slide, block and card photo is different", () => {
        const shown = [...HOME_HERO_IMAGES, ...Object.values(HOME_SLIDE_IMAGES), ...Object.values(HOME_BLOCK_IMAGES), ...Object.values(HOME_CARD_IMAGES)];
        expect(new Set(shown).size).toBe(shown.length);
    });

    test("photos are WebP; only client logos and award images keep their original format", () => {
        for (const file of IMAGE_FILES) {
            const [category] = file.split("/");
            if (category === "logos") expect(file).toMatch(/\.(png|jpg|webp)$/);
            else if (category === "awards") expect(file).toMatch(/\.jpe?g$/);
            else expect(file).toMatch(/\.webp$/);
            expect(["logos", "awards", "fanuc", "industries", "applications", "events"]).toContain(category);
        }
    });

    test("every file really has the format its extension says (some source logos were called .png but are JPEG or WebP)", () => {
        for (const file of IMAGE_FILES) {
            const b = fs.readFileSync(path.join(root, file));
            const kind = b.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) ? "jpg" : b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) ? "png" : b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" ? "webp" : "unknown";
            expect(`${file} ${kind}`).toBe(`${file} ${path.extname(file).slice(1)}`);
        }
    });

    test("photos are at most 1600 px wide and event photos at most 1200 px, and the stored size is the real size", () => {
        for (const file of IMAGE_FILES) {
            const { width, height } = photo(file);
            expect(width).toBeGreaterThan(0);
            expect(height).toBeGreaterThan(0);
            const [category] = file.split("/");
            if (file.endsWith(".webp")) {
                expect(width).toBeLessThanOrEqual(category === "events" ? 1200 : 1600);
                // Real size from the file header (lossy "VP8 " or extended "VP8X").
                const b = fs.readFileSync(path.join(root, file));
                expect(b.toString("ascii", 0, 4)).toBe("RIFF");
                expect(b.toString("ascii", 8, 12)).toBe("WEBP");
                const kind = b.toString("ascii", 12, 16);
                const real = kind === "VP8X" ? [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1] : [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
                expect(`${file} ${real}`).toBe(`${file} ${[width, height]}`);
            } else if (file.endsWith(".png")) {
                const b = fs.readFileSync(path.join(root, file));
                expect(`${file} ${[b.readUInt32BE(16), b.readUInt32BE(20)]}`).toBe(`${file} ${[width, height]}`);
            }
        }
    });

    test("all client logos are listed, each with the company name shown in the logo as its name", () => {
        expect(CLIENT_LOGOS).toHaveLength(37);
        expect(CLIENT_LOGOS.filter((l) => /^logos\/(client-.+|cummins)\.(png|jpg|webp)$/.test(l.file))).toHaveLength(37);
        expect(new Set(CLIENT_LOGOS.map((l) => l.file)).size).toBe(37);
        expect(new Set(CLIENT_LOGOS.map((l) => l.name)).size).toBe(37);
        for (const { name } of CLIENT_LOGOS) expect(name.trim()).not.toBe("");
        expect(CLIENT_LOGOS.map((l) => l.file)).toContain("logos/cummins.png");
    });

    test("logos whose file name differs from the name shown in the logo use the shown name", () => {
        const name = (file) => CLIENT_LOGOS.find((l) => l.file === file).name;
        expect(name("logos/client-syamntakindustries.jpg")).toBe("Cosmos");
        expect(name("logos/client-tatacummins-1.png")).toBe("Cummins");
        expect(name("logos/cummins.png")).toBe("Tata Motors / Cummins");
        expect(name("logos/client-schamlzindia.png")).toBe("Schmalz");
        expect(name("logos/client-simensenergy.png")).toBe("Siemens Energy");
        expect(name("logos/client-plamatron.jpg")).toBe("Plasmatron");
        expect(name("logos/client-bharatforge.jpg")).toBe("Kalyani Bharat Forge");
        expect(name("logos/client-kalyanitechnologyltd.jpg")).toBe("Kalyani");
        expect(name("logos/client-azadengineering.png")).toBe("Azad");
        // Earlier names that came from the file names must be gone.
        const all = CLIENT_LOGOS.map((l) => l.name);
        for (const old of ["Syamntak Industries", "Tata Cummins", "Schamlz India", "Simens Energy", "Plamatron"]) expect(all).not.toContain(old);
    });

    test("each industry has a small picture and photos, each application one picture per solution, each project one picture", () => {
        for (const lang of LANGS) {
            for (const i of getIndustries(lang)) {
                expect(INDUSTRY_IMAGES[i.id].tile).toMatch(/^(industries|applications)\//);
                expect(INDUSTRY_IMAGES[i.id].photos.length).toBeGreaterThan(0);
                expect(new Set(INDUSTRY_IMAGES[i.id].photos).size).toBe(INDUSTRY_IMAGES[i.id].photos.length);
            }
            for (const a of getApplications(lang)) expect(APPLICATION_IMAGES[a.id]).toHaveLength(a.solutions.length);
            expect(PROJECT_IMAGES).toHaveLength(STRINGS[lang].projects.items.length);
        }
        expect(Object.keys(INDUSTRY_IMAGES).sort()).toEqual(getIndustries("de").map((i) => i.id).sort());
        expect(Object.keys(APPLICATION_IMAGES).sort()).toEqual(getApplications("de").map((a) => a.id).sort());
    });

    test("awards and the company photos are where the company page expects them", () => {
        expect(AWARD_IMAGES).toHaveLength(9);
        for (const f of AWARD_IMAGES) expect(f).toMatch(/^awards\/awards[1-9]\.jpg$/);
        expect(COMPANY_IMAGES.team).toMatch(/^events\//);
        expect(COMPANY_IMAGES.values).toBe("applications/conveyor.webp");
        expect(COMPANY_IMAGES.home).toMatch(/^fanuc\//);
        expect(APPLICATION_BANNER).toMatch(/^applications\//);
    });

    test("the event gallery has every photo once, the awards first, and no 404 file", () => {
        expect(EVENT_PHOTOS.length).toBeGreaterThan(80);
        expect(new Set(EVENT_PHOTOS).size).toBe(EVENT_PHOTOS.length);
        expect(EVENT_PHOTOS.slice(0, 9)).toEqual(AWARD_IMAGES);
        for (const f of EVENT_PHOTOS.slice(9)) expect(f).toMatch(/^events\//);
        for (const f of EVENT_PHOTOS) expect(fs.existsSync(path.join(root, f))).toBe(true);
    });

    test("no Pune address or +91 phone number comes with the images", () => {
        expect(JSON.stringify({ CLIENT_LOGOS, INDUSTRY_IMAGES, APPLICATION_IMAGES, PROJECT_IMAGES, EVENT_PHOTOS, COMPANY_IMAGES })).not.toMatch(/Pune|\+91/i);
    });
});
