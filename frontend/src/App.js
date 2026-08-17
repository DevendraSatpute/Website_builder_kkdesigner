import { useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import Navbar from "@/components/kk/Navbar";
import Hero from "@/components/kk/Hero";
import Ribbon from "@/components/kk/Ribbon";
import About from "@/components/kk/About";
import Services from "@/components/kk/Services";
import Portfolio from "@/components/kk/Portfolio";
import Philosophy from "@/components/kk/Philosophy";
import Contact from "@/components/kk/Contact";
import Footer from "@/components/kk/Footer";
import WhatsAppFloat from "@/components/kk/WhatsAppFloat";

function App() {
    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        window.__lenis = lenis;
        let raf;
        const loop = (time) => {
            lenis.raf(time);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
            window.__lenis = null;
        };
    }, []);

    return (
        <div className="App bg-[#F5F2EB] text-[#1A1A1A] font-sans antialiased">
            <Navbar />
            <main>
                <Hero />
                <Ribbon />
                <About />
                <Services />
                <Portfolio />
                <Philosophy />
                <Contact />
            </main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
}

export default App;
