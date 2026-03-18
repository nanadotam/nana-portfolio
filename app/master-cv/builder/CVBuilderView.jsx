"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Building2,
  FileText,
  FileDown,
  Sparkles,
  Loader2,
  Check,
  Upload,
  ChevronDown,
  X,
  Download,
  Eye,
  Zap,
  AlertCircle,
} from "lucide-react";

// ── Question definitions ──────────────────────────────────────────
const QUESTIONS = [
  {
    id: "role",
    label: "What role are you applying for?",
    sublabel: "e.g. Frontend Developer, Software Engineer, UX Designer",
    type: "text",
    required: true,
    icon: Briefcase,
    placeholder: "Software Engineer",
  },
  {
    id: "company",
    label: "Which company?",
    sublabel: "The company you're targeting this CV for",
    type: "text",
    required: true,
    icon: Building2,
    placeholder: "Google",
  },
  {
    id: "jobDescription",
    label: "Paste the full job description",
    sublabel: "The more detail, the better the tailoring",
    type: "textarea",
    required: true,
    icon: FileText,
    placeholder: "We are looking for a Software Engineer who...",
  },
  {
    id: "format",
    label: "Select CV format",
    sublabel: "Choose your preferred download format",
    type: "radio",
    required: true,
    icon: FileDown,
    options: [
      { value: "docx", label: "DOCX", desc: "Editable Word document" },
      { value: "pdf", label: "PDF", desc: "Print-ready format" },
      { value: "both", label: "Both", desc: "DOCX + PDF" },
    ],
  },
  {
    id: "industry",
    label: "What industry is this role in?",
    sublabel: "Optional — helps with context",
    type: "select",
    required: false,
    icon: Building2,
    options: [
      "Technology",
      "Finance / Fintech",
      "Healthcare",
      "Education",
      "E-commerce / Retail",
      "Media / Entertainment",
      "Consulting",
      "Government / NGO",
      "Startup",
      "Other",
    ],
  },
  {
    id: "keyTechnologies",
    label: "Key technologies mentioned in the JD",
    sublabel: "Optional — comma-separated, helps prioritize skills",
    type: "text",
    required: false,
    icon: Zap,
    placeholder: "React, TypeScript, Node.js, AWS",
  },
  {
    id: "additionalContext",
    label: "Any additional context or priorities?",
    sublabel: "Optional — anything else the AI should know",
    type: "textarea",
    required: false,
    icon: Sparkles,
    placeholder: "I want to emphasize my leadership experience and design skills...",
  },
];

const INDUSTRY_OPTIONS = QUESTIONS.find((q) => q.id === "industry").options;

