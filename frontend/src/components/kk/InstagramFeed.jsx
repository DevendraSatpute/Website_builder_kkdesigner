import { useEffect, useState } from "react";
import { ArrowUpRight, Instagram, Play } from "lucide-react";
import { Reveal, Chapter } from "./Reveal";
import { INSTAGRAM_URL, IMAGES } from "./data";

const FALLBACK_POSTS = [
    { src: IMAGES.portfolioLiving, caption: "Custom TV media unit with ambient strip lighting" },
    { src: IMAGES.washroomMarble, caption: "Luxury washroom — marble finishes & brass fixtures" },
    { src: IMAGES.bedroomArch, caption: "Bedroom with custom arch headboard" },
    { src: IMAGES.beigeLiving, caption: "Warm beige living space, final handover" },
    { src: IMAGES.portfolioTexture, caption: "Bespoke wall textures & minimalist detailing" },
    { src: IMAGES.livingNeutral, caption: "Neutral modern living room, cove lighting" },
];

export default function InstagramFeed() {
    const feedId = process.env.REACT_APP_BEHOLD_FEED_ID;
    const [livePosts, setLivePosts] = useState(null);

    useEffect(() => {
        if (!feedId) return;
        let alive = true;
        fetch(`https://feeds.behold.so/${feedId}`)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
            .then((d) => {
                if (alive && Array.isArray(d.posts) && d.posts.length) setLivePosts(d.posts.slice(0, 6));
            })
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, [feedId]);

    const posts = livePosts
        ? livePosts.map((p) => ({
              src: p.sizes?.medium?.mediaUrl || p.mediaUrl,
              caption: p.prunedCaption || "Instagram post by K K Designers",
              link: p.permalink || INSTAGRAM_URL,
              video: p.mediaType === "VIDEO" || p.mediaType === "REEL",
          }))
        : FALLBACK_POSTS.map((p) => ({ ...p, link: INSTAGRAM_URL, video: false }));

    return (
        <section id="instagram" data-testid="instagram-section" className="py-24 lg:py-32">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                <Chapter num="06" label="Instagram" />
                <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                    <Reveal>
                        <h2 className="font-serif font-light text-4xl sm:text-5xl leading-tight tracking-tight max-w-xl">
                            Fresh from the <em className="italic text-[#8A9A86]">studio</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <a
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noreferrer"
                            data-testid="instagram-follow-btn"
                            className="group inline-flex items-center gap-3 border border-[#1A1A1A]/30 text-[12px] uppercase tracking-[0.15em] px-7 py-4 hover:bg-[#1A1A1A] hover:text-[#F5F2EB] transition-colors duration-300"
                        >
                            <Instagram size={15} />
                            Follow @k_k_designers
                            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    </Reveal>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="instagram-grid">
                    {posts.map((post, i) => (
                        <Reveal key={post.src + i} delay={i * 0.06}>
                            <a
                                href={post.link}
                                target="_blank"
                                rel="noreferrer"
                                data-testid={`instagram-post-${i}`}
                                className="group relative block aspect-square overflow-hidden bg-white"
                            >
                                <img
                                    src={post.src}
                                    alt={post.caption}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <span className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/45 transition-colors duration-500" />
                                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <Instagram size={22} className="text-white" />
                                </span>
                                {post.video && (
                                    <span className="absolute top-3 right-3 text-white drop-shadow">
                                        <Play size={16} fill="currentColor" />
                                    </span>
                                )}
                            </a>
                        </Reveal>
                    ))}
                </div>

                {!livePosts && (
                    <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/40" data-testid="instagram-fallback-note">
                        Live feed connects automatically once linked — tap any tile to visit Instagram
                    </p>
                )}
            </div>
        </section>
    );
}
