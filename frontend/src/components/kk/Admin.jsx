import { useEffect, useState } from "react";
import { ArrowLeft, Lock, LogOut, RefreshCw, Phone, MapPin, Calendar } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Admin() {
    const [key, setKey] = useState(sessionStorage.getItem("kkd_admin_key") || "");
    const [input, setInput] = useState("");
    const [enquiries, setEnquiries] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async (k) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/enquiries`, { headers: { "X-Admin-Key": k } });
            if (res.status === 401) throw new Error("Incorrect passcode — please try again.");
            if (!res.ok) throw new Error("Could not load enquiries.");
            const data = await res.json();
            setEnquiries(data.enquiries || []);
            setKey(k);
            sessionStorage.setItem("kkd_admin_key", k);
        } catch (e) {
            setError(e.message);
            setEnquiries(null);
            sessionStorage.removeItem("kkd_admin_key");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (key) load(key);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = () => {
        sessionStorage.removeItem("kkd_admin_key");
        setKey("");
        setEnquiries(null);
        setInput("");
    };

    if (!enquiries) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] text-[#F5F2EB] flex items-center justify-center px-6" data-testid="admin-login-screen">
                <div className="w-full max-w-sm">
                    <p className="font-serif text-3xl mb-2">
                        K&nbsp;K&nbsp;<span className="italic text-[#8A9A86]">Designers</span>
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mb-8">Private Enquiry Dashboard</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            load(input);
                        }}
                        className="space-y-4"
                    >
                        <div className="relative">
                            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="password"
                                required
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Admin passcode"
                                data-testid="admin-passcode-input"
                                className="w-full bg-transparent border border-white/20 pl-11 pr-5 py-4 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#8A9A86] transition-colors duration-300"
                            />
                        </div>
                        {error && (
                            <p data-testid="admin-error-message" className="text-sm text-[#BCAAA4]">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="admin-login-button"
                            className="w-full bg-[#F5F2EB] text-[#1A1A1A] text-[12px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#8A9A86] transition-colors duration-300 disabled:opacity-60"
                        >
                            {loading ? "Checking…" : "View Enquiries"}
                        </button>
                    </form>
                    <a href="/" data-testid="admin-back-link" className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300">
                        <ArrowLeft size={13} /> Back to website
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F2EB] text-[#1A1A1A]" data-testid="admin-dashboard">
            <div className="max-w-[1100px] mx-auto px-6 py-12">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-8 mb-8">
                    <div>
                        <p className="font-serif text-3xl">
                            Enquiry <span className="italic text-[#8A9A86]">Dashboard</span>
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mt-2" data-testid="enquiry-count">
                            {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"} received
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => load(key)}
                            data-testid="admin-refresh-button"
                            className="inline-flex items-center gap-2 border border-[#1A1A1A]/30 text-[11px] uppercase tracking-[0.15em] px-5 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F2EB] transition-colors duration-300"
                        >
                            <RefreshCw size={13} /> Refresh
                        </button>
                        <button
                            onClick={logout}
                            data-testid="admin-logout-button"
                            className="inline-flex items-center gap-2 border border-[#1A1A1A]/30 text-[11px] uppercase tracking-[0.15em] px-5 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F2EB] transition-colors duration-300"
                        >
                            <LogOut size={13} /> Log out
                        </button>
                    </div>
                </div>

                {enquiries.length === 0 ? (
                    <p className="text-sm text-[#1A1A1A]/50 py-16" data-testid="enquiries-empty">No enquiries yet — new ones appear here automatically.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5" data-testid="enquiries-list">
                        {enquiries.map((q, i) => (
                            <article key={q.id || i} data-testid={`enquiry-item-${i}`} className="bg-white border border-black/10 p-7">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h3 className="font-serif text-2xl">{q.name}</h3>
                                    <span className="text-[10px] uppercase tracking-[0.15em] bg-[#8A9A86]/15 text-[#1A1A1A]/70 px-3 py-1.5 whitespace-nowrap">
                                        {q.project_type}
                                    </span>
                                </div>
                                <div className="space-y-2 text-[13px] text-[#4A4A4A]">
                                    <p className="flex items-center gap-3">
                                        <Phone size={13} className="text-[#8A9A86]" />
                                        <a href={`tel:${q.phone}`} className="hover:text-[#1A1A1A]">{q.phone}</a>
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <MapPin size={13} className="text-[#8A9A86]" /> {q.location}
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <Calendar size={13} className="text-[#8A9A86]" />
                                        {q.created_at ? new Date(q.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                                    </p>
                                </div>
                                <p className="mt-4 pt-4 border-t border-black/5 text-[12px] text-[#1A1A1A]/50">
                                    Style preference: <span className="text-[#1A1A1A]/80">{q.style}</span>
                                </p>
                            </article>
                        ))}
                    </div>
                )}

                <a href="/" data-testid="admin-back-link-dashboard" className="mt-12 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors duration-300">
                    <ArrowLeft size={13} /> Back to website
                </a>
            </div>
        </div>
    );
}
