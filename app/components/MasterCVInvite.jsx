"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, FileText } from "lucide-react";
import Link from "next/link";

/**
 * A scroll-triggered floating popup that invites users to visit the Master CV page.
 * @param {"designer" | "developer"} variant - Controls the styling theme.
 */
export default function MasterCVInvite({ variant = "developer" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const isDesigner = variant === "designer";

  // Show after scrolling 55% of the page
  useEffect(() => {
    // Don't re-show if dismissed this session
    if (isDismissed) return;

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.55 && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 35,
            maxWidth: 340,
            width: "calc(100% - 56px)",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "20px 22px",
              borderRadius: 16,
              border: isDesigner
                ? "1px solid rgba(255, 255, 255, 0.15)"
                : "1px solid rgba(255, 255, 255, 0.1)",
              background: isDesigner
                ? "linear-gradient(135deg, rgba(15, 25, 57, 0.92), rgba(38, 66, 139, 0.88))"
                : "linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(20, 20, 20, 0.92))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: isDesigner
                ? "0 20px 50px -10px rgba(15, 25, 57, 0.5), 0 0 0 1px rgba(81, 106, 200, 0.1)"
                : "0 20px 50px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
              overflow: "hidden",
            }}
          >
            {/* Subtle gradient accent line at top */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: isDesigner
                  ? "linear-gradient(90deg, #516AC8, #E3AF64)"
                  : "linear-gradient(90deg, #22c55e, #3b82f6)",
                borderRadius: "16px 16px 0 0",
              }}
            />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 24,
                height: 24,
                borderRadius: 6,
                border: "none",
                background: "rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              }}
            >
              <X style={{ width: 12, height: 12, color: "rgba(255,255,255,0.5)" }} />
            </button>

            {/* Icon + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isDesigner
                    ? "linear-gradient(135deg, rgba(81, 106, 200, 0.3), rgba(227, 175, 100, 0.2))"
                    : "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.15))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText
                  style={{
                    width: 16,
                    height: 16,
                    color: isDesigner ? "#E3AF64" : "#22c55e",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isDesigner ? "rgba(227, 175, 100, 0.8)" : "rgba(34, 197, 94, 0.8)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Master CV
              </span>
            </div>

            {/* Text */}
            <h3
              style={{
                margin: "0 0 6px 0",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.3,
              }}
            >
              Want the full picture?
            </h3>
            <p
              style={{
                margin: "0 0 14px 0",
                fontSize: 12.5,
                color: "rgba(255, 255, 255, 0.55)",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.5,
              }}
            >
              Explore every project, role, and skill in one interactive record.
            </p>

            {/* CTA */}
            <Link
              href="/master-cv"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                textDecoration: "none",
                color: isDesigner ? "#0F1939" : "#000",
                background: isDesigner
                  ? "linear-gradient(135deg, #E3AF64, #F0C97E)"
                  : "linear-gradient(135deg, #22c55e, #4ade80)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                boxShadow: isDesigner
                  ? "0 4px 14px rgba(227, 175, 100, 0.3)"
                  : "0 4px 14px rgba(34, 197, 94, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = isDesigner
                  ? "0 6px 20px rgba(227, 175, 100, 0.4)"
                  : "0 6px 20px rgba(34, 197, 94, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDesigner
                  ? "0 4px 14px rgba(227, 175, 100, 0.3)"
                  : "0 4px 14px rgba(34, 197, 94, 0.3)";
              }}
            >
              View Master CV
              <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
