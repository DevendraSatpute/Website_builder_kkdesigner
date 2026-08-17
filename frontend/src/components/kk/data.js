export const WHATSAPP_NUMBER = "919028202970";
export const INSTAGRAM_URL = "https://www.instagram.com/k_k_designers/?hl=en";

export const IMAGES = {
    heroLiving:
        "https://images.pexels.com/photos/28853362/pexels-photo-28853362.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    renderBefore:
        "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    realAfter:
        "https://images.unsplash.com/photo-1666585607888-3f6fe0b323d8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    founder:
        "https://customer-assets-0z36b82j.emergentagent.net/job_kk-designers-pune/artifacts/wxpi7r9n_WhatsApp%20Image%202026-08-17%20at%2010.08.27%20PM.jpeg",
    service3d: "https://images.unsplash.com/photo-1678762200388-51e11225d4de?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
    serviceExecution:
        "https://images.pexels.com/photos/18672134/pexels-photo-18672134.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    serviceStyling:
        "https://images.pexels.com/photos/10919439/pexels-photo-10919439.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    serviceResidential:
        "https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
    portfolioBedroom:
        "https://images.pexels.com/photos/8135526/pexels-photo-8135526.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    portfolioTexture:
        "https://images.pexels.com/photos/33685863/pexels-photo-33685863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    portfolioLiving:
        "https://images.pexels.com/photos/13722886/pexels-photo-13722886.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    portfolioChaise:
        "https://images.unsplash.com/photo-1564078516393-cf04bd966897?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    blueprint: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    rawStructure: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
    framing: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    beigeLiving: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    washroomMarble: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop",
    washroomVanity: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop",
    bedroomArch: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
    livingNeutral: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
};

export const SERVICES = [
    {
        id: "3d-visualisation",
        num: "01",
        title: "3D Visualisation & CAD Layouts",
        copy: "Photorealistic renders and precise spatial planning — see your finished home before a single wall is touched.",
        image: IMAGES.service3d,
    },
    {
        id: "residential",
        num: "02",
        title: "Bungalow & Residential Interiors",
        copy: "End-to-end design for villas, apartments and modern living spaces, tailored to the way your family lives.",
        image: IMAGES.serviceResidential,
    },
    {
        id: "turnkey",
        num: "03",
        title: "Turnkey Execution & Site Supervision",
        copy: "We stay on site through the raw stage — wiring, wood framing, finishes — until the final handover matches the vision.",
        image: IMAGES.serviceExecution,
    },
    {
        id: "styling",
        num: "04",
        title: "Bespoke Styling & Texture Art",
        copy: "Custom wall textures, mural work, cove lighting and luxury washroom design that give every room a signature.",
        image: IMAGES.serviceStyling,
    },
];

export const RAW_TO_FINAL = [
    { src: IMAGES.blueprint, tag: "Stage 01", title: "Space Planning & CAD", span: "md:col-span-4 md:row-span-1" },
    { src: IMAGES.rawStructure, tag: "Stage 02", title: "Raw Structure", span: "md:col-span-8 md:row-span-2" },
    { src: IMAGES.framing, tag: "Stage 03", title: "Wiring & Wood Framing", span: "md:col-span-4 md:row-span-1" },
    { src: IMAGES.serviceExecution, tag: "Stage 04", title: "Wall Texture & Finishes", span: "md:col-span-4 md:row-span-1" },
    { src: IMAGES.portfolioLiving, tag: "Stage 05", title: "Lighting & Styling", span: "md:col-span-8 md:row-span-2" },
    { src: IMAGES.beigeLiving, tag: "Stage 06", title: "The Final Handover", span: "md:col-span-4 md:row-span-1" },
];

export const HIGHLIGHTS = [
    { src: IMAGES.washroomMarble, tag: "Luxury Washrooms", title: "Marble Finishes & Brass Fixtures", span: "md:col-span-7 md:row-span-2" },
    { src: IMAGES.portfolioLiving, tag: "Modern Living Rooms", title: "Custom TV Media Unit", span: "md:col-span-5 md:row-span-1" },
    { src: IMAGES.bedroomArch, tag: "Bedrooms", title: "Custom Arch Headboard", span: "md:col-span-5 md:row-span-1" },
    { src: IMAGES.washroomVanity, tag: "Luxury Washrooms", title: "Floating Vanity & Cove Lighting", span: "md:col-span-4 md:row-span-1" },
    { src: IMAGES.livingNeutral, tag: "Modern Living Rooms", title: "Ambient Strip Lighting", span: "md:col-span-4 md:row-span-1" },
    { src: IMAGES.portfolioBedroom, tag: "Bedrooms", title: "Accent Wall Mural", span: "md:col-span-4 md:row-span-1" },
];
