import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useTodos } from "../contexts/TodoContext";
import { useCategories } from "../contexts/CategoryContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Snackbar } from "@mui/material";
import { createPortal } from "react-dom";

import Description from "../components/Add/Description";
import Category from "../components/Add/Category";
import Priority from "../components/Add/Priority";
import DateSection from "../components/Add/DateSection";
import FormButtons from "../components/Add/FormButtons";
import TaskTitle from "../components/Add/TaskTitle"; // Make sure this component exists or create it
import addColors from "../constants/addColor";

export default function AddTaskRefactored() {
  const navigate = useNavigate();
  const { addTodo } = useTodos();
  const { categories } = useCategories();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', etc.
  });

  // Initialize formData from localStorage or default values
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("addTaskFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          startDate: parsed.startDate ? new Date(parsed.startDate) : null,
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        };
      } catch {
        // parsing failed - fallback to defaults
      }
    }
    return {
      title: "",
      description: "",
      categories: [],
      priority: "",
      startDate: null,
      endDate: null,
      completed: false,
    };
  });

  // Same for emoji and color but separated, persist separately
  const [selectedEmoji, setSelectedEmoji] = useState(() => {
    return localStorage.getItem("selectedEmoji") || "📝";
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem("selectedColor") || "rgb(131, 92, 240)";
  });

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const backButtonRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    if (snackbar.open) {
      // Scroll to top when snackbar appears
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [snackbar.open]);

  // Save entire formData to localStorage whenever it changes
  useEffect(() => {
    try {
      const dataToSave = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.toISOString() : null,
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
      };
      localStorage.setItem("addTaskFormData", JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save form data", e);
    }
  }, [formData]);

  // Persist emoji and color separately
  useEffect(() => {
    localStorage.setItem("selectedEmoji", selectedEmoji);
  }, [selectedEmoji]);

  useEffect(() => {
    localStorage.setItem("selectedColor", selectedColor);
  }, [selectedColor]);

  // GSAP page entrance animation
  useEffect(() => {
    const masterTl = gsap.timeline();

    masterTl.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" }
    );

    masterTl
      .fromTo(
        backButtonRef.current,
        { opacity: 0, scale: 0.7, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.22,
          ease: "elastic.out(1, 0.7)",
          onComplete: () =>
            gsap.to(backButtonRef.current, {
              scale: 1,
              duration: 0.12,
              ease: "power2.out",
            }),
        },
        "-=0.10"
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: -32, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1.04,
          duration: 0.22,
          ease: "elastic.out(1, 0.7)",
          onComplete: () =>
            gsap.to(titleRef.current, {
              scale: 1,
              duration: 0.12,
              ease: "power2.out",
            }),
        },
        "-=0.14"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 18, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" },
        "-=0.10"
      );

    masterTl.fromTo(
      formRef.current,
      { opacity: 0, scale: 0.92, y: 38 },
      {
        opacity: 1,
        scale: 1.04,
        y: 0,
        duration: 0.22,
        ease: "elastic.out(1, 0.7)",
        onComplete: () =>
          gsap.to(formRef.current, {
            scale: 1,
            duration: 0.12,
            ease: "power2.out",
          }),
      },
      "-=0.12"
    );

    return () => masterTl.kill();
  }, []);

  // Handle input changes (title, description, completed, etc.)
  const handleInputChange = (e) => {
    try {
      const { name, value, type, checked } = e.target;
      let newValue = value;
      if (name === "title") newValue = value.slice(0, 40);
      if (name === "description") newValue = value.slice(0, 350);
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : newValue,
      }));
    } catch (error) {
      console.error("Error handling input change:", error);
      setError("Failed to update form data");
    }
  };

  // Toggle category select/deselect (max 3)
  const handleCategoryToggle = (categoryValue) => {
    try {
      if (formData.categories.includes(categoryValue)) {
        setFormData((prev) => ({
          ...prev,
          categories: prev.categories.filter((cat) => cat !== categoryValue),
        }));
      } else {
        if (formData.categories.length >= 3) {
          setWarningMessage("You can only select up to 3 categories per task.");
          setShowWarning(true);
          return;
        }
        setFormData((prev) => ({
          ...prev,
          categories: [...prev.categories, categoryValue],
        }));
      }
    } catch (error) {
      console.error("Error toggling category:", error);
      setError("Failed to update category selection");
    }
  };

  const handleEmojiSelect = (emojiObject) => {
    try {
      setSelectedEmoji(emojiObject.emoji);
    } catch (error) {
      console.error("Error selecting emoji:", error);
      setError("Failed to select emoji");
    }
  };

  const handleColorSelect = (color) => {
    try {
      setSelectedColor(color);
    } catch (error) {
      console.error("Error selecting color:", error);
      setError("Failed to select color");
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!formData.title.trim()) {
        setWarningMessage("Please enter a task title");
        setShowWarning(true);
        return;
      }

      const newTodo = {
        title: formData.title.trim(),
        description: formData.description || "",
        categories: Array.isArray(formData.categories)
          ? formData.categories
          : [],
        priority: formData.priority || "medium",
        startDate: formData.startDate ? formData.startDate.toISOString() : null,
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        completed: formData.completed || false,
        emoji: selectedEmoji || "📝",
        color: selectedColor || "rgb(131, 92, 240)",
      };

      addTodo(newTodo);

      // Clear saved data on submit
      localStorage.removeItem("addTaskFormData");
      localStorage.removeItem("selectedEmoji");
      localStorage.removeItem("selectedColor");

      // Animate success then navigate back
      const successTl = gsap.timeline();
      successTl
        .to(formRef.current, {
          scale: 1.12,
          duration: 0.18,
          ease: "elastic.out(1, 0.7)",
          onComplete: () => {
            gsap.to(formRef.current, {
              scale: 0.98,
              duration: 0.12,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(formRef.current, {
                  scale: 1,
                  duration: 0.12,
                  ease: "power2.out",
                });
              },
            });
          },
        })
        .then(() => {
          // Show success snackbar
          setSnackbar({
            open: true,
            message: "Task added successfully!",
            severity: "success",
          });
        });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbar({
        open: true,
        message: "Failed to create task",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));

    // Navigate after snackbar closes if it was a success
    if (snackbar.severity === "success") {
      navigate("/");
    }
  };

  // Cancel/back button clears saved data and navigates back
  const handleBackClick = () => {
    gsap.to(backButtonRef.current, {
      scale: 0.9,
      rotation: -180,
      duration: 0.3,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(backButtonRef.current, {
          scale: 1,
          rotation: 0,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            localStorage.removeItem("addTaskFormData");
            localStorage.removeItem("selectedEmoji");
            localStorage.removeItem("selectedColor");
            navigate("/");
          },
        });
      },
    });
  };

  // Helper to get contrast color for text on colored backgrounds
  const getContrastColor = (rgbColor) => {
    try {
      const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!match) return "#FFFFFF";

      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#000000" : "#FFFFFF";
    } catch (error) {
      console.error("Error calculating contrast color:", error);
      return "#FFFFFF";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-300 mb-4">Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-br from-[#3e5151] to-[#decba4] overflow-auto hide-scrollbar"
    >
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-8 py-2 h-full flex flex-col justify-center">
        {/* HEADER */}
        <div ref={headerRef} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              ref={backButtonRef}
              onClick={handleBackClick}
              onMouseEnter={() =>
                gsap.to(backButtonRef.current, {
                  scale: 1.05,
                  duration: 0.2,
                  ease: "power2.out",
                })
              }
              onMouseLeave={() =>
                gsap.to(backButtonRef.current, {
                  scale: 1,
                  duration: 0.2,
                  ease: "power2.out",
                })
              }
              className="w-8 h-8 sm:w-11 sm:h-11 bg-lime-100 rounded-full flex items-center justify-center cursor-pointer"
              aria-label="Go back"
              style={{
                boxShadow: "0 6px 30px 4px rgba(236,252,203, 0.5)",
              }}
            >
              <ArrowBackIcon className="text-black" style={{ fontSize: 23 }} />
            </button>
            <div>
              <h1
                ref={titleRef}
                className="text-2xl md:text-4xl font-bold text-teal-400 mt-4"
              >
                Add New Task
              </h1>
              <p
                ref={subtitleRef}
                className="text-orange-300 text-sm sm:text-md"
              >
                Create a new task with details
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="backdrop-blur-xl border border-transparent rounded-2xl p-3 sm:p-6 md:p-8 shadow-[inset_0_5px_5px_rgba(0,0,0,0.4),_0_6px_6px_rgba(0,0,0,0.6)] w-full transition-all duration-200"
        >
          <TaskTitle
            formData={formData}
            handleInputChange={handleInputChange}
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            handleEmojiSelect={handleEmojiSelect}
            handleColorSelect={handleColorSelect}
            styleConfig={addColors}
          />

          <Description
            formData={formData}
            handleInputChange={handleInputChange}
            styleConfig={addColors}
          />

          <Category
            categories={categories}
            formData={formData}
            handleCategoryToggle={handleCategoryToggle}
            getContrastColor={getContrastColor}
            styleConfig={addColors}
          />

          <Priority
            formData={formData}
            setFormData={setFormData}
            getContrastColor={getContrastColor}
            styleConfig={addColors}
          />

          <DateSection
            formData={formData}
            setFormData={setFormData}
            styleConfig={addColors}
          />

          <FormButtons navigate={navigate} />
        </form>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            fontWeight: "600",
            color: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
            "&.MuiAlert-standardSuccess": {
              background:
                "linear-gradient(135deg, rgba(22, 163, 74, 0.8), rgba(34, 197, 94, 0.9))",
            },
            "&.MuiAlert-standardError": {
              background:
                "linear-gradient(135deg, rgba(220, 38, 38, 0.8), rgba(239, 68, 68, 0.9))",
            },
            "&.MuiAlert-standardInfo": {
              background:
                "linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(59, 130, 246, 0.9))",
            },
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Warning Alert */}
      {showWarning &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] transition-all duration-300"
              onClick={() => setShowWarning(false)}
              aria-label="Close warning"
            />
            <div className="fixed top-4 left-1/2 z-[1000] -translate-x-1/2 w-[95vw] max-w-md px-2">
              <Alert
                severity="warning"
                onClose={() => setShowWarning(false)}
                sx={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid #fbbf24",
                  borderRadius: "1rem",
                  boxShadow: "0 8px 32px rgba(251,191,36,0.3)",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                }}
              >
                {warningMessage}
              </Alert>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
