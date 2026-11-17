// Choices for the home page (which existing content goes where). The texts come from src/i18n, the images from public/images.

// Applications shown as the three feature cards (German slugs = ids); the overview page lists all of them.
export const HOME_FEATURED_APPLICATIONS = ["montageautomation", "anlagenautomation", "maschinenbeschickung"];

// Industries shown as the three cards at the end of the page (ids).
export const HOME_INDUSTRIES = ["elektronik", "metall-maschinenbau", "lager-logistik"];

// Photos of the process section: the index is the step of S.process (the first step is the lime tile, without photo).
export const HOME_PROCESS_IMAGES = { 1: "applications/endtoend.webp", 2: "fanuc/fanuc-cell.webp", 3: "fanuc/fanuc.webp" };

// Four of the nine FANUC award photos: the trophy and certificate photos of 2025 and two photos of the 2025 ceremony.
export const HOME_AWARD_IMAGES = ["awards/awards7.jpg", "awards/awards5.jpg", "awards/awards4.jpg", "awards/awards9.jpg"];

// Small picture on the "more applications" card of the logo band.
export const HOME_PROMO_IMAGE = "industries/tile-electronics.webp";

// Photo on the right of the hero: a FANUC robot cell.
export const HOME_HERO_IMAGE = "fanuc/fanuc-cell.webp";
