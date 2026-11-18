// Choices for the home page (which existing image goes where). The texts come from src/i18n, the images from public/images.
import { COMPANY_IMAGES, PROJECT_IMAGES } from "@/data/images";

// Hero slider: one photo per slide (intro, process, more applications).
export const HOME_HERO_IMAGES = ["applications/assembly.webp", "industries/ev.webp", "applications/mig-welding.webp"];

// Photo slides with the dark panel: industries, awards (one of the FANUC award photos) and the figures.
export const HOME_SLIDE_IMAGES = { industries: "industries/pick-place.webp", awards: "awards/awards9.jpg", stats: "fanuc/fanuc.webp" };

// The three 50/50 blocks: about, why us, vision and mission.
export const HOME_BLOCK_IMAGES = { about: COMPANY_IMAGES.home, why: COMPANY_IMAGES.values, vision: "fanuc/fanuc-cell.webp" };

// The three cards: company, projects, career.
export const HOME_CARD_IMAGES = { company: "applications/inspection.webp", projects: PROJECT_IMAGES[0], career: "applications/machine-tending4.webp" };
