import Marquee from "react-fast-marquee";

const ITEMS = ["Passion over Profession", "K K Designers", "Bespoke Living Experiences", "From 3D to Reality", "Pune · India"];

export default function Ribbon() {
    return (
        <div data-testid="editorial-marquee" className="bg-[#8A9A86]/15 border-y border-black/10 py-6 overflow-hidden">
            <Marquee speed={35} gradient={false} pauseOnHover>
                {ITEMS.map((item) => (
                    <span key={item} className="flex items-center">
                        <span className="font-serif italic text-2xl md:text-3xl tracking-wide text-[#1A1A1A]/80 mx-8 whitespace-nowrap">
                            {item}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8A9A86]" />
                    </span>
                ))}
            </Marquee>
        </div>
    );
}
