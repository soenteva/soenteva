import { useState } from "react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import { ButtonEl, Container, Ph } from "@/components/ui";
import { COMPANY } from "@/data/site";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { Link } from "react-router-dom";

const inputCls = "w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:border-navy focus:ring-2 focus:ring-amber/60";
const Field = ({ label, required, children }) => (
    <label className="block"><span className="mb-2 block text-sm font-semibold text-navy">{label}{required && <span aria-hidden="true"> *</span>}</span>{children}</label>
);

export default function ContactPage() {
    const { S, p } = useI18n();
    const c = S.contact;
    useDocumentMeta(c.title, c.description);
    const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", service: "", message: "", consent: false });
    const set = (key) => (event) => setForm({ ...form, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
    const submit = (event) => {
        event.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { toast.error(c.errorRequired); return; }
        if (!form.consent) { toast.error(c.errorConsent); return; }
        toast.info(c.infoPreview);
    };
    return (
        <>
            <PageHero eyebrow={c.title} title={c.heroTitle} crumbs={[{ label: c.title }]} lead={c.heroLead} />
            <section className="py-20" data-testid="contact">
                <Container className="grid gap-12 lg:grid-cols-12">
                    <form onSubmit={submit} className="lg:col-span-8" data-testid="contact-form" noValidate>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label={c.name} required><input className={inputCls} value={form.name} onChange={set("name")} autoComplete="name" data-testid="contact-name" /></Field>
                            <Field label={c.company}><input className={inputCls} value={form.company} onChange={set("company")} autoComplete="organization" /></Field>
                            <Field label={c.email} required><input type="email" className={inputCls} value={form.email} onChange={set("email")} autoComplete="email" data-testid="contact-email" /></Field>
                            <Field label={c.phone}><input type="tel" className={inputCls} value={form.phone} onChange={set("phone")} autoComplete="tel" /></Field>
                        </div>
                        <div className="mt-5">
                            <Field label={c.service}>
                                <select className={inputCls} value={form.service} onChange={set("service")}>
                                    <option value="">{c.choose}</option>
                                    {S.services.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </Field>
                        </div>
                        <div className="mt-5"><Field label={c.message} required><textarea rows={5} className={inputCls} value={form.message} onChange={set("message")} data-testid="contact-message" /></Field></div>
                        <label className="mt-5 flex items-start gap-3 text-sm">
                            <input type="checkbox" checked={form.consent} onChange={set("consent")} className="mt-1 h-4 w-4 accent-navy" data-testid="contact-consent" />
                            <span>{c.consent[0]}<Link to={p("privacy")} className="font-bold text-navy underline decoration-amber decoration-2 underline-offset-4">{c.consent[1]}</Link>{c.consent[2]}</span>
                        </label>
                        <ButtonEl type="submit" className="mt-7" data-testid="contact-submit">{c.submit}</ButtonEl>
                    </form>
                    <aside className="lg:col-span-4" data-testid="contact-details">
                        <div className="rounded-xl bg-navy p-8 text-white">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-amber">{c.addressTitle}</h2>
                            <address className="mt-4 space-y-1 not-italic leading-relaxed">
                                <p className="font-bold">{COMPANY.name}</p>
                                <p>{COMPANY.streetFromRegister}</p>
                                <p>{COMPANY.city}</p>
                            </address>
                            <h2 className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-amber">{c.directTitle}</h2>
                            <p className="mt-4">{S.common.phone} <Ph value={COMPANY.phone} /></p>
                            <p className="mt-1">{S.common.email} <Ph value={COMPANY.email} /></p>
                        </div>
                    </aside>
                </Container>
            </section>
        </>
    );
}
