import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
    { label: "Home", href: "#home" },
    { label: "About Akshada", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Contact", href: "#contact" },
];

export const scrollToSection = (href) => {
    if (window.__lenis) window.__lenis.scrollTo(href, { offset: -64, duration: 1.4 });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const go = (e, href) => {
        e.preventDefault();
        setOpen(false);
        scrollToSection(href);
    };

    return (
        <header
            data-testid="main-header"
            className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
                scrolled ? "bg-[#F5F2EB]/85 backdrop-blur-xl border-b border-black/5" : "bg-transparent"
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
                <a
                    href="#home"
                    onClick={(e) => go(e, "#home")}
                    data-testid="brand-logo"
                    className="font-serif text-xl lg:text-2xl tracking-tight"
                >
                    K&nbsp;K&nbsp;<span className="italic text-[#8A9A86]">Designers</span>
                </a>

                <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
                    {LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            onClick={(e) => go(e, l.href)}
                            data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                            className="relative text-[13px] tracking-[0.08em] uppercase text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors duration-300 group"
                        >
                            {l.label}
                            <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#8A9A86] transition-[width] duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href="#contact"
                        onClick={(e) => go(e, "#contact")}
                        data-testid="book-consultation-btn"
                        className="hidden sm:inline-flex items-center bg-[#1A1A1A] text-[#F5F2EB] text-[12px] uppercase tracking-[0.15em] px-6 py-3 hover:bg-[#8A9A86] hover:text-[#1A1A1A] transition-colors duration-300"
                    >
                        Book a Consultation
                    </a>
                    <button
                        data-testid="mobile-menu-btn"
                        onClick={() => setOpen(!open)}
                        className="lg:hidden p-2 text-[#1A1A1A]"
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.nav
                        data-testid="mobile-nav"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden overflow-hidden bg-[#F5F2EB]/95 backdrop-blur-xl border-b border-black/5"
                    >
                        <div className="px-6 py-6 flex flex-col gap-5">
                            {LINKS.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    onClick={(e) => go(e, l.href)}
                                    data-testid={`mobile-nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="font-serif text-2xl"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
