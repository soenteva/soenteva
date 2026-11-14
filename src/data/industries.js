import { INDUSTRIES_DE } from "@/data/industries.de";
import { INDUSTRIES_EN } from "@/data/industries.en";
import { pagePath } from "@/i18n";

// The German slug is the id of an industry; the English list carries it as `id` and has its own slugs.
const DE = INDUSTRIES_DE.map((i) => ({ ...i, id: i.slug }));

export const getIndustries = (lang) => (lang === "en" ? INDUSTRIES_EN : DE);
export const getIndustry = (lang, slug) => getIndustries(lang).find((i) => i.slug === slug);
export const getIndustryById = (lang, id) => getIndustries(lang).find((i) => i.id === id);
export const industryPath = (lang, id) => `${pagePath(lang, "industries")}/${getIndustryById(lang, id).slug}`;
