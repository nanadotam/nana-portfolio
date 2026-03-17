"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";

export default function WantMorePopup() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      const scrollPercent = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercent > 0.85 && !hasShownRef.current) {
        hasShownRef.current = true;
        setShow(true);

        setTimeout(() => {
          setShow(false);
        }, 6000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleClick = () => {
    setShow(false);
    router.push("/master-cv");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 100, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-20 right-4 z-[60] max-w-xs w-auto"
        >
          <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-gray-700/50 shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-xl">
            {/* Accent dot */}
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                Want to see more?
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                Explore the Master CV
              </p>
            </div>

            {/* Action */}
            <button
              onClick={handleClick}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-medium hover:opacity-80 transition-opacity flex-shrink-0"
            >
              View
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
