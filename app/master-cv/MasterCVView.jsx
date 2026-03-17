"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPanel from "./components/LandingPanel";
import CVPanel from "./components/CVPanel";
import DetailModal from "./components/DetailModal";
import { masterCVData } from "./data";
import { X, Minimize2 } from "lucide-react";

export default function MasterCVView() {
  const [showCV, setShowCV] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.body.style.background = "#F2F1F0";

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after {
        cursor: url('/cursor/Custom%20Nana%20Amoako%20Cursor.svg'), auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.background = "";
      document.head.removeChild(style);
    };
  }, []);

  // Lock body scroll when CV modal is open
  useEffect(() => {
    if (showCV) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCV]);

  const handleRevealCV = useCallback(() => {
    setShowCV(true);
  }, []);

  const handleCloseCV = useCallback(() => {
    setShowCV(false);
    setSelectedEntry(null);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedEntry) {
          setSelectedEntry(null);
        } else if (showCV) {
          handleCloseCV();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCV, selectedEntry, handleCloseCV]);

  return (
    <div style={{ background: "#F2F1F0", minHeight: "100vh" }}>
      {/* Landing Page — always rendered */}
      <LandingPanel mode="full" onRevealCV={handleRevealCV} />

      {/* CV Modal Overlay — slides down from top */}
      <AnimatePresence>
        {showCV && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleCloseCV}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            />

            {/* CV Panel Container */}
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 32,
                stiffness: 280,
                mass: 0.9,
              }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 45,
                height: "82vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Glass header bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src="/logo/nana-amoako-logo-white.png"
                    alt="Nana Amoako"
                    style={{ width: 28, height: 28, filter: "invert(1)", opacity: 0.7 }}
                  />
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#000",
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.2,
                      }}
                    >
                      Master CV
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: "#999",
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {masterCVData.length} entries
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Keyboard hint */}
                  <span
                    style={{
                      fontSize: 10,
                      color: "#bbb",
                      fontFamily: "'Inter', sans-serif",
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(0,0,0,0.03)",
                    }}
                  >
                    ESC
                  </span>
                  <button
                    onClick={handleCloseCV}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(0,0,0,0.03)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                    }}
                  >
                    <X style={{ width: 16, height: 16, color: "#666" }} />
                  </button>
                </div>
              </div>

              {/* CV Table Body */}
              <div
                style={{
                  flex: 1,
                  overflow: "hidden",
                  background: "#FAFAFA",
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                <CVPanel
                  data={masterCVData}
                  onSelectEntry={(entry) => setSelectedEntry(entry)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail Modal — side panel for entry details */}
      <AnimatePresence>
        {selectedEntry && (
          <DetailModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            allEntries={masterCVData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
