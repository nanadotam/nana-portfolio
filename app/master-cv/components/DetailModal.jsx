"use client";

import { useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { categoryConfig, formatDuration } from "../data";
import {
  X,
  ExternalLink,
  Github,
  MapPin,
  Calendar,
  Award,
  ChevronRight,
  Briefcase,
  Link2,
} from "lucide-react";

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", damping: 30, stiffness: 250, mass: 0.8 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const fadeUp = {
  initial: { opacity: 0, filter: "blur(8px)", y: 12 },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function DetailModal({ entry, onClose, allEntries }) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const config = categoryConfig[entry.category];

  // Find related entries (shared skills)
  const relatedEntries = useMemo(() => {
    if (!entry.skills_tools?.length) return [];
    const entrySkills = new Set(entry.skills_tools.map((s) => s.toLowerCase()));
    return allEntries
      .filter((e) => e.id !== entry.id)
      .map((e) => {
        const overlap = (e.skills_tools || []).filter((s) =>
          entrySkills.has(s.toLowerCase())
        ).length;
        return { ...e, overlap };
      })
      .filter((e) => e.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 3);
  }, [entry, allEntries]);

  return (
    <motion.div
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Side Panel */}
      <motion.div
        variants={panelVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl h-full bg-white dark:bg-[#141210] border-l border-gray-200 dark:border-gray-800 overflow-y-auto shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <motion.div variants={stagger} initial="initial" animate="animate" className="p-8 pt-14">
          {/* Category Badge */}
          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              style={{
                color: config?.color || "#666",
                backgroundColor: config?.bgLight || "#f3f4f6",
              }}
            >
              {config?.label || entry.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {entry.title}
          </motion.h2>

          {/* Meta Info */}
          <motion.div variants={fadeUp} className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{entry.organization}</span>
            </div>
            {entry.role && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span>{entry.role}</span>
              </div>
            )}
            {entry.location && entry.location !== "—" && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{entry.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDuration(entry.duration)}</span>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="my-6 h-px bg-gray-100 dark:bg-gray-800" />

          {/* Description */}
          <motion.div variants={fadeUp}>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {entry.description}
            </p>
          </motion.div>

          {/* Achievements */}
          {entry.achievements?.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                Key Achievements
              </h3>
              <ul className="space-y-2">
                {entry.achievements.map((a, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" style={{ color: config?.color }} />
                    <span>{a}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Skills & Tools */}
          {entry.skills_tools?.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Skills & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {entry.skills_tools.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Image Gallery */}
          {entry.images?.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Gallery
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {entry.images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -2 : 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -1 : 1 }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring", damping: 20 }}
                    className="rounded-lg overflow-hidden border-2 border-white dark:border-gray-800 shadow-md"
                  >
                    <img
                      src={img.url}
                      alt={img.alt || img.caption || ""}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                    />
                    {img.caption && (
                      <p className="px-2 py-1.5 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                        {img.caption}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* References */}
          {entry.references?.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                References
              </h3>
              <div className="space-y-2">
                {entry.references.map((ref, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                      {ref.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{ref.name}</p>
                      <p className="text-xs text-gray-500">{ref.role} — {ref.relationship}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Links */}
          {entry.links && Object.values(entry.links).some(Boolean) && (
            <motion.div variants={fadeUp} className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Links
              </h3>
              <div className="flex flex-wrap gap-2">
                {entry.links.live_url && (
                  <a
                    href={entry.links.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Live Site
                  </a>
                )}
                {entry.links.github_url && (
                  <a
                    href={entry.links.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Github className="w-3 h-3" />
                    GitHub
                  </a>
                )}
                {entry.links.behance && (
                  <a
                    href={entry.links.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Link2 className="w-3 h-3" />
                    Behance
                  </a>
                )}
                {entry.links.case_study && (
                  <a
                    href={entry.links.case_study}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Case Study
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Impact Rating */}
          <motion.div variants={fadeUp} className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Impact Rating
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${entry.impact_rating * 10}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      entry.impact_rating >= 8
                        ? "#22c55e"
                        : entry.impact_rating >= 6
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                />
              </div>
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                {entry.impact_rating}/10
              </span>
            </div>
          </motion.div>

          {/* Related Entries */}
          {relatedEntries.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8 mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Related Entries
              </h3>
              <div className="space-y-2">
                {relatedEntries.map((re) => (
                  <div
                    key={re.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {re.title}
                      </p>
                      <p className="text-xs text-gray-500">{re.organization}</p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        color: categoryConfig[re.category]?.color,
                        backgroundColor: categoryConfig[re.category]?.bgLight,
                      }}
                    >
                      {categoryConfig[re.category]?.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {entry.tags?.length > 0 && (
            <motion.div variants={fadeUp} className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-800/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
