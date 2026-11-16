// Company master data and the navigation structure. All texts live in src/i18n/strings.*.js.
// Values the client still has to confirm are PLACEHOLDER(...) and are shown highlighted on the page.

export const PLACEHOLDER = (text) => ({ placeholder: true, text });

export const COMPANY = {
    name: "Sönteva Automatisierung GmbH",
    shortName: "Sönteva",
    city: "Karlsruhe",
    // From the commercial register extract (North Data), to be confirmed by the client.
    register: "Amtsgericht Mannheim, HRB 734051",
    streetFromRegister: "Akademie-Str. 38-40",
    // Not known yet: shown as placeholders.
    phone: PLACEHOLDER({ de: "Telefonnummer folgt", en: "phone number to follow" }),
    email: PLACEHOLDER({ de: "E-Mail-Adresse folgt", en: "email address to follow" }),
    managingDirector: PLACEHOLDER({ de: "Name der Geschäftsführung folgt", en: "name of the managing director to follow" }),
    vatId: PLACEHOLDER({ de: "USt-IdNr. folgt", en: "VAT ID to follow" }),
    groupName: "IRTI Robotics",
    groupUrl: "http://www.irti-robotics.com/",
};

// `key` selects the label (S.nav.items) and the page path (PAGE_PATHS); `menu` adds a dropdown.
export const NAV = [
    { key: "company" },
    { key: "projects" },
    { key: "industries", menu: "industries" },
    { key: "applications", menu: "applications" },
    { key: "career" },
    { key: "events" },
];
