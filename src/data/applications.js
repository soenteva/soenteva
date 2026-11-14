import { APPLICATIONS_DE, MORE_APPLICATIONS_DE } from "@/data/applications.de";
import { APPLICATIONS_EN, MORE_APPLICATIONS_EN } from "@/data/applications.en";
import { pagePath } from "@/i18n";

// The German slug is the id of an application; the English list carries it as `id` and has its own slugs.
const DE = APPLICATIONS_DE.map((a) => ({ ...a, id: a.slug }));

export const getApplications = (lang) => (lang === "en" ? APPLICATIONS_EN : DE);
export const getMoreApplications = (lang) => (lang === "en" ? MORE_APPLICATIONS_EN : MORE_APPLICATIONS_DE);
export const getApplication = (lang, slug) => getApplications(lang).find((a) => a.slug === slug);
export const getApplicationById = (lang, id) => getApplications(lang).find((a) => a.id === id);
export const applicationPath = (lang, id) => `${pagePath(lang, "applications")}/${getApplicationById(lang, id).slug}`;
