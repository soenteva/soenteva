import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import HomeLogo from "@/components/HomeLogo";
import LangSwitch from "@/components/LangSwitch";
import PillButton from "@/components/PillButton";
import { ChevronDownIcon, MenuIcon } from "@/components/icons";
import { NAV } from "@/data/site";
import { getApplications, applicationPath } from "@/data/applications";
import { getIndustries, industryPath } from "@/data/industries";
import { useI18n } from "@/i18n";

// Home page version of the Navbar: same links, dropdowns, language switch and test hooks, in the dark teal style.
function useMenus() {
    const { lang, S, p } = useI18n();
    return {
        industries: { items: getIndustries(lang).map((i) => ({ label: i.title, to: industryPath(lang, i.id) })), all: S.nav.allIndustries, to: p("industries") },
        applications: { items: getApplications(lang).map((a) => ({ label: a.title, to: applicationPath(lang, a.id) })), all: S.nav.allApplications, to: p("applications") },
    };
}

const linkCls = ({ isActive }) => `inline-flex items-center gap-1 rounded px-3 py-2 text-[0.95rem] transition-colors ${isActive ? "text-lime" : "text-[#fffffd] hover:text-lime"}`;
const LANG_LIME = "[&_a[aria-current='true']]:text-lime [&_a]:text-[#fffffd] [&_a:hover]:text-lime";

function DesktopItem({ item, menus }) {
    const { S, p } = useI18n();
    const menu = item.menu ? menus[item.menu] : null;
    const label = S.nav.items[item.key];
    if (!menu) return <NavLink to={p(item.key)} className={linkCls}>{label}</NavLink>;
    return (
        <div className="group relative" data-testid={`menu-${item.menu}`}>
            <NavLink to={p(item.key)} className={linkCls}>{label}<ChevronDownIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" /></NavLink>
            <div className="invisible absolute left-1/2 top-full z-50 w-[30rem] -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="rounded-3xl border border-white/[.14] bg-[#04252b] p-3 shadow-2xl shadow-black/40">
                    <ul className="grid grid-cols-2 gap-x-2">
                        {menu.items.map((m) => (
                            <li key={m.to}><Link to={m.to} className="block rounded-xl px-3 py-2 text-sm text-mist hover:bg-white/[.07] hover:text-lime">{m.label}</Link></li>
                        ))}
                    </ul>
                    <Link to={menu.to} className="mt-2 block rounded-xl bg-lime/10 px-3 py-2 text-sm font-semibold text-lime hover:bg-lime/20">{menu.all}</Link>
                </div>
            </div>
        </div>
    );
}

function MobileItem({ item, menus, close }) {
    const { S, p } = useI18n();
    const menu = item.menu ? menus[item.menu] : null;
    const label = S.nav.items[item.key];
    if (!menu) return <Link to={p(item.key)} onClick={close} className="block border-b border-white/[.12] py-3.5 text-base text-[#fffffd]">{label}</Link>;
    return (
        <details className="group border-b border-white/[.12]" data-testid={`mobile-menu-${item.menu}`}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-base text-[#fffffd]">
                {label}
                <ChevronDownIcon className="h-4 w-4 text-lime transition group-open:rotate-180" />
            </summary>
            <ul className="pb-3 pl-3">
                <li><Link to={menu.to} onClick={close} className="block py-2 text-sm font-semibold text-lime">{menu.all}</Link></li>
                {menu.items.map((m) => <li key={m.to}><Link to={m.to} onClick={close} className="block py-2 text-sm text-mist">{m.label}</Link></li>)}
            </ul>
        </details>
    );
}

export default function HomeHeader() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const { S, p } = useI18n();
    const menus = useMenus();
    useEffect(() => { setOpen(false); }, [pathname]);
    return (
        <header className="sticky top-0 z-40 border-b border-white/[.14] bg-[#032e35]/90 backdrop-blur" data-testid="navbar">
            <div className="mx-auto flex h-[76px] w-full max-w-[1140px] items-center justify-between px-5 sm:px-8 xl:h-[100px] xl:px-0">
                <HomeLogo />
                <nav className="hidden items-center gap-1 xl:flex" aria-label={S.nav.main}>
                    {NAV.map((item) => <DesktopItem key={item.key} item={item} menus={menus} />)}
                    <LangSwitch className={`ml-3 ${LANG_LIME}`} />
                    <PillButton to={p("contact")} size="sm" arrow={false} className="ml-4" data-testid="nav-contact">{S.nav.contact}</PillButton>
                </nav>
                <div className="flex items-center gap-4 xl:hidden">
                    <LangSwitch testid="lang-switch-compact" className={LANG_LIME} />
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? S.nav.close : S.nav.menu}
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-[#fffffd] hover:border-lime hover:text-lime"
                        data-testid="menu-toggle"
                    >
                        <MenuIcon open={open} className="h-5 w-5" />
                        <span>{open ? S.nav.close : S.nav.menu}</span>
                    </button>
                </div>
            </div>
            {open && (
                <nav id="mobile-menu" className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-white/[.12] bg-[#032e35] px-5 pb-6 sm:px-8 xl:hidden" aria-label={S.nav.mobile} data-testid="mobile-menu">
                    {NAV.map((item) => <MobileItem key={item.key} item={item} menus={menus} close={() => setOpen(false)} />)}
                    <div className="mt-5"><PillButton to={p("contact")} size="sm" arrow={false} onClick={() => setOpen(false)}>{S.nav.contact}</PillButton></div>
                </nav>
            )}
        </header>
    );
}
