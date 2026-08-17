import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 30 }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
        {children}
    </motion.div>
);

export const Chapter = ({ num, label, dark = false }) => (
    <Reveal className="flex items-center gap-4 mb-10">
        <span className={`font-serif italic text-lg ${dark ? "text-[#BCAAA4]" : "text-[#8A9A86]"}`}>{num}</span>
        <span className={`h-px w-12 ${dark ? "bg-white/30" : "bg-[#1A1A1A]/30"}`} />
        <span
            className={`uppercase text-xs tracking-[0.25em] font-medium ${dark ? "text-white/70" : "text-[#1A1A1A]/60"}`}
        >
            {label}
        </span>
    </Reveal>
);
