import { Palette, Layers } from "lucide-react";
import { Reveal, Chapter } from "./Reveal";
import { IMAGES } from "./data";

const CALLOUTS = [
    {
        icon: Palette,
        title: "The Psychology of Colour",
        copy: "Warm neutrals calm, sage restores, brass warms. We compose palettes around how a room should make you feel at 7am and at 11pm.",
    },
    {
        icon: Layers,
        title: "Material Selection",
        copy: "Marble, cane, lime plaster, fluted wood — every material is chosen for how it ages, not just how it photographs on handover day.",
    },
];

export default function Philosophy() {
    return (
        <section id="philosophy" data-testid="philosophy-section" className="pt-4 pb-28 lg:pb-36">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-14">
                <Chapter num="04" label="Design Philosophy" />
            </div>

            <Reveal className="relative h-[68vh] min-h-[440px] overflow-hidden">
                <img
                    src={IMAGES.portfolioChaise}
                    alt="Quiet corner of a finished interior"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center">
                    <blockquote className="max-w-3xl" data-testid="philosophy-quote">
                        <p className="font-serif font-light italic text-3xl sm:text-4xl lg:text-[3.2rem] leading-[1.15] text-[#F5F2EB]">
                            "Most clients focus on requirements, but true magic happens when you connect with the design
                            process and trust the designer's vision."
                        </p>
                        <footer className="mt-8 text-[11px] uppercase tracking-[0.25em] text-[#F5F2EB]/70">
                            Akshada Kisan Thorat — Founder, K K Designers
                        </footer>
                    </blockquote>
                </div>
            </Reveal>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-16 grid md:grid-cols-2 gap-6">
                {CALLOUTS.map((c, i) => (
                    <Reveal key={c.title} delay={i * 0.12}>
                        <div
                            data-testid={`philosophy-callout-${i}`}
                            className="group border border-black/10 p-10 hover:bg-white transition-colors duration-500 h-full"
                        >
                            <c.icon size={22} strokeWidth={1.5} className="text-[#8A9A86] mb-6" />
                            <h3 className="font-serif text-2xl">{c.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#4A4A4A]">{c.copy}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
