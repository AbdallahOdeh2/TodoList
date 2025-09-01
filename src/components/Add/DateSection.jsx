import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
import { Alert, Chip } from "@mui/material";
import addColors from "../../constants/addColor";

// ModernDatePicker component
const ModernDatePicker = ({
  selected,
  onChange,
  name,
  placeholder,
  styleConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    selected ? formatDate(selected) : ""
  );
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  const calendarButtonRef = useRef(null);

  function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function parseInput(val) {
    const [day, month, year] = val.split("/");
    if (day && month && year) {
      const dayInt = parseInt(day, 10);
      const monthInt = parseInt(month, 10);
      const yearInt = parseInt(year, 10);
      if (
        dayInt >= 1 &&
        dayInt <= 31 &&
        monthInt >= 1 &&
        monthInt <= 12 &&
        yearInt >= 1000
      ) {
        const date = new Date(yearInt, monthInt - 1, dayInt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date >= today) {
          return date;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    setInputValue(selected ? formatDate(selected) : "");
  }, [selected]);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 });
    tl.fromTo(
      inputRef.current,
      { opacity: 0, scale: 0.95, x: -10 },
      { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" }
    ).fromTo(
      calendarButtonRef.current,
      { opacity: 0, scale: 0.8, x: 10 },
      { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" },
      "-=0.2"
    );
  }, []);

  const handleDateSelect = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date >= today) {
      onChange(date);
      setInputValue(formatDate(date));
      setIsOpen(false);
    }
  };

  // Animate calendar button click
  const handleCalendarToggle = () => {
    if (!isOpen) {
      gsap.to(calendarButtonRef.current, {
        scale: 1.1,
        duration: 0.2,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.to(calendarButtonRef.current, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out",
          });
        },
      });
    }
    setIsOpen(!isOpen);
  };

  // Animate input focus
  const handleInputFocus = () => {
    gsap.to(inputRef.current, {
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleInputBlur = () => {
    gsap.to(inputRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="relative min-w-0" ref={pickerRef}>
      <div className="flex items-stretch gap-2 sm:gap-3">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            const parsed = parseInput(e.target.value);
            if (parsed) onChange(parsed);
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder || "dd/mm/yyyy"}
          className={`flex-1 h-10 sm:h-12 px-3 sm:px-6 
    text-base sm:text-lg font-medium backdrop-blur-2xl rounded-2xl leading-none
    focus:outline-none transition-all duration-200 shadow-lg 
    ${styleConfig.date.textFont} ${styleConfig.date.textColor} ${styleConfig.date.placeholder}
    ${styleConfig.date.bg} ${styleConfig.date.borderColor}`}
          style={{
            boxShadow: styleConfig.date.boxShadow,
          }}
          autoComplete="off"
        />
        <button
          ref={calendarButtonRef}
          type="button"
          onClick={handleCalendarToggle}
          onMouseEnter={() =>
            gsap.to(calendarButtonRef.current, {
              scale: 1.05,
              duration: 0.2,
              ease: "power2.out",
            })
          }
          onMouseLeave={() =>
            gsap.to(calendarButtonRef.current, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
            })
          }
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-200 cursor-pointer flex-shrink-0
             ${styleConfig.date.button.bg} ${styleConfig.date.button.color} ${styleConfig.date.button.hover} ${styleConfig.date.button.border}`}
          style={{
            boxShadow: styleConfig.date.button.boxShadow,
          }}
        >
          <FiCalendar size={20} />
        </button>
      </div>
      {isOpen && (
        <>
          {createPortal(
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] transition-all duration-300"
              onClick={() => setIsOpen(false)}
              aria-label="Close date picker"
            />,
            document.body
          )}
          {createPortal(
            <div
              className="fixed top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 animate-fade-in w-[95vw] max-w-xs sm:max-w-sm md:max-w-md"
              style={{
                minWidth: 220,
                background: "rgba(255,255,255,0.97)",
                borderRadius: "1.5rem",
                boxShadow:
                  "0 12px 48px 0 rgba(251,191,36,0.18), 0 2px 16px 0 rgba(180,180,200,0.10)",
                border: "2.5px solid #fbbf24",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <DatePicker
                selected={selected}
                onChange={handleDateSelect}
                inline
                calendarClassName="bg-transparent"
                minDate={today}
              />
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
};

export default function DateSection({
  formData,
  setFormData,
  styleConfig = addColors,
}) {
  const dateSectionRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.0 });
    tl.fromTo(
      dateSectionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
    )
      .fromTo(
        startDateRef.current,
        { opacity: 0, scale: 0.95, x: -15 },
        { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.3"
      )
      .fromTo(
        endDateRef.current,
        { opacity: 0, scale: 0.95, x: 15 },
        { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.2"
      );
  }, []);

  return (
    <div
      ref={dateSectionRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 min-w-0"
    >
      <div ref={startDateRef}>
        <label className={styleConfig.date.label}>Start Date *</label>
        <ModernDatePicker
          selected={formData.startDate}
          onChange={(date) =>
            setFormData((prev) => ({ ...prev, startDate: date }))
          }
          name="startDate"
          placeholder="dd/mm/yyyy"
          styleConfig={styleConfig}
        />
      </div>
      <div ref={endDateRef}>
        <label className={styleConfig.date.label}>End Date *</label>
        <ModernDatePicker
          selected={formData.endDate}
          onChange={(date) =>
            setFormData((prev) => ({ ...prev, endDate: date }))
          }
          name="endDate"
          placeholder="dd/mm/yyyy"
          styleConfig={styleConfig}
        />
      </div>
    </div>
  );
}
