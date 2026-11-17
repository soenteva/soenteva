import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";
import HomeFooter from "@/components/HomeFooter";
import { pagePath, useI18n } from "@/i18n";

// Moves to the top when the page changes; a link with a hash keeps its target.
function ScrollOnNavigate() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)));
            if (target) { target.scrollIntoView(); return; }
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);
    return null;
}

export default function Layout() {
    const { lang, S } = useI18n();
    const { pathname } = useLocation();
    // The home page has its own dark header and footer; every other page keeps the existing ones.
    const isHome = pathname.replace(/\/+$/, "") === pagePath(lang, "home").replace(/\/+$/, "");
    // Keeps the html lang attribute in step with the language of the address.
    useEffect(() => { document.documentElement.lang = lang; }, [lang]);
    return (
        <div className={isHome ? "home-theme min-h-screen bg-deep-950 font-sans text-mist antialiased" : "min-h-screen bg-white font-sans text-slate-600 antialiased"}>
            <ScrollOnNavigate />
            <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-amber focus:px-4 focus:py-2 focus:font-bold focus:text-navy-900">{S.common.skip}</a>
            {isHome ? <HomeHeader /> : <Navbar />}
            <main id="inhalt"><Outlet /></main>
            {isHome ? <HomeFooter /> : <Footer />}
            <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: "'Manrope Variable', Arial, sans-serif" } }} />
        </div>
    );
}
