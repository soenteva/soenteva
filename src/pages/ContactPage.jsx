import { useState } from "react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import GlassCard from "@/components/GlassCard";
import Section from "@/components/Section";
import { ButtonEl, Ph } from "@/components/ui";
import { COMPANY } from "@/data/site";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { Link } from "react-router-dom";

const inputCls = "w-full rounded-xl border border-white/15 bg-deep-card px-4 py-3 text-sm text-[#fffffd] outline-none [color-scheme:dark] focus:border-lime focus:ring-2 focus:ring-lime/40";
const Field = ({ label, required, children }) => (
    <label className="block"><span className="mb-2 block text-sm font-semibold text-[#fffffd]">{label}{required && <span aria-hidden="true"> *</span>}</span>{children}</label>
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
            <Section tone="teal" testid="contact">
                <div className="grid gap-12 lg:grid-cols-12">
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
                        <label className="mt-5 flex items-start gap-3 text-sm text-mist">
                            <input type="checkbox" checked={form.consent} onChange={set("consent")} className="mt-1 h-4 w-4 accent-lime" data-testid="contact-consent" />
                            <span>{c.consent[0]}<Link to={p("privacy")} className="font-semibold text-lime underline decoration-lime/50 decoration-2 underline-offset-4 hover:decoration-lime">{c.consent[1]}</Link>{c.consent[2]}</span>
                        </label>
                        <ButtonEl type="submit" className="mt-7" data-testid="contact-submit">{c.submit}</ButtonEl>
                    </form>
                    <aside className="lg:col-span-4" data-testid="contact-details">
                        <GlassCard tone="moss" innerClassName="p-7 sm:p-8">
                            <h2 className="font-display text-[0.95rem] font-bold leading-snug text-lime whole-words">{c.addressTitle}</h2>
                            <address className="mt-4 space-y-1 not-italic leading-relaxed text-mist">
                                <p className="font-semibold text-[#fffffd]">{COMPANY.name}</p>
                                <p>{COMPANY.streetFromRegister}</p>
                                <p>{COMPANY.city}</p>
                            </address>
                            <h2 className="mt-8 font-display text-[0.95rem] font-bold leading-snug text-lime whole-words">{c.directTitle}</h2>
                            <p className="mt-4 text-mist">{S.common.phone} <Ph value={COMPANY.phone} /></p>
                            <p className="mt-1 text-mist">{S.common.email} <Ph value={COMPANY.email} /></p>
                        </GlassCard>
                    </aside>
                </div>
            </Section>
        </>
    );
}
