import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { MoveHorizontal } from "lucide-react";

const Handle = () => (
    <div className="compare-handle-line h-full w-[2px] bg-white relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <MoveHorizontal size={17} />
        </div>
    </div>
);

export default function CompareSlider({ before, after, testId = "compare-slider", className = "" }) {
    return (
        <div className={`relative overflow-hidden ${className}`} data-testid={testId}>
            <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={before} alt="3D CAD render" style={{ objectFit: "cover" }} />}
                itemTwo={<ReactCompareSliderImage src={after} alt="Completed real site" style={{ objectFit: "cover" }} />}
                handle={<Handle />}
                style={{ height: "100%", width: "100%" }}
            />
            <span className="absolute top-4 left-4 bg-[#1A1A1A]/70 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 pointer-events-none">
                3D Render
            </span>
            <span className="absolute top-4 right-4 bg-[#F5F2EB]/80 backdrop-blur-sm text-[#1A1A1A] text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 pointer-events-none">
                Reality
            </span>
        </div>
    );
}
