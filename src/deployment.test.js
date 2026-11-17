import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

test("the public entry point starts in German (the default language), has no external font or script requests and is not indexed while it is a preview", () => {
    const html = read("public/index.html");
    expect(html).toContain('<div id="root"></div>');
    expect(html).toContain('<html lang="de">');
    expect(html).toContain("Sönteva Automatisierung GmbH");
    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic|<script/);
});

test("Vercel builds the locked dependencies into the static build directory", () => {
    const config = JSON.parse(read("vercel.json"));
    expect(config.framework).toBe("create-react-app");
    expect(config.installCommand).toBe("yarn install --frozen-lockfile");
    expect(config.buildCommand).toBe("yarn build");
    expect(config.outputDirectory).toBe("build");
});

test("every address is answered with the single page app, so deep links also work when opened directly", () => {
    const config = JSON.parse(read("vercel.json"));
    expect(config.rewrites).toEqual([{ source: "/(.*)", destination: "/index.html" }]);
});

test("the site uses the dark teal and lime palette of the design reference, not the old IRTI navy and amber", () => {
    const tailwind = read("tailwind.config.js");
    for (const colour of ["#001920", "#022d33", "#e1ff7c"]) expect(tailwind).toContain(colour);
    for (const old of ["#113959", "#FAAF3A"]) expect(tailwind).not.toContain(old);
});
