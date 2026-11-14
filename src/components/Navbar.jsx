import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import LangSwitch from "@/components/LangSwitch";
import { NAV } from "@/data/site";
import { getApplications, applicationPath } from "@/data/applications";
import { getIndustries, industryPath } from "@/data/industries";
import { useI18n } from "@/i18n";

// Dropdown content per language: all industries and all applications plus a link to the overview page.
function useMenus() {
    const { lang, S, p } = useI18n();
    return {
        industries: { items: getIndustries(lang).map((i) => ({ label: i.title, to: industryPath(lang, i.id) })), all: S.nav.allIndustries, to: p("industries") },
        applications: { items: getApplications(lang).map((a) => ({ label: a.title, to: applicationPath(lang, a.id) })), all: S.nav.allApplications, to: p("applications") },
    };
}

const linkCls = ({ isActive }) =>
    `rounded px-3 py-2 text-sm font-semibold transition-colors ${isActive ? "text-amber" : "text-white hover:text-amber"}`;

function DesktopItem({ item, menus }) {
    const { S, p } = useI18n();
    const menu = item.menu ? menus[item.menu] : null;
    const label = S.nav.items[item.key];
    if (!menu) return <NavLink to={p(item.key)} className={linkCls}>{label}</NavLink>;
    return (
        <div className="group relative" data-testid={`menu-${item.menu}`}>
            <NavLink to={p(item.key)} className={linkCls}>{label}</NavLink>
            <div className="invisible absolute left-1/2 top-full z-50 w-[30rem] -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="rounded-lg border border-navy-200/30 bg-white p-3 shadow-2xl shadow-navy-900/30">
                    <ul className="grid grid-cols-2 gap-x-2">
                        {menu.items.map((m) => (
                            <li key={m.to}><Link to={m.to} className="block rounded px-3 py-2 text-sm font-medium text-navy hover:bg-navy-50 hover:text-navy-700">{m.label}</Link></li>
                        ))}
                    </ul>
                    <Link to={menu.to} className="mt-2 block rounded bg-navy-50 px-3 py-2 text-sm font-bold text-navy hover:bg-amber-100">{menu.all}</Link>
                </div>
            </div>
        </div>
    );
}

function MobileItem({ item, menus, close }) {
    const { S, p } = useI18n();
    const menu = item.menu ? menus[item.menu] : null;
    const label = S.nav.items[item.key];
    if (!menu) return <Link to={p(item.key)} onClick={close} className="block border-b border-white/10 py-3.5 text-base font-semibold text-white">{label}</Link>;
    return (
        <details className="group border-b border-white/10" data-testid={`mobile-menu-${item.menu}`}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-base font-semibold text-white">
                {label}
                <span className="text-amber transition group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <ul className="pb-3 pl-3">
                <li><Link to={menu.to} onClick={close} className="block py-2 text-sm font-bold text-amber">{menu.all}</Link></li>
                {menu.items.map((m) => <li key={m.to}><Link to={m.to} onClick={close} className="block py-2 text-sm text-navy-200">{m.label}</Link></li>)}
            </ul>
        </details>
    );
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const { S, p } = useI18n();
    const menus = useMenus();
    useEffect(() => { setOpen(false); }, [pathname]);
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur" data-testid="navbar">
            <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
                <Logo />
                <nav className="hidden items-center gap-1 lg:flex" aria-label={S.nav.main}>
                    {NAV.map((item) => <DesktopItem key={item.key} item={item} menus={menus} />)}
                    <LangSwitch className="ml-4" />
                    <Link to={p("contact")} className="ml-4 rounded-md bg-amber px-5 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-amber-600" data-testid="nav-contact">{S.nav.contact}</Link>
                </nav>
                <div className="flex items-center gap-3 lg:hidden">
                    <LangSwitch testid="lang-switch-compact" />
                    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" className="rounded border border-white/30 px-4 py-2 text-sm font-bold text-white" data-testid="menu-toggle">
                        {open ? S.nav.close : S.nav.menu}
                    </button>
                </div>
            </div>
            {open && (
                <nav id="mobile-menu" className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-white/10 bg-navy px-5 pb-6 lg:hidden" aria-label={S.nav.mobile} data-testid="mobile-menu">
                    {NAV.map((item) => <MobileItem key={item.key} item={item} menus={menus} close={() => setOpen(false)} />)}
                    <Link to={p("contact")} onClick={() => setOpen(false)} className="mt-5 block rounded-md bg-amber px-5 py-3.5 text-center text-sm font-bold text-navy-900">{S.nav.contact}</Link>
                </nav>
            )}
        </header>
    );
}
