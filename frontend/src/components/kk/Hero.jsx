import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CompareSlider from "./CompareSlider";
import { scrollToSection } from "./Navbar";
import { IMAGES } from "./data";

const LINES = ["Transforming Raw", "Spaces into Bespoke", "Living Experiences"];

export default function Hero() {
    const { scrollY } = useScroll();
    const yImage = useTransform(scrollY, [0, 800], [0, 90]);
    const yText = useTransform(scrollY, [0, 800], [0, -60]);

    return (
        <section id="home" data-testid="hero-section" className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16">
            <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-[#8A9A86]/10 blur-3xl pointer-events-none" />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                <motion.div style={{ y: yText }} className="lg:col-span-6 relative z-10">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="uppercase text-xs tracking-[0.3em] text-[#1A1A1A]/60 mb-8"
                        data-testid="hero-eyebrow"
                    >
                        Interior Design · 3D Visualisation · Pune
                    </motion.p>

                    <h1 className="font-serif font-light text-[13vw] sm:text-6xl lg:text-[4.6rem] leading-[1.02] tracking-tight" data-testid="hero-headline">
                        {LINES.map((text, i) => (
                            <span key={text} className="block overflow-hidden pb-1">
                                <motion.span
                                    className="block"
                                    initial={{ y: "115%" }}
                                    animate={{ y: "0%" }}
                                    transition={{ duration: 1.05, delay: 0.25 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {i === 2 ? (
                                        <>
                                            Living <em className="italic text-[#8A9A86]">Experiences</em>
                                        </>
                                    ) : (
                                        text
                                    )}
                                </motion.span>
                            </span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-8 max-w-md text-[15px] leading-relaxed text-[#4A4A4A]"
                        data-testid="hero-subheadline"
                    >
                        Led by Akshada Kisan Thorat — bringing high-end 3D visual concepts to life through hands-on site
                        execution in Pune.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <button
                            data-testid="hero-view-portfolio-btn"
                            onClick={() => scrollToSection("#portfolio")}
                            className="group inline-flex items-center gap-3 bg-[#1A1A1A] text-[#F5F2EB] text-[12px] uppercase tracking-[0.15em] px-8 py-4 hover:bg-[#8A9A86] hover:text-[#1A1A1A] transition-colors duration-300"
                        >
                            View Portfolio
                            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                        <button
                            data-testid="hero-consult-btn"
                            onClick={() => scrollToSection("#contact")}
                            className="inline-flex items-center gap-3 border border-[#1A1A1A]/30 text-[12px] uppercase tracking-[0.15em] px-8 py-4 hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F2EB] transition-colors duration-300"
                        >
                            Consult Our Team
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.25 }}
                        className="mt-14 flex gap-10"
                        data-testid="hero-stats"
                    >
                        {[
                            ["40+", "Projects Delivered"],
                            ["100%", "Render-to-Reality Focus"],
                            ["Pune", "& Nearby Areas"],
                        ].map(([num, label]) => (
                            <div key={label}>
                                <p className="font-serif text-3xl">{num}</p>
                                <p className="text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]/50 mt-1">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div style={{ y: yImage }} className="lg:col-span-6 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="absolute -top-4 -left-4 w-full h-full border border-[#BCAAA4]/60 pointer-events-none" />
                        <CompareSlider
                            before={IMAGES.renderBefore}
                            after={IMAGES.realAfter}
                            testId="hero-compare-slider"
                            className="aspect-[4/3] shadow-[0_40px_80px_-30px_rgba(26,26,26,0.3)]"
                        />
                        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 flex items-center gap-2">
                            <span className="h-px w-6 bg-[#1A1A1A]/30" />
                            Drag to compare — concept render vs finished handover
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
