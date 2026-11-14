# Sönteva Automatisierung GmbH — website (preview)

Website for Sönteva Automatisierung GmbH, Karlsruhe, in German and English (DE | EN switch). Same stack and language pattern as the KCP Messtechnik site:
React 19, Create React App with craco, Tailwind, react-router, Jest. Colours from irti-robotics.com (`#113959`, `#FAAF3A`).

## Commands

    yarn install
    yarn start                                  # dev server
    CI=true npx craco test --watchAll=false     # tests
    yarn build                                  # production build into build/

## Deploy (Vercel)

`vercel.json` is included: framework create-react-app, `yarn install --frozen-lockfile`, `yarn build`, output `build`, every path rewritten to `/index.html`.

## Languages

German is the default and lives at `/...`, English lives at `/en/...` (same pattern as KCP). Every page has one path per language, and detail pages have their own slug per language:

    /anwendungen/pressenautomation   <->   /en/applications/press-shop-automation
    /branchen/pharma                 <->   /en/industries/pharmaceutical

- `src/i18n/index.js`: languages, `PAGE_PATHS` (one path per page and language), `pagePath`, `langFromPath`, `useI18n()`.
- `src/i18n/switch.js`: `switchLangPath` maps the current address to the same page in the other language (also detail pages, by id).
- `src/i18n/strings.de.js` and `strings.en.js`: all texts of the pages, navigation, footer, form and legal drafts. Both files must have the same structure; a test compares them.
- `src/data/applications.de.js` / `.en.js` and `industries.de.js` / `.en.js`: the ten applications and eleven industries per language, in the same order, linked by `id` (the German slug).
- To add a page: add its path to `PAGE_PATHS`, its texts to both string files and a route in `src/App.js`.
- `<html lang>` follows the address.

## Content

- Texts live in `src/i18n/` and `src/data/`. Pages only render them.
- Details the customer still has to confirm (phone, e-mail, managing director, VAT ID) are `PLACEHOLDER(...)` values in `src/data/site.js` (with a German and an English text) or in the legal texts in `src/i18n/strings.*.js`, and show as highlighted `[...]` on the page. Search the repo for `PLACEHOLDER` to find them all.
- `public/index.html` has `noindex, nofollow` while the site is a preview. Remove it before going live.
- The contact form does not send anything yet.
- No photos or logos from irti-robotics.com are included yet. The robot drawing is an own SVG.
