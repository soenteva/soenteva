import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Container, Ph } from "@/components/ui";
import { getApplications, applicationPath } from "@/data/applications";
import { COMPANY, NAV } from "@/data/site";
import { useI18n } from "@/i18n";

const col = "text-sm text-navy-200 hover:text-amber";

export default function Footer() {
    const { lang, S, p } = useI18n();
    return (
        <footer className="bg-navy-900 text-navy-200" data-testid="footer">
            <Container className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <Logo />
                    <p className="mt-5 max-w-xs text-sm leading-relaxed">{S.footer.about}</p>
                </div>
                <div>
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber">{S.footer.pages}</h3>
                    <ul className="space-y-2.5">
                        {NAV.map((n) => <li key={n.key}><Link className={col} to={p(n.key)}>{S.nav.items[n.key]}</Link></li>)}
                        <li><Link className={col} to={p("contact")}>{S.nav.contact}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber">{S.footer.applications}</h3>
                    <ul className="space-y-2.5">
                        {getApplications(lang).slice(0, 6).map((a) => <li key={a.id}><Link className={col} to={applicationPath(lang, a.id)}>{a.title}</Link></li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber">{S.footer.contact}</h3>
                    <address className="space-y-1.5 text-sm not-italic leading-relaxed" data-testid="footer-address">
                        <p className="font-semibold text-white">{COMPANY.name}</p>
                        <p>{COMPANY.streetFromRegister}</p>
                        <p>{COMPANY.city}</p>
                        <p>{S.common.phone} <Ph value={COMPANY.phone} /></p>
                        <p>{S.common.email} <Ph value={COMPANY.email} /></p>
                    </address>
                </div>
            </Container>
            <div className="border-t border-white/10">
                <Container className="flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} {COMPANY.name}</p>
                    <ul className="flex gap-5">
                        <li><Link className="hover:text-amber" to={p("legal")}>{S.footer.legal}</Link></li>
                        <li><Link className="hover:text-amber" to={p("privacy")}>{S.footer.privacy}</Link></li>
                    </ul>
                </Container>
            </div>
        </footer>
    );
}
