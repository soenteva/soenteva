import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import CompanyPage from "@/pages/CompanyPage";
import ProjectsPage from "@/pages/ProjectsPage";
import { IndustriesIndexPage, IndustryPage } from "@/pages/IndustriesPages";
import { ApplicationsIndexPage, ApplicationPage } from "@/pages/ApplicationsPages";
import CareerPage from "@/pages/CareerPage";
import ContactPage from "@/pages/ContactPage";
import { ImpressumPage, PrivacyPage } from "@/pages/LegalPages";
import NotFoundPage from "@/pages/NotFoundPage";
import { LANGS, pagePath } from "@/i18n";

const PAGES = [
    ["home", HomePage],
    ["company", CompanyPage],
    ["projects", ProjectsPage],
    ["industries", IndustriesIndexPage],
    ["applications", ApplicationsIndexPage],
    ["career", CareerPage],
    ["contact", ContactPage],
    ["legal", ImpressumPage],
    ["privacy", PrivacyPage],
];

// German pages at "/...", English pages at "/en/..."; detail pages carry a slug per language.
export const routesFor = (lang) => [
    ...PAGES.map(([key, Page]) => <Route key={`${lang}-${key}`} path={pagePath(lang, key)} element={<Page />} />),
    <Route key={`${lang}-industry`} path={`${pagePath(lang, "industries")}/:slug`} element={<IndustryPage />} />,
    <Route key={`${lang}-application`} path={`${pagePath(lang, "applications")}/:slug`} element={<ApplicationPage />} />,
];

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {LANGS.flatMap(routesFor)}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
