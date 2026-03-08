"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowDown } from "lucide-react";

export default function EasterEggReveal() {
  const router = useRouter();
  const [panelState, setPanelState] = useState("hidden"); // hidden | peeking | expanded
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const hoverTimeout = useRef(null);
  const cooldownRef = useRef(false);

  const { scrollY } = useScroll();

  // Push the ENTIRE page content down when panel is active
  useEffect(() => {
    // Target the outermost content wrapper
    const pageContent = document.querySelector(".min-h-screen");
    if (!pageContent) return;

    let height = 0;
    if (panelState === "peeking") height = 200;
    if (panelState === "expanded") height = 340;

    pageContent.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    pageContent.style.transform = height > 0 ? `translateY(${height}px)` : "translateY(0)";

    return () => {
      pageContent.style.transform = "";
      pageContent.style.transition = "";
    };
  }, [panelState]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const velocity = latest - lastScrollY.current;
    scrollVelocity.current = velocity;
    lastScrollY.current = latest;

    // Trigger 1: Scrolling down past threshold
    if (
      !cooldownRef.current &&
      panelState === "hidden" &&
      latest > 300 &&
      latest < 600 &&
      velocity > 3
    ) {
      setPanelState("peeking");
      hoverTimeout.current = setTimeout(() => {
        setPanelState((current) => {
          if (current === "peeking") {
            cooldownRef.current = true;
            setTimeout(() => { cooldownRef.current = false; }, 5000);
            return "hidden";
          }
          return current;
        });
      }, 1800);
    }

    // Trigger 2: Fast scroll up to top
    if (latest < 10 && velocity < -15 && panelState === "hidden") {
      setPanelState("expanded");
    }

    // Retract if scrolling away while peeking
    if (panelState === "peeking" && velocity > 8) {
      clearTimeout(hoverTimeout.current);
      setPanelState("hidden");
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 5000);
    }
  });

  const handlePanelMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    if (panelState === "peeking") {
      setPanelState("expanded");
    }
  }, [panelState]);

  const handlePanelMouseLeave = useCallback(() => {
    if (panelState === "expanded") {
      hoverTimeout.current = setTimeout(() => {
        setPanelState("hidden");
        cooldownRef.current = true;
        setTimeout(() => { cooldownRef.current = false; }, 5000);
      }, 800);
    }
  }, [panelState]);

  const handleCTAClick = useCallback(() => {
    setPanelState("hidden");
    router.push("/master-cv");
  }, [router]);

  const panelHeight = panelState === "peeking" ? 200 : panelState === "expanded" ? 340 : 0;

  return (
    <AnimatePresence>
      {panelState !== "hidden" && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: panelHeight }}
          exit={{ height: 0 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 250,
            mass: 0.8,
          }}
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: "#F2F1F0",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 24px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Sparkle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", top: 20, left: "15%", opacity: 0.2 }}
            >
              <Sparkles style={{ width: 20, height: 20, color: "#E3AF64" }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 12 }}>
                You found me
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, color: "#000", lineHeight: 1.1, margin: 0 }}>
                There&apos;s more to the{" "}
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                  story.
                </span>
              </h2>
            </motion.div>

            {/* CTA — only when expanded */}
            {panelState === "expanded" && (
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ marginTop: 24 }}
              >
                <p style={{ fontSize: 14, color: "#777", marginBottom: 16, maxWidth: 400 }}>
                  Every role, every project, every achievement — one living document.
                </p>

                <motion.button
                  onClick={handleCTAClick}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 28px",
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span>See the full picture</span>
                  <ArrowDown style={{ width: 16, height: 16 }} />
                </motion.button>
              </motion.div>
            )}

            {/* Hint (peeking) */}
            {panelState === "peeking" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ marginTop: 16, fontSize: 10, color: "#ccc", letterSpacing: "0.1em" }}
              >
                hover to explore
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
