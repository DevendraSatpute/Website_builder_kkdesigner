import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Chapter } from "./Reveal";
import CompareSlider from "./CompareSlider";
import { IMAGES, RAW_TO_FINAL, HIGHLIGHTS, COMMERCIAL } from "./data";

const TABS = [
    { id: "accuracy", label: "3D Render vs Real Site" },
    { id: "journey", label: "Raw Stage to Final Touch" },
    { id: "highlights", label: "Feature Highlights" },
    { id: "commercial", label: "Commercial Offices" },
];

const GridCard = ({ item, testId }) => (
    <figure className={`group relative overflow-hidden col-span-1 ${item.span}`} data-testid={testId}>
        <img
            src={item.src}
            alt={item.title}
            className="w-full h-full min-h-[240px] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#BCAAA4]">{item.tag}</span>
            <p className="font-serif text-xl text-white mt-1">{item.title}</p>
        </figcaption>
    </figure>
);

const AccuracyTab = () => (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
            <CompareSlider
                before={IMAGES.renderBefore}
                after={IMAGES.realAfter}
                testId="portfolio-compare-slider"
                className="aspect-[16/10]"
            />
        </div>
        <div className="lg:col-span-4 lg:pt-4">
            <p className="uppercase text-xs tracking-[0.25em] text-[#8A9A86] mb-4">The Accuracy Guarantee</p>
            <h3 className="font-serif text-3xl leading-snug">What you approve is what we build.</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#4A4A4A]">
                Every project begins as a photorealistic 3D render — materials, lighting and furniture placed to scale.
                Because we supervise the site ourselves, the finished room honours that render down to the cove light.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="border-t border-black/10 pt-4">
                    <p className="font-serif text-3xl">1:1</p>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]/50 mt-1">Render Fidelity Goal</p>
                </div>
                <div className="border-t border-black/10 pt-4">
                    <p className="font-serif text-3xl">On-site</p>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]/50 mt-1">Daily Supervision</p>
                </div>
            </div>
        </div>
    </div>
);

export default function Portfolio() {
    const [tab, setTab] = useState("accuracy");

    return (
        <section id="portfolio" data-testid="portfolio-section" className="py-28 lg:py-36">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                <Chapter num="03" label="Portfolio" />
                <Reveal>
                    <h2 className="font-serif font-light text-4xl sm:text-5xl leading-tight tracking-tight mb-12 max-w-2xl">
                        The proof is in the <em className="italic text-[#8A9A86]">handover</em>
                    </h2>
                </Reveal>

                <div className="flex flex-wrap gap-x-10 gap-y-4 border-b border-black/10 mb-12" data-testid="portfolio-tabs">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            data-testid={`portfolio-tab-${t.id}`}
                            onClick={() => setTab(t.id)}
                            className={`relative pb-4 text-[12px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                                tab === t.id ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
                            }`}
                        >
                            {t.label}
                            {tab === t.id && (
                                <motion.span layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8A9A86]" />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {tab === "accuracy" && <AccuracyTab />}
                        {tab === "journey" && (
                            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[260px] gap-5" data-testid="portfolio-journey-grid">
                                {RAW_TO_FINAL.map((item, i) => (
                                    <GridCard key={item.title} item={item} testId={`journey-card-${i}`} />
                                ))}
                            </div>
                        )}
                        {tab === "highlights" && (
                            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[260px] gap-5" data-testid="portfolio-highlights-grid">
                                {HIGHLIGHTS.map((item, i) => (
                                    <GridCard key={item.title} item={item} testId={`highlight-card-${i}`} />
                                ))}
                            </div>
                        )}
                        {tab === "commercial" && (
                            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[260px] gap-5" data-testid="portfolio-commercial-grid">
                                {COMMERCIAL.map((item, i) => (
                                    <GridCard key={item.title} item={item} testId={`commercial-card-${i}`} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
