import { Linkedin } from "lucide-react";
import { INSTAGRAM_URL, EMAIL } from "./data";
import { scrollToSection } from "./Navbar";

export default function Footer() {
    return (
        <footer data-testid="main-footer" className="border-t border-black/10 py-12">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <p className="font-serif text-2xl">
                        K&nbsp;K&nbsp;<span className="italic text-[#8A9A86]">Designers</span>
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                        Passion over Profession — Pune, India
                    </p>
                </div>
                <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.18em] text-[#1A1A1A]/60">
                    <button onClick={() => scrollToSection("#portfolio")} data-testid="footer-portfolio-link" className="hover:text-[#1A1A1A] transition-colors duration-300">
                        Portfolio
                    </button>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" data-testid="footer-instagram-link" className="hover:text-[#1A1A1A] transition-colors duration-300">
                        Instagram
                    </a>
                    <a href={`mailto:${EMAIL}`} data-testid="footer-email-link" className="hover:text-[#1A1A1A] transition-colors duration-300">
                        Email
                    </a>
                </div>
                <div className="text-[11px] text-[#1A1A1A]/40 md:text-right">
                    <p>© 2026 K K Designers. All rights reserved.</p>
                    <a
                        href="https://in.linkedin.com/in/shruti-khedkar-34357b158"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="developer-linkedin-link"
                        className="mt-2 inline-flex items-center gap-2 hover:text-[#1A1A1A] transition-colors duration-300"
                    >
                        <Linkedin size={12} />
                        Developed by Shruti Khedkar — Connect on LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}
