"use client"

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm({ variant = "developer", onClose }) {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      "service_yqb9v0k", // Your service ID
      "template_n4pizfm", // You'll need to create a template in EmailJS
      form.current,
      "q5aNqWec4P3ORiljA" // You'll need to add your public key
    )
    .then(() => {
      setSubmitStatus("success");
      setIsSubmitting(false);
      form.current.reset();
      setTimeout(() => {
        setSubmitStatus(null);
        if (onClose) onClose();
      }, 2000);
    }, (error) => {
      setSubmitStatus("error");
      setIsSubmitting(false);
      console.error("EmailJS error:", error);
    });
  };

  const isDeveloper = variant === "developer";
  const isDesigner = variant === "designer";

  // Base styles
  const containerClass = isDeveloper 
    ? "bg-[#1a1a1a] border border-gray-700/50"
    : "backdrop-blur-md border border-white/20";

  const containerStyle = isDesigner ? {
    background: "linear-gradient(135deg, rgba(15, 25, 57, 0.8), rgba(81, 106, 200, 0.1))",
  } : {};

  const inputClass = isDeveloper
    ? "w-full px-4 py-3 bg-[#0a0a0a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
    : "w-full px-4 py-3 rounded-lg border border-white/30 backdrop-blur-sm text-white placeholder-white/60 focus:border-white/50 focus:outline-none transition-colors";

  const inputStyle = isDesigner ? {
    background: "rgba(248, 247, 245, 0.1)",
  } : {};

  const buttonClass = isDeveloper
    ? "w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    : "w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const buttonStyle = isDesigner ? {
    background: "linear-gradient(135deg, rgba(81, 106, 200, 0.8), rgba(227, 175, 100, 0.8))",
    color: "#F8F7F5"
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-6 rounded-xl shadow-xl max-w-md w-full mx-auto ${containerClass}`}
      style={containerStyle}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-medium ${isDeveloper ? 'text-white' : 'text-white'}`}>
          Get In Touch
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDeveloper 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Form */}
      <form ref={form} onSubmit={sendEmail} className="space-y-4">
        <div>
          <input
            type="text"
            name="user_name"
            placeholder="Your Name"
            className={inputClass}
            style={inputStyle}
            required
          />
        </div>
        
        <div>
          <input
            type="email"
            name="user_email"
            placeholder="Your Email"
            className={inputClass}
            style={inputStyle}
            required
          />
        </div>
        
        <div>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className={inputClass}
            style={inputStyle}
            required
          />
        </div>
        
        <div>
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            className={inputClass}
            style={inputStyle}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClass}
          style={buttonStyle}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-3 rounded-lg text-center ${
              isDeveloper 
                ? 'bg-green-900/50 text-green-300 border border-green-700' 
                : 'text-white'
            }`}
            style={isDesigner ? {
              background: "rgba(46, 125, 50, 0.3)",
              border: "1px solid rgba(46, 125, 50, 0.5)"
            } : {}}
          >
            Message sent successfully! I'll get back to you soon.
          </motion.div>
        )}
        
        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-3 rounded-lg text-center ${
              isDeveloper 
                ? 'bg-red-900/50 text-red-300 border border-red-700' 
                : 'text-white'
            }`}
            style={isDesigner ? {
              background: "rgba(211, 47, 47, 0.3)",
              border: "1px solid rgba(211, 47, 47, 0.5)"
            } : {}}
          >
            Failed to send message. Please try again or email me directly.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 