"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LandingPanel from "./components/LandingPanel";
import CVPanel from "./components/CVPanel";
import DetailModal from "./components/DetailModal";
import { masterCVData } from "./data";

export default function MasterCVView() {
  const [showCV, setShowCV] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [splitRatio, setSplitRatio] = useState(30);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Force light mode — developer view sets dark on body
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.body.style.background = "#F2F1F0";

    // Custom cursor for all master-cv pages
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

  const handleRevealCV = useCallback(() => {
    console.log("=== REVEAL CV CLICKED ===");
    console.log("masterCVData length:", masterCVData.length);
    console.log("First entry:", masterCVData[0]?.title);
    setShowCV(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Drag to resize
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.min(Math.max((x / rect.width) * 100, 15), 50);
      setSplitRatio(pct);
    };
    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  console.log("MasterCVView render — showCV:", showCV);

  return (
    <div ref={containerRef} style={{ background: "#F2F1F0", minHeight: "100vh" }}>
      {/* ─── PHASE 1: Full Landing Page ─── */}
      {!showCV && (
        <LandingPanel mode="full" onRevealCV={handleRevealCV} />
      )}

      {/* ─── PHASE 2: Split View ─── */}
      {showCV && (
        <>
          {/* DEBUG: visible marker to confirm this branch renders */}
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "lime",
            color: "black",
            padding: 8,
            textAlign: "center",
            fontSize: 14,
            fontWeight: "bold",
          }}>
            SPLIT VIEW ACTIVE — {masterCVData.length} entries loaded
          </div>

          {/* The actual split layout */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            height: "100vh",
            width: "100vw",
            paddingTop: 40, /* space for debug bar */
          }}>
            {/* LEFT: Condensed landing */}
            <div style={{
              width: `${splitRatio}%`,
              minWidth: 200,
              height: "100%",
              overflow: "hidden",
              flexShrink: 0,
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}>
              <LandingPanel mode="condensed" onRevealCV={handleRevealCV} />
            </div>

            {/* DRAG HANDLE */}
            <div
              onMouseDown={handleDragStart}
              style={{
                width: 6,
                cursor: "col-resize",
                background: "rgba(0,0,0,0.05)",
                flexShrink: 0,
              }}
            />

            {/* RIGHT: CV Table */}
            <div style={{
              flex: 1,
              height: "100%",
              overflow: "auto",
              background: "#FAFAFA",
            }}>
              <CVPanel
                data={masterCVData}
                onSelectEntry={(entry) => {
                  console.log("Entry selected:", entry.title);
                  setSelectedEntry(entry);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
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
