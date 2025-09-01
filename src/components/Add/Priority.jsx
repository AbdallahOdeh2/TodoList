/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import addColors from "../../constants/addColor";

export default function Priority({
  formData,
  setFormData,
  getContrastColor,
  styleConfig = addColors,
}) {
  // Priority selection section
  const priorities = [
    {
      icon: <img src="/assets/low.png" className="w-4 sm:w-6" />,
      value: "low",
      label: "Low",
      color: "rgb(34,197,94)",
    },
    {
      icon: <img src="/assets/medium.png" className="w-4 sm:w-6 " />,
      value: "medium",
      label: "Medium",
      color: "rgb(251,191,36)",
    },
    {
      icon: <img src="/assets/high.png" className="w-4 sm:w-6" />,
      value: "high",
      label: "High",
      color: "rgb(248,113,113)",
    },
  ];

  const priorityGridRef = useRef(null);
  const summaryRef = useRef(null);
  const warningRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.6 });
    // Animate priority cards with stagger
    if (priorityGridRef.current) {
      const priorityCards = priorityGridRef.current.children;
      gsap.fromTo(
        priorityCards,
        { opacity: 0, scale: 0.8, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
          stagger: 0.15,
          delay: 0.6,
        }
      );
    }
  }, []);

  // Animate priority selection
  const handlePriorityClick = (priorityValue) => {
    const priorityElement = document.querySelector(
      `[data-priority="${priorityValue}"]`
    );
    if (priorityElement) {
      gsap.to(priorityElement, {
        scale: 1.15,
        duration: 0.2,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.to(priorityElement, {
            scale: formData.priority === priorityValue ? 1 : 1.05,
            duration: 0.1,
            ease: "power2.out",
          });
        },
      });
    }
    setFormData((prev) => ({
      ...prev,
      priority: prev.priority === priorityValue ? "" : priorityValue,
    }));
  };

  // Handle hover effects with GSAP
  const handleMouseEnter = (priorityValue) => {
    const priorityElement = document.querySelector(
      `[data-priority="${priorityValue}"]`
    );
    if (priorityElement) {
      const isSelected = formData.priority === priorityValue;
      const targetScale = isSelected ? 1.07 : 1.05;
      gsap.to(priorityElement, {
        scale: targetScale,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (priorityValue) => {
    const priorityElement = document.querySelector(
      `[data-priority="${priorityValue}"]`
    );
    if (priorityElement) {
      const isSelected = formData.priority === priorityValue;
      const targetScale = isSelected ? 1.05 : 1;
      gsap.to(priorityElement, {
        scale: targetScale,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  // Animate summary bar appearance
  useEffect(() => {
    if (formData.priority && summaryRef.current) {
      gsap.fromTo(
        summaryRef.current,
        { opacity: 0, scale: 0.8, x: -20 },
        { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [formData.priority]);

  // Animate warning appearance
  useEffect(() => {
    if (!formData.priority && warningRef.current) {
      gsap.fromTo(
        warningRef.current,
        { opacity: 0, scale: 0.9, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [formData.priority]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <label className={styleConfig.priority.label}>Priority *</label>
        {/* Empty div for alignment with category section */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 -mr-2 ml-1 opacity-0">
          <IconButton disabled>
            <AddIcon style={{ fontSize: "0px" }} />
          </IconButton>
        </div>
      </div>
      {/* PRIORITY SELECTION CARDS */}
      <div
        ref={priorityGridRef}
        className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 min-w-0"
      >
        {priorities.map((priority) => {
          const isSelected = formData.priority === priority.value;
          const textColor = getContrastColor(priority.color);
          const boxShadow = `0 5px 17px ${priority.color
            .replace("rgb", "rgba")
            .replace(")", ", 0.8)")}, 0 2px 5px ${priority.color
            .replace("rgb", "rgba")
            .replace(")", ", 0.5)")}`;
          return (
            <div
              key={priority.value}
              data-priority={priority.value}
              className={`relative group cursor-pointer rounded-2xl p-3 sm:p-4 transition-all duration-100
  ${isSelected ? "scale-105" : ""}`}
              onClick={() => handlePriorityClick(priority.value)}
              onMouseEnter={() => handleMouseEnter(priority.value)}
              onMouseLeave={() => handleMouseLeave(priority.value)}
              style={{
                background: priority.color,
                color: textColor,
                boxShadow,
                border: isSelected
                  ? `2.5px solid ${priority.color}`
                  : undefined,
              }}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span
                    className="text-base sm:text-md"
                    style={{ color: textColor }}
                  >
                    {priority.icon}
                  </span>
                  <span
                    className="text-xs sm:text-md font-semibold"
                    style={{ color: textColor }}
                  >
                    {priority.label}
                  </span>
                </div>
                {isSelected && (
                  <span
                    className="text-base sm:text-lg"
                    style={{
                      color: textColor,
                      textShadow: `0 0 6px ${textColor}`,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* PRIORITY SUMMARY BAR */}
      <div className="mt-4 flex flex-wrap gap-2">
        {formData.priority && (
          <div
            ref={summaryRef}
            className="flex items-center gap-1 sm:gap-2 text-white px-2 sm:px-3 py-2 rounded-full shadow-md relative text-xs sm:text-sm"
            style={{
              backgroundColor:
                priorities.find((p) => p.value === formData.priority)?.color ||
                "#666",
              boxShadow: `0 5px 12px ${priorities
                .find((p) => p.value === formData.priority)
                ?.color.replace("rgb", "rgba")
                .replace(")", ", 0.5)")}, 0 2px 4px ${priorities
                .find((p) => p.value === formData.priority)
                ?.color.replace("rgb", "rgba")
                .replace(")", ", 0.3)")}`,
              color: getContrastColor(
                priorities.find((p) => p.value === formData.priority)?.color
              ),
            }}
          >
            <span className="text-base sm:text-md">
              {priorities.find((p) => p.value === formData.priority)?.icon}
            </span>
            <span className="font-semibold">
              {priorities.find((p) => p.value === formData.priority)?.label}
            </span>
            <span
              className="ml-2 cursor-pointer flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/30 hover:bg-white/60 text-black transition"
              onClick={() => setFormData((prev) => ({ ...prev, priority: "" }))}
              title="Remove priority"
            >
              <CloseIcon style={{ fontSize: 18 }} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
