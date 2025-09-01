import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import addColors from "../../constants/addColor";

export default function Description({
  formData,
  handleInputChange,
  styleConfig = addColors,
}) {
  const textareaRef = useRef(null);

  // Safe access to style config with fallbacks
  const getStyleValue = (path, fallback = "") => {
    try {
      const keys = path.split('.');
      let value = styleConfig;
      for (const key of keys) {
        value = value?.[key];
      }
      return value || fallback;
    } catch {
      return fallback;
    }
  };

  // GSAP animations on mount
  useEffect(() => {
    gsap.fromTo(
      textareaRef.current,
      { opacity: 0, scale: 0.95, y: 15 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
        delay: 0.3,
      }
    );
  }, []);

  // Animate textarea focus
  const handleFocus = () => {
    gsap.to(textareaRef.current, {
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleBlur = () => {
    gsap.to(textareaRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div className="mb-8">
      <label className={getStyleValue("description.label", "text-black font-bold mb-4 text-base sm:text-lg")}>
        Description *
      </label>
      <textarea
        ref={textareaRef}
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={3}
        placeholder="Add a description for your task..."
        className={`w-full min-w-0 px-3 py-3 sm:px-6 sm:py-4 backdrop-blur-2xl rounded-2xl text-lg font-mono focus:outline-none focus:ring-2 transition-all duration-200 focus:scale-105 ${getStyleValue("description.textarea.text", "text-gray-900")} ${getStyleValue("description.textarea.bg", "bg-white")} ${getStyleValue("description.textarea.placeholder", "placeholder-gray-400")} ${getStyleValue("description.textarea.borderColor", "border-gray-300")} ${getStyleValue("description.textarea.shadow", "shadow-md")}`}
        style={{
          boxShadow: getStyleValue("description.textarea.boxShadow", "0 4px 15px rgba(0, 0, 0, 0.3)"),
        }}
      />
      <div className="text-sm text-yellow-200 font-mono mt-1 ml-2 text-left w-full">
        {formData.description.length}/350
      </div>
    </div>
  );
}