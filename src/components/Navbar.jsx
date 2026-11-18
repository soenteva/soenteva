import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import LangSwitch from "@/components/LangSwitch";
import PillButton from "@/components/PillButton";
import { ChevronDownIcon, MenuIcon } from "@/components/icons";
import { NAV } from "@/data/site";
import { getApplications, applicationPath } from "@/data/applications";
import { getIndustries, industryPath } from "@/data/industries";
import { useI18n } from "@/i18n";

// White header in two rows: logo and language switch on top, the navigation row below (links with dropdowns for
// industries and applications, the contact button at the end). On a phone and tablet it is one row with a burger menu.
function useMenus() {
    const { lang, S, p } = useI18n();
    return {
        industries: { items: getIndustries(lang).map((i) => ({ label: i.title, to: industryPath(lang, i.id) })), all: S.nav.allIndustries, to: p("industries") },
        applications: { items: getApplications(lang).map((a) => ({ label: a.title, to: applicationPath(lang, a.id) })), all: S.nav.allApplications, to: p("applications") },
    };
}

const linkCls = ({ isActive }) =>
    `inline-flex items-center gap-1 border-b-[3px] px-3 py-3.5 text-[0.95rem] transition-colors ${isActive ? "border-lime font-semibold text-deep-800" : "border-transparent font-medium text-deep-800/80 hover:border-lime/60 hover:text-deep-800"}`;

function DesktopItem({ item, menus }) {
    const { S, p } = useI18n();
    const menu = item.menu ? menus[item.menu] : null;
    const label = S.nav.items[item.key];
    if (!menu) return <NavLink to={p(item.key)} className={linkCls}>{label}</NavLink>;
    return (
        <div className="group relative" data-testid={`menu-${item.menu}`}>
            <NavLink to={p(item.key)} className={linkCls}>{label}<ChevronDownIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" /></NavLink>
            <div className="invisible absolute left-0 top-full z-50 w-[30rem] pt-0 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="rounded-b-2xl border border-t-0 border-deep-800/10 bg-white p-3 shadow-2xl shadow-deep-950/25">
                    <ul className="grid grid-cols-2 gap-x-2">
                        {menu.items.map((m) => (
                            <li key={m.to}><Link to={m.to} className="block rounded-xl px-3 py-2 text-sm text-deep-800 hover:bg-deep-800/[.06]">{m.label}</Link></li>
                        ))}
                    </ul>
                    <Link to={menu.to} className="mt-2 block rounded-xl bg-lime px-3 py-2.5 text-sm font-semibold text-lime-ink hover:bg-[#d4f562]">{menu.all}</Link>
                </div>
            </div>
        </div>
    );
}

function MobileItem({ item, menus, close }) {
    const { S, p } = useI18n();
    const menu = item.menu ? menus[item.menu] : null;
    const label = S.nav.items[item.key];
    if (!menu) return <Link to={p(item.key)} onClick={close} className="block border-b border-deep-800/10 py-3.5 text-base font-medium text-deep-800">{label}</Link>;
    return (
        <details className="group border-b border-deep-800/10" data-testid={`mobile-menu-${item.menu}`}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-base font-medium text-deep-800">
                {label}
                <ChevronDownIcon className="h-4 w-4 text-deep-800 transition group-open:rotate-180" />
            </summary>
            <ul className="pb-3 pl-3">
                <li><Link to={menu.to} onClick={close} className="block py-2 text-sm font-semibold text-deep-800 underline decoration-lime decoration-2 underline-offset-4">{menu.all}</Link></li>
                {menu.items.map((m) => <li key={m.to}><Link to={m.to} onClick={close} className="block py-2 text-sm text-deep-800/80">{m.label}</Link></li>)}
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
        <header className="sticky top-0 z-40 bg-white text-deep-800 shadow-[0_1px_0_rgba(2,45,51,0.12)]" data-testid="navbar">
            <div className="mx-auto flex h-[68px] w-full max-w-[1140px] items-center justify-between px-5 sm:px-8 xl:px-0">
                <Logo tone="light" />
                <div className="hidden lg:block"><LangSwitch /></div>
                <div className="flex items-center gap-4 lg:hidden">
                    <LangSwitch testid="lang-switch-compact" />
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? S.nav.close : S.nav.menu}
                        className="inline-flex items-center gap-2 rounded-full border border-deep-800/30 px-4 py-2 text-sm font-medium text-deep-800 hover:border-deep-800"
                        data-testid="menu-toggle"
                    >
                        <MenuIcon open={open} className="h-5 w-5" />
                        <span>{open ? S.nav.close : S.nav.menu}</span>
                    </button>
                </div>
            </div>
            <div className="hidden border-t border-deep-800/10 lg:block">
                <nav className="mx-auto flex w-full max-w-[1140px] items-center justify-between px-8 xl:px-0" aria-label={S.nav.main}>
                    <div className="flex items-center">
                        {NAV.map((item) => <DesktopItem key={item.key} item={item} menus={menus} />)}
                    </div>
                    <PillButton to={p("contact")} size="sm" tone="light" arrow={false} data-testid="nav-contact">{S.nav.contact}</PillButton>
                </nav>
            </div>
            {open && (
                <nav id="mobile-menu" className="max-h-[calc(100vh-68px)] overflow-y-auto border-t border-deep-800/10 bg-white px-5 pb-6 sm:px-8 lg:hidden" aria-label={S.nav.mobile} data-testid="mobile-menu">
                    {NAV.map((item) => <MobileItem key={item.key} item={item} menus={menus} close={() => setOpen(false)} />)}
                    <div className="mt-5"><PillButton to={p("contact")} size="sm" tone="light" arrow={false} onClick={() => setOpen(false)}>{S.nav.contact}</PillButton></div>
                </nav>
            )}
        </header>
    );
}
