import { Reveal, Chapter } from "./Reveal";
import { IMAGES } from "./data";

const TRAITS = ["Hands-on Site Execution", "Space Optimisation", "Colour Psychology", "Photorealistic 3D"];

export default function About() {
    return (
        <section id="about" data-testid="about-section" className="py-28 lg:py-36">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                <Chapter num="01" label="The Founder" />
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    <Reveal className="lg:col-span-5 relative">
                        <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#BCAAA4]/30 pointer-events-none" />
                        <div className="relative overflow-hidden group aspect-[4/5]">
                            <img
                                src={IMAGES.founder}
                                alt="Akshada Thorat — Founder, K K Designers"
                                data-testid="founder-portrait"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                            Akshada Thorat — Interior Designer & 3D Visualiser
                        </p>
                    </Reveal>

                    <div className="lg:col-span-7 lg:pt-6">
                        <Reveal delay={0.1}>
                            <h2 className="font-serif font-light text-4xl sm:text-5xl leading-tight tracking-tight" data-testid="about-title">
                                Meet <em className="italic text-[#8A9A86]">Akshada</em> Thorat
                            </h2>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-8 text-[15px] leading-relaxed text-[#4A4A4A] max-w-xl">
                                Akshada works where most designers don't — on the raw site. As an interior designer and 3D
                                visualiser, she bridges the gap between a photorealistic concept and the dust, wiring and
                                wood framing it takes to build it. Her approach pairs rigorous space optimisation with an
                                intuitive grasp of colour psychology, so every home feels as considered as it looks.
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <blockquote className="mt-10 border-l-2 border-[#8A9A86] pl-6 font-serif italic text-2xl leading-snug text-[#1A1A1A]/85 max-w-xl" data-testid="about-value-prop">
                                "We don't just supply 3D drawings; we stay on site through the raw stage to the final
                                handover to ensure every detail matches the vision."
                            </blockquote>
                        </Reveal>
                        <Reveal delay={0.4} className="mt-10 flex flex-wrap gap-3">
                            {TRAITS.map((t) => (
                                <span
                                    key={t}
                                    className="text-[11px] uppercase tracking-[0.15em] border border-[#1A1A1A]/20 px-4 py-2 hover:bg-[#1A1A1A] hover:text-[#F5F2EB] transition-colors duration-300 cursor-default"
                                >
                                    {t}
                                </span>
                            ))}
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
