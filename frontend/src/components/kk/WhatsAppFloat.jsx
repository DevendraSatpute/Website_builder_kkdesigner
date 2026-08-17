import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "./data";

export default function WhatsAppFloat() {
    return (
        <motion.a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Akshada, I'd like to discuss a project with K K Designers.")}`}
            target="_blank"
            rel="noreferrer"
            data-testid="whatsapp-float-button"
            aria-label="Chat with K K Designers on WhatsApp"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.08 }}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_12px_32px_rgba(37,211,102,0.4)]"
        >
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
            <MessageCircle size={22} className="relative" />
        </motion.a>
    );
}
