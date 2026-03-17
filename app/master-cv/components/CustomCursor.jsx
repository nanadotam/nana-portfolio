"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor({ containerRef }) {
  const [visible, setVisible] = useState(false);
  const [isHoveringRow, setIsHoveringRow] = useState(false);
  const [ripple, setRipple] = useState(null);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      cursorX.set(e.clientX - rect.left);
      cursorY.set(e.clientY - rect.top);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    const handleMouseOver = (e) => {
      const row = e.target.closest("tr");
      setIsHoveringRow(!!row && !!row.closest("tbody"));
    };

    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now(),
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("click", handleClick);
    };
  }, [containerRef, cursorX, cursorY]);

  // Hide on mobile / touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Hide default cursor in the CV panel container
  useEffect(() => {
    const container = containerRef?.current;
    if (!container || isTouchDevice) return;
    container.style.cursor = "none";
    const children = container.querySelectorAll("*");
    children.forEach((el) => { el.style.cursor = "none"; });
    return () => {
      container.style.cursor = "";
      children.forEach((el) => { el.style.cursor = ""; });
    };
  }, [containerRef, isTouchDevice, visible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Custom cursor dot */}
      {visible && (
        <motion.div
          className="pointer-events-none fixed z-50 mix-blend-difference"
          style={{
            x: cursorX,
            y: cursorY,
            position: "absolute",
          }}
        >
          {/* Outer glow */}
          <motion.div
            animate={{
              width: isHoveringRow ? 36 : 10,
              height: isHoveringRow ? 36 : 10,
              opacity: isHoveringRow ? 0.15 : 0,
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 dark:bg-blue-400"
          />
          {/* Inner dot */}
          <motion.div
            animate={{
              width: isHoveringRow ? 8 : 6,
              height: isHoveringRow ? 8 : 6,
            }}
            transition={{ type: "spring", damping: 20, stiffness: 400 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 dark:bg-white"
          />
          {/* Crosshair lines (non-hover) */}
          {!isHoveringRow && (
            <>
              <div className="absolute -translate-x-1/2 -translate-y-1/2 w-px h-3 bg-gray-400 dark:bg-gray-500 -top-[8px]" style={{ left: 0 }} />
              <div className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-px bg-gray-400 dark:bg-gray-500 -left-[8px]" style={{ top: 0 }} />
            </>
          )}
        </motion.div>
      )}

      {/* Click ripple */}
      {ripple && (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onAnimationComplete={() => setRipple(null)}
          className="absolute pointer-events-none w-6 h-6 rounded-full bg-amber-300 dark:bg-blue-400 -translate-x-1/2 -translate-y-1/2"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
    </>
  );
}
