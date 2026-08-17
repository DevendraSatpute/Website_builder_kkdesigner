import { Box, Home, HardHat, Paintbrush, ArrowUpRight } from "lucide-react";
import { Reveal, Chapter } from "./Reveal";
import { SERVICES } from "./data";
import { scrollToSection } from "./Navbar";

const ICONS = [Box, Home, HardHat, Paintbrush];

export default function Services() {
    return (
        <section id="services" data-testid="services-section" className="py-28 lg:py-36 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                <Chapter num="02" label="What We Do" />
                <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
                    <Reveal>
                        <h2 className="font-serif font-light text-4xl sm:text-5xl leading-tight tracking-tight max-w-xl">
                            From first sketch to <em className="italic text-[#8A9A86]">final handover</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="max-w-sm text-sm leading-relaxed text-[#4A4A4A]">
                            Four disciplines, one team — so the design you approve is the home you move into.
                        </p>
                    </Reveal>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SERVICES.map((s, i) => {
                        const Icon = ICONS[i];
                        return (
                            <Reveal key={s.id} delay={i * 0.1}>
                                <article
                                    data-testid={`service-card-${s.id}`}
                                    className="group border border-black/10 bg-[#F5F2EB] hover:bg-white transition-colors duration-500 flex flex-col h-full"
                                >
                                    <div className="overflow-hidden aspect-[4/3]">
                                        <img
                                            src={s.image}
                                            alt={s.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-7 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-5">
                                            <Icon size={20} strokeWidth={1.5} className="text-[#8A9A86]" />
                                            <span className="font-serif italic text-[#BCAAA4]">{s.num}</span>
                                        </div>
                                        <h3 className="font-serif text-2xl leading-snug">{s.title}</h3>
                                        <p className="mt-3 text-[13px] leading-relaxed text-[#4A4A4A] flex-1">{s.copy}</p>
                                        <button
                                            data-testid={`service-cta-${s.id}`}
                                            onClick={() => scrollToSection("#contact")}
                                            className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 group-hover:text-[#1A1A1A] transition-colors duration-300"
                                        >
                                            Enquire
                                            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </button>
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