// =====================================================================
export default function CVBuilderView() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({
    format: "docx",
  });
  const [masterCV, setMasterCV] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.style.background = "#F2F1F0";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  // Auto-focus input on question change
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [currentQ]);

  // Load master CV JSON
  const handleJSONUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.cv_master || data.entries) {
          setMasterCV(data);
          setCurrentQ(0);
        } else {
          setError("Invalid JSON — expected cv_master or entries key");
        }
      } catch {
        setError("Could not parse JSON file");
      }
    };
    reader.readAsText(file);
  }, []);

  // Navigation
  const q = QUESTIONS[currentQ];
  const isRequired = q?.required;
  const hasAnswer = answers[q?.id] && String(answers[q.id]).trim().length > 0;
  const canProceed = !isRequired || hasAnswer;
  const isLastRequired = currentQ === 3; // format is the last required
  const isLast = currentQ === QUESTIONS.length - 1;
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  const goNext = () => {
    if (!canProceed) return;
    if (isLast) {
      handleGenerate();
    } else {
      setCurrentQ((p) => Math.min(p + 1, QUESTIONS.length - 1));
    }
  };

  const goPrev = () => setCurrentQ((p) => Math.max(p - 1, 0));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && q.type !== "textarea") {
      e.preventDefault();
      goNext();
    }
  };

  // ── Generate CV ─────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!masterCV) {
      setError("Please upload your master CV JSON first");
      return;
    }
    setGenerating(true);
    setError(null);

    try {
      const keyTech = answers.keyTechnologies
        ? answers.keyTechnologies.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const res = await fetch("/api/cv-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterCV,
          jobDescription: answers.jobDescription,
          metadata: {
            role: answers.role,
            company: answers.company,
            industry: answers.industry,
            keyTechnologies: keyTech,
            additionalContext: answers.additionalContext,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setResult(data);
      setShowPreview(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // ── Download DOCX ───────────────────────────────────────────────
  const downloadDOCX = async () => {
    if (!result) return;
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType } = await import("docx");
    const { saveAs } = await import("file-saver");

    const cv = result.tailoredCV;
    const children = [];

    // Name
    children.push(
      new Paragraph({
        children: [new TextRun({ text: cv.name, bold: true, size: 32, font: "Calibri" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      })
    );

    // Contact line
    const contactParts = [
      cv.contact.email,
      cv.contact.phone,
      cv.contact.location,
      cv.contact.linkedin,
      cv.contact.github,
    ].filter(Boolean);
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join("  |  "), size: 18, font: "Calibri", color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Divider helper
    const addSection = (title) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, font: "Calibri", color: "2B579A" })],
          spacing: { before: 300, after: 100 },
          border: { bottom: { style: "single", size: 1, color: "CCCCCC" } },
        })
      );
    };

    // Summary
    if (cv.summary) {
      addSection("Professional Summary");
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cv.summary, size: 20, font: "Calibri" })],
          spacing: { after: 100 },
        })
      );
    }

    // Experience
    if (cv.experiences?.length) {
      addSection("Experience");
      cv.experiences.forEach((exp) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.role, bold: true, size: 21, font: "Calibri" }),
              new TextRun({ text: `  —  ${exp.organization}`, size: 21, font: "Calibri", color: "555555" }),
            ],
            spacing: { before: 140, after: 40 },
          })
        );
        children.push(
          new Paragraph({
            children: [new TextRun({ text: exp.period || "", italics: true, size: 18, font: "Calibri", color: "888888" })],
            spacing: { after: 60 },
          })
        );
        (exp.bullet_points || []).forEach((bp) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: bp, size: 20, font: "Calibri" })],
              bullet: { level: 0 },
              spacing: { after: 40 },
            })
          );
        });
      });
    }

    // Projects
    if (cv.projects?.length) {
      addSection("Projects");
      cv.projects.forEach((proj) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: proj.organization || proj.role, bold: true, size: 21, font: "Calibri" }),
              new TextRun({ text: `  (${proj.period || ""})`, size: 18, font: "Calibri", color: "888888" }),
            ],
            spacing: { before: 140, after: 40 },
          })
        );
        (proj.bullet_points || []).forEach((bp) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: bp, size: 20, font: "Calibri" })],
              bullet: { level: 0 },
              spacing: { after: 40 },
            })
          );
        });
      });
    }

    // Skills
    if (cv.skills?.length) {
      addSection("Technical Skills");
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cv.skills.join("  |  "), size: 20, font: "Calibri" })],
          spacing: { after: 100 },
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { width: 12240, height: 15840 }, // US Letter in twips
              margin: { top: 720, right: 720, bottom: 720, left: 720 },
            },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${cv.name.replace(/\s+/g, "_")}_CV_${answers.role?.replace(/\s+/g, "_") || "Tailored"}.docx`;
    saveAs(blob, fileName);
  };

  // ── Download PDF (print-friendly HTML) ──────────────────────────
  const downloadPDF = () => {
    if (!result) return;
    const cv = result.tailoredCV;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${cv.name} - CV</title>
<style>
@page { size: letter; margin: 0.5in; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.45; color: #222; }
.name { font-size: 22pt; font-weight: 700; text-align: center; margin-bottom: 4px; }
.contact { text-align: center; font-size: 9pt; color: #666; margin-bottom: 16px; }
.section-title { font-size: 11pt; font-weight: 700; color: #2B579A; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 14px 0 8px; }
.entry-header { font-weight: 600; font-size: 10.5pt; margin-bottom: 2px; }
.entry-meta { font-size: 9pt; color: #888; font-style: italic; margin-bottom: 4px; }
ul { padding-left: 18px; margin-bottom: 8px; }
li { margin-bottom: 3px; font-size: 10pt; }
.skills { font-size: 10pt; }
@media print { body { -webkit-print-color-adjust: exact; } }
</style></head><body>
<div class="name">${cv.name}</div>
<div class="contact">${[cv.contact.email, cv.contact.phone, cv.contact.location, cv.contact.linkedin, cv.contact.github].filter(Boolean).join("  |  ")}</div>
${cv.summary ? `<div class="section-title">Professional Summary</div><p style="font-size:10pt;margin-bottom:8px;">${cv.summary}</p>` : ""}
${cv.experiences?.length ? `<div class="section-title">Experience</div>${cv.experiences.map((e) => `<div class="entry-header">${e.role} — ${e.organization}</div><div class="entry-meta">${e.period || ""}</div><ul>${(e.bullet_points || []).map((b) => `<li>${b}</li>`).join("")}</ul>`).join("")}` : ""}
${cv.projects?.length ? `<div class="section-title">Projects</div>${cv.projects.map((p) => `<div class="entry-header">${p.organization} (${p.period || ""})</div><ul>${(p.bullet_points || []).map((b) => `<li>${b}</li>`).join("")}</ul>`).join("")}` : ""}
${cv.skills?.length ? `<div class="section-title">Technical Skills</div><p class="skills">${cv.skills.join("  |  ")}</p>` : ""}
</body></html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  // ── Render: JSON upload gate ────────────────────────────────────
  if (!masterCV) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.card}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={styles.iconBubble}>
                <Upload style={{ width: 32, height: 32, color: "#e86c47" }} />
              </div>
              <h1 style={styles.heading}>CV Builder</h1>
              <p style={styles.sublabel}>
                Upload your <code style={styles.code}>master_cv.json</code> to get started.
                The AI will tailor your CV to any role.
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleJSONUpload({ target: { files: [file] } });
              }}
              style={styles.dropZone}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleJSONUpload}
                style={{ display: "none" }}
              />
              <FileText style={{ width: 40, height: 40, color: "#999", marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: "#333", marginBottom: 4 }}>
                Drop your JSON here or click to browse
              </p>
              <p style={{ fontSize: 12, color: "#999" }}>
                Accepts master_cv.json format
              </p>
            </div>

            {error && (
              <div style={styles.errorBanner}>
                <AlertCircle style={{ width: 16, height: 16 }} />
                {error}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Render: Generating state ────────────────────────────────────
  if (generating) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ ...styles.card, textAlign: "center" }}
          >
            <Loader2
              style={{
                width: 48,
                height: 48,
                color: "#e86c47",
                animation: "spin 1s linear infinite",
                marginBottom: 20,
              }}
            />
            <h2 style={{ ...styles.heading, fontSize: 22 }}>Generating your tailored CV...</h2>
            <p style={styles.sublabel}>
              Groq AI is analyzing the job description and selecting the best content from your master CV.
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Render: Result preview ──────────────────────────────────────
  if (showPreview && result) {
    const cv = result.tailoredCV;
    const sel = result.selection;

    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, maxWidth: 800 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ ...styles.heading, marginBottom: 4, textAlign: "left" }}>
                  Your Tailored CV
                </h1>
                <p style={{ fontSize: 13, color: "#888" }}>
                  {answers.role} at {answers.company}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {(answers.format === "docx" || answers.format === "both") && (
                  <button onClick={downloadDOCX} style={styles.downloadBtn}>
                    <Download style={{ width: 16, height: 16 }} /> DOCX
                  </button>
                )}
                {(answers.format === "pdf" || answers.format === "both") && (
                  <button onClick={downloadPDF} style={{ ...styles.downloadBtn, background: "#2B579A" }}>
                    <Download style={{ width: 16, height: 16 }} /> PDF
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setResult(null);
                    setCurrentQ(0);
                  }}
                  style={{ ...styles.downloadBtn, background: "#666" }}
                >
                  New CV
                </button>
              </div>
            </div>

            {/* AI reasoning */}
            {sel?.reasoning && (
              <div style={styles.reasoningBox}>
                <Sparkles style={{ width: 14, height: 14, color: "#e86c47", flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{sel.reasoning}</p>
              </div>
            )}

            {/* CV Preview Card */}
            <div style={styles.cvPreview}>
              <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>
                {cv.name}
              </h2>
              <p style={{ textAlign: "center", fontSize: 11, color: "#888", marginBottom: 20 }}>
                {[cv.contact.email, cv.contact.phone, cv.contact.location].filter(Boolean).join("  |  ")}
              </p>

              {cv.summary && (
                <>
                  <h3 style={styles.sectionTitle}>Professional Summary</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16, color: "#444" }}>{cv.summary}</p>
                </>
              )}

              {cv.experiences?.length > 0 && (
                <>
                  <h3 style={styles.sectionTitle}>Experience</h3>
                  {cv.experiences.map((exp, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {exp.role} <span style={{ color: "#888", fontWeight: 400 }}>— {exp.organization}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#aaa", fontStyle: "italic", marginBottom: 4 }}>
                        {exp.period}
                      </div>
                      <ul style={{ paddingLeft: 18, margin: 0 }}>
                        {(exp.bullet_points || []).map((bp, j) => (
                          <li key={j} style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 3, color: "#444" }}>
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}

              {cv.projects?.length > 0 && (
                <>
                  <h3 style={styles.sectionTitle}>Projects</h3>
                  {cv.projects.map((p, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {p.organization}{" "}
                        <span style={{ fontSize: 11, color: "#aaa", fontWeight: 400 }}>({p.period})</span>
                      </div>
                      <ul style={{ paddingLeft: 18, margin: 0 }}>
                        {(p.bullet_points || []).map((bp, j) => (
                          <li key={j} style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 3, color: "#444" }}>
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}

              {cv.skills?.length > 0 && (
                <>
                  <h3 style={styles.sectionTitle}>Technical Skills</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cv.skills.map((s, i) => (
                      <span key={i} style={styles.skillChip}>{s}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Render: TypeForm questionnaire ──────────────────────────────
  const Icon = q.icon;

  return (
    <div style={styles.page}>
      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <motion.div
          style={styles.progressFill}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Back / question counter */}
      <div style={styles.topBar}>
        <button
          onClick={currentQ > 0 ? goPrev : () => setMasterCV(null)}
          style={styles.backBtn}
        >
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </button>
        <span style={{ fontSize: 12, color: "#aaa" }}>
          {currentQ + 1} / {QUESTIONS.length}
          {currentQ > 3 && (
            <button onClick={handleGenerate} style={styles.skipBtn}>
              Skip optionals & generate
            </button>
          )}
        </span>
      </div>

      <div style={styles.container}>
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={styles.questionCard}
          >
            {/* Icon */}
            <div style={styles.iconBubble}>
              <Icon style={{ width: 24, height: 24, color: "#e86c47" }} />
            </div>

            {/* Question label */}
            <h2 style={styles.questionLabel}>{q.label}</h2>
            <p style={styles.sublabel}>{q.sublabel}</p>

            {/* Input */}
            <div style={{ marginTop: 24, width: "100%", maxWidth: 520 }}>
              {q.type === "text" && (
                <input
                  ref={inputRef}
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  placeholder={q.placeholder}
                  style={styles.textInput}
                />
              )}

              {q.type === "textarea" && (
                <textarea
                  ref={inputRef}
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                  placeholder={q.placeholder}
                  rows={6}
                  style={{ ...styles.textInput, resize: "vertical", minHeight: 140 }}
                />
              )}

              {q.type === "radio" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {q.options.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt.value }))}
                      style={{
                        ...styles.radioOption,
                        borderColor: answers[q.id] === opt.value ? "#e86c47" : "#e0e0e0",
                        background: answers[q.id] === opt.value ? "#FFF5F2" : "#fff",
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: `2px solid ${answers[q.id] === opt.value ? "#e86c47" : "#ccc"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {answers[q.id] === opt.value && (
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e86c47" }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#333" }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {q.type === "select" && (
                <div style={{ position: "relative" }}>
                  <select
                    ref={inputRef}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                    style={{ ...styles.textInput, appearance: "none", cursor: "pointer" }}
                  >
                    <option value="">Select an industry...</option>
                    {q.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown
                    style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#999", pointerEvents: "none" }}
                  />
                </div>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={goNext}
              disabled={!canProceed}
              style={{
                ...styles.nextBtn,
                opacity: canProceed ? 1 : 0.4,
                cursor: canProceed ? "pointer" : "not-allowed",
              }}
            >
              {isLast ? (
                <>
                  <Sparkles style={{ width: 18, height: 18 }} /> Generate CV
                </>
              ) : isLastRequired && currentQ === 3 ? (
                <>
                  Continue <ArrowRight style={{ width: 18, height: 18 }} />
                </>
              ) : (
                <>
                  OK <Check style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>

            {!q.required && (
              <button onClick={goNext} style={styles.skipLink}>
                Skip
              </button>
            )}

            {error && (
              <div style={{ ...styles.errorBanner, marginTop: 16 }}>
                <AlertCircle style={{ width: 16, height: 16 }} />
                {error}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#F2F1F0",
    fontFamily: "'Inter', -apple-system, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    maxWidth: 680,
    margin: "0 auto",
    width: "100%",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "48px 40px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    width: "100%",
    maxWidth: 520,
  },
  questionCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  questionLabel: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 1.3,
    marginBottom: 4,
  },
  sublabel: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 1.5,
  },
  code: {
    background: "#f0ebe6",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 13,
    fontFamily: "monospace",
    color: "#e86c47",
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "#FFF5F2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  progressTrack: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "#e8e4e0",
    zIndex: 50,
  },
  progressFill: {
    height: "100%",
    background: "#e86c47",
    borderRadius: "0 2px 2px 0",
  },
  topBar: {
    position: "fixed",
    top: 12,
    left: 20,
    right: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 50,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid #e0e0e0",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#666",
  },
  skipBtn: {
    marginLeft: 12,
    background: "none",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: "4px 12px",
    fontSize: 11,
    color: "#e86c47",
    cursor: "pointer",
    fontWeight: 600,
  },
  textInput: {
    width: "100%",
    padding: "14px 18px",
    fontSize: 16,
    border: "2px solid #e8e4e0",
    borderRadius: 12,
    background: "#FAFAF8",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    color: "#333",
    transition: "border-color 0.2s",
  },
  radioOption: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 18px",
    borderRadius: 12,
    border: "2px solid #e0e0e0",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  nextBtn: {
    marginTop: 28,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 28px",
    borderRadius: 10,
    border: "none",
    background: "#e86c47",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  skipLink: {
    marginTop: 12,
    background: "none",
    border: "none",
    color: "#aaa",
    fontSize: 13,
    cursor: "pointer",
    textDecoration: "underline",
  },
  dropZone: {
    border: "2px dashed #d4d0cc",
    borderRadius: 14,
    padding: "48px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    padding: "10px 14px",
    borderRadius: 10,
    background: "#FFF1F0",
    color: "#cc3333",
    fontSize: 13,
  },
  downloadBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    background: "#e86c47",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  reasoningBox: {
    display: "flex",
    gap: 10,
    padding: "14px 18px",
    borderRadius: 12,
    background: "#FFF9F7",
    border: "1px solid #f0e6e0",
    marginBottom: 20,
  },
  cvPreview: {
    background: "#fff",
    borderRadius: 16,
    padding: "40px 36px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2B579A",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 4,
    marginBottom: 12,
    marginTop: 20,
  },
  skillChip: {
    padding: "4px 12px",
    borderRadius: 20,
    background: "#F0F0EE",
    fontSize: 12,
    color: "#555",
    fontWeight: 500,
  },
};
