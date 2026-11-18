import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import PillButton from "@/components/PillButton";
import { Ph } from "@/components/ui";
import { getApplications, applicationPath } from "@/data/applications";
import { COMPANY, NAV } from "@/data/site";
import { useI18n } from "@/i18n";

// Wide dark footer, full page width: about text, pages, all applications (two sub-columns when there is room),
// the address with a button to the contact page; below the legal links.
const link = "text-[0.95rem] text-mist transition-colors hover:text-lime";
const heading = "mb-5 font-display text-base font-bold text-[#fffffd] whole-words";

export default function Footer() {
    const { lang, S, p } = useI18n();
    return (
        <footer className="border-t-4 border-lime bg-deep-950 text-mist" data-testid="footer">
            <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[13rem_1fr_2fr_1.2fr] lg:px-12 lg:py-[72px] xl:px-16">
                <div>
                    <Logo />
                    <p className="mt-6 max-w-[19rem] text-[0.95rem] leading-relaxed">{S.footer.about}</p>
                </div>
                <div>
                    <h3 className={heading}>{S.footer.pages}</h3>
                    <ul className="space-y-3">
                        {NAV.map((n) => <li key={n.key}><Link className={link} to={p(n.key)}>{S.nav.items[n.key]}</Link></li>)}
                        <li><Link className={link} to={p("contact")}>{S.nav.contact}</Link></li>
                    </ul>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <h3 className={heading}>{S.footer.applications}</h3>
                    <ul className="gap-x-8 sm:columns-2 lg:columns-1 xl:columns-2 [&>li]:mb-3 [&>li]:break-inside-avoid">
                        {getApplications(lang).map((a) => <li key={a.id}><Link className={link} to={applicationPath(lang, a.id)}>{a.title}</Link></li>)}
                    </ul>
                </div>
                <div>
                    <h3 className={heading}>{S.footer.contact}</h3>
                    <address className="space-y-1.5 text-[0.95rem] not-italic leading-relaxed" data-testid="footer-address">
                        <p className="font-semibold text-[#fffffd]">{COMPANY.name}</p>
                        <p>{COMPANY.streetFromRegister}</p>
                        <p>{COMPANY.city}</p>
                        <p>{S.common.phone} <Ph value={COMPANY.phone} /></p>
                        <p>{S.common.email} <Ph value={COMPANY.email} /></p>
                    </address>
                    <PillButton to={p("contact")} size="sm" arrow={false} className="mt-6">{S.nav.contact}</PillButton>
                </div>
            </div>
            <div className="border-t border-white/[.14]">
                <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-3 px-5 py-6 text-sm sm:px-8 md:flex-row md:justify-between lg:px-12 xl:px-16">
                    <p>© {new Date().getFullYear()} {COMPANY.name}</p>
                    <ul className="flex gap-6">
                        <li><Link className="hover:text-lime" to={p("legal")}>{S.footer.legal}</Link></li>
                        <li><Link className="hover:text-lime" to={p("privacy")}>{S.footer.privacy}</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
