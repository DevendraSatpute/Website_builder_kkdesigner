import { useState } from "react";
import { Instagram, MapPin, Mail, Send, CheckCircle2 } from "lucide-react";
import { Reveal, Chapter } from "./Reveal";
import { EMAIL, INSTAGRAM_URL } from "./data";

const PROJECT_TYPES = ["Bungalow / Villa", "Apartment", "Luxury Washroom", "3D Render Only"];
const STYLES = ["Modern Minimal", "Contemporary Luxury", "Warm Traditional", "Japandi / Earthy", "Not sure yet — guide me"];

const inputCls =
    "w-full bg-transparent border border-white/20 px-5 py-4 text-sm text-[#F5F2EB] placeholder:text-white/40 focus:outline-none focus:border-[#8A9A86] transition-colors duration-300";

export default function Contact() {
    const [form, setForm] = useState({ name: "", phone: "", location: "", type: PROJECT_TYPES[0], style: STYLES[0] });
    const [status, setStatus] = useState("idle");
    const [draftUrl, setDraftUrl] = useState("");
    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const submit = (e) => {
        e.preventDefault();
        const subject = `New enquiry — ${form.name} (${form.type})`;
        const body = `Hi Akshada, I'm ${form.name} from ${form.location}. I'm planning a ${form.type} project and I like the "${form.style}" style. I'd like to book a consultation. You can reach me on ${form.phone}.`;
        const url = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setDraftUrl(url);
        setStatus("opened");
        window.location.href = url;
    };

    return (
        <section id="contact" data-testid="contact-section" className="bg-[#1A1A1A] text-[#F5F2EB] py-28 lg:py-36">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                <Chapter num="05" label="Contact" dark />
                <div className="grid lg:grid-cols-12 gap-14">
                    <div className="lg:col-span-5">
                        <Reveal>
                            <h2 className="font-serif font-light text-4xl sm:text-5xl leading-tight tracking-tight" data-testid="contact-title">
                                Let's Build Your <em className="italic text-[#BCAAA4]">Dream Space</em>
                            </h2>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <p className="mt-6 text-sm leading-relaxed text-white/60 max-w-md">
                                Tell us a little about your project — the form opens a ready-made email draft in
                                your mail app, addressed to Akshada. Just press send.
                            </p>
                        </Reveal>
                        <Reveal delay={0.25} className="mt-10 space-y-5">
                            <a
                                href={`mailto:${EMAIL}`}
                                data-testid="contact-email-link"
                                className="flex items-center gap-4 text-sm group w-fit"
                            >
                                <span className="h-10 w-10 border border-white/20 flex items-center justify-center group-hover:bg-[#8A9A86] group-hover:border-[#8A9A86] transition-colors duration-300">
                                    <Mail size={16} />
                                </span>
                                {EMAIL}
                            </a>
                            <a
                                href={INSTAGRAM_URL}
                                target="_blank"
                                rel="noreferrer"
                                data-testid="contact-instagram-link"
                                className="flex items-center gap-4 text-sm group w-fit"
                            >
                                <span className="h-10 w-10 border border-white/20 flex items-center justify-center group-hover:bg-[#8A9A86] group-hover:border-[#8A9A86] transition-colors duration-300">
                                    <Instagram size={16} />
                                </span>
                                @k_k_designers on Instagram
                            </a>
                            <p className="flex items-center gap-4 text-sm text-white/60">
                                <span className="h-10 w-10 border border-white/20 flex items-center justify-center">
                                    <MapPin size={16} />
                                </span>
                                Pune, Maharashtra & nearby areas
                            </p>
                        </Reveal>
                    </div>

                    <Reveal delay={0.2} className="lg:col-span-7">
                        {status === "opened" ? (
                            <div data-testid="form-success-message" className="border border-[#8A9A86]/50 p-10 flex flex-col items-start gap-4">
                                <CheckCircle2 size={28} className="text-[#8A9A86]" />
                                <p className="font-serif text-3xl">Your draft is ready.</p>
                                <p className="text-sm text-white/60 leading-relaxed max-w-md">
                                    We've opened your email app with everything pre-filled — just press send. If
                                    nothing opened, tap the button below to try again.
                                </p>
                                <a
                                    href={draftUrl}
                                    data-testid="open-draft-link"
                                    className="inline-flex items-center gap-3 bg-[#F5F2EB] text-[#1A1A1A] text-[11px] uppercase tracking-[0.2em] px-7 py-4 hover:bg-[#8A9A86] transition-colors duration-300"
                                >
                                    Open Email Draft
                                </a>
                                <button
                                    data-testid="form-send-another-btn"
                                    onClick={() => {
                                        setStatus("idle");
                                        setForm({ name: "", phone: "", location: "", type: PROJECT_TYPES[0], style: STYLES[0] });
                                    }}
                                    className="mt-2 text-[11px] uppercase tracking-[0.2em] border-b border-[#8A9A86] pb-1 hover:text-[#8A9A86] transition-colors duration-300"
                                >
                                    Fill the form again
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} data-testid="consultation-form" className="grid sm:grid-cols-2 gap-5">
                                <input required value={form.name} onChange={set("name")} placeholder="Your Name" data-testid="form-name-input" className={inputCls} />
                                <input required value={form.phone} onChange={set("phone")} placeholder="Phone Number" data-testid="form-phone-input" className={inputCls} />
                                <input required value={form.location} onChange={set("location")} placeholder="Location in Pune / nearby area" data-testid="form-location-input" className={`${inputCls} sm:col-span-2`} />
                                <select value={form.type} onChange={set("type")} data-testid="form-project-type-select" className={`${inputCls} appearance-none bg-[#1A1A1A]`}>
                                    {PROJECT_TYPES.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                                <select value={form.style} onChange={set("style")} data-testid="form-style-select" className={`${inputCls} appearance-none bg-[#1A1A1A]`}>
                                    {STYLES.map((s) => (
                                        <option key={s}>{s}</option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    data-testid="form-submit-button"
                                    className="sm:col-span-2 group inline-flex items-center justify-center gap-3 bg-[#F5F2EB] text-[#1A1A1A] text-[12px] uppercase tracking-[0.2em] px-8 py-5 hover:bg-[#8A9A86] transition-colors duration-300"
                                >
                                    Send Enquiry
                                    <Send size={15} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                                </button>
                            </form>
                        )}
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
