"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScramble } from "use-scramble";
import { masterCVStats } from "../data";
import { ArrowRight } from "lucide-react";

const roles = [
  "Developer",
  "Designer",
  "Leader",
  "Mastermind",
  "Creative Director",
  "Problem Solver",
  "Builder",
  "Storyteller",
  "MOG",
];

const floatingPhotos = [
  { src: "/images/me-working/me-working2.jpeg", rotation: -5, x: "8%", y: "18%", size: "140px" },
  { src: "/images/me-working/me-working3 Large.jpeg", rotation: 4, x: "72%", y: "12%", size: "120px" },
  { src: "/images/me-working/me-working5 Large.jpeg", rotation: -3, x: "78%", y: "55%", size: "130px" },
  { src: "/images/CREATIVE-PROCESS.jpeg", rotation: 6, x: "5%", y: "60%", size: "110px" },
  { src: "/images/me-working/me-working4 Large.jpeg", rotation: -2, x: "65%", y: "78%", size: "100px" },
];

function RoleScramble() {
  const [roleIndex, setRoleIndex] = useState(0);
  const { ref, replay } = useScramble({
    text: roles[roleIndex],
    speed: 0.6,
    tick: 2,
    step: 1,
    scramble: 5,
    seed: 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    replay();
  }, [roleIndex, replay]);

  return <span ref={ref} className="inline-block min-w-[180px]" />;
}

function FloatingPhoto({ src, rotation, x, y, size, index }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxFactor = 0.5 + index * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation * 2 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: rotation,
        x: mousePos.x * parallaxFactor,
        y: mousePos.y * parallaxFactor,
      }}
      transition={{
        opacity: { duration: 0.8, delay: 2.0 + index * 0.15 },
        scale: { duration: 0.8, delay: 2.0 + index * 0.15 },
        x: { type: "spring", damping: 30, stiffness: 100 },
        y: { type: "spring", damping: 30, stiffness: 100 },
      }}
      className="absolute hidden lg:block pointer-events-none z-0"
      style={{ left: x, top: y }}
    >
      <div
        className="rounded-sm overflow-hidden shadow-lg"
        style={{
          width: size,
          height: size,
          border: "4px solid white",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
    </motion.div>
  );
}

// Dramatic word-by-word blur animation
function DramaticWord({ word, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(18px)", y: 12 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ display: "inline-block", marginRight: "0.22em" }}
    >
      {word}
    </motion.span>
  );
}

export default function LandingPanel({ mode = "full", onRevealCV }) {
  const isCondensed = mode === "condensed";

  // ─── CONDENSED MODE (shown in split view) ───
  if (isCondensed) {
    return (
      <div
        style={{
          backgroundColor: "#F2F1F0",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Logo */}
        <img
          src="/logo/nana-amoako-logo-white.png"
          alt="Nana Amoako"
          style={{ width: 40, height: 40, filter: "invert(1)", marginBottom: 12, opacity: 0.8 }}
        />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#000", lineHeight: 1, margin: 0 }}>
          Nana Amoako
        </h2>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#000", marginTop: 4, lineHeight: 1 }}>
          I am a <RoleScramble />
        </p>
        <p style={{ fontSize: 10, color: "#999", marginTop: 8, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          @unclesettings
        </p>
      </div>
    );
  }

  // ─── FULL LANDING PAGE ───
  return (
    <div
      style={{
        backgroundColor: "#F2F1F0",
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Photos */}
      {floatingPhotos.map((photo, i) => (
        <FloatingPhoto key={i} {...photo} index={i} />
      ))}

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "80px 24px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ─── Logo ─── */}
        <motion.img
          src="/logo/nana-amoako-logo-white.png"
          alt="Nana Amoako Logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            width: 60,
            height: 60,
            filter: "invert(1)",
            marginBottom: 32,
          }}
        />

        {/* ─── THE HEADER: Dramatic blur-in ─── */}
        <h1
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 800,
            color: "#000",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {/* "Nana Amoako" */}
          <DramaticWord word="Nana" delay={0.3} />
          <DramaticWord word="Amoako" delay={0.5} />
          <br />
          {/* "I am a [Role]" */}
          <DramaticWord word="I" delay={0.8} />
          <DramaticWord word="am" delay={0.95} />
          <DramaticWord word="a" delay={1.1} />
          <motion.span
            initial={{ opacity: 0, filter: "blur(18px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ display: "inline-block" }}
          >
            <RoleScramble />
          </motion.span>
        </h1>

        {/* ─── Tagline ─── */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, delay: 2.0 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "#888",
            marginTop: 32,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Built for those who want{" "}
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#555" }}>
            everything.
          </span>
        </motion.p>

        {/* ─── Stats Row ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 48,
            marginTop: 48,
            marginBottom: 40,
          }}
          className="!grid-cols-2 md:!grid-cols-4"
        >
          {[
            { label: "Projects completed", value: masterCVStats.projects },
            { label: "Years of experience", value: masterCVStats.experience },
            { label: "Success rate", value: masterCVStats.satisfaction },
            { label: "Technologies used", value: masterCVStats.technologies },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 + i * 0.1, duration: 0.5 }}
              style={{ textAlign: "center" }}
            >
              <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: "#000" }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── CTA Button ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 3.0 }}
        >
          <motion.button
            onClick={onRevealCV}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 32px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.02em",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            className="group"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span style={{ position: "relative" }}>View Master CV</span>
            <ArrowRight style={{ width: 16, height: 16, position: "relative" }} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
