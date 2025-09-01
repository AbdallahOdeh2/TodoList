/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { useTodos } from "../contexts/TodoContext";
import { useCategories } from "../contexts/CategoryContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TaskTitle from "../components/Add/TaskTitle";
import Description from "../components/Add/Description";
import Category from "../components/Add/Category";
import Priority from "../components/Add/Priority";
import DateSection from "../components/Add/DateSection";
import { Alert, Snackbar } from "@mui/material";
import { createPortal } from "react-dom";
import editColors from "../constants/editColor";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { todos, updateTodo } = useTodos();
  const { categories } = useCategories();
  const task = todos.find((t) => String(t.id) === String(id));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState(() =>
    task
      ? {
          title: task.title || "",
          description: task.description || "",
          categories: task.categories || [],
          priority: task.priority || "",
          startDate: task.startDate ? new Date(task.startDate) : null,
          endDate: task.endDate ? new Date(task.endDate) : null,
          completed: task.completed || false,
          color: task.color || "rgb(131, 92, 240)",
          emoji: task.emoji || "📝",
        }
      : {
          title: "",
          description: "",
          categories: [],
          priority: "",
          startDate: null,
          endDate: null,
          completed: false,
          color: "rgb(131, 92, 240)",
          emoji: "📝",
        }
  );
  const [error, setError] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Animation refs
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const backButtonRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    if (!task) navigate("/", { replace: true });
  }, [task, navigate]);

  // GSAP animation (same as AddTaskRefactored)
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
          scale: 1.08,
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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (catValue) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(catValue)
        ? prev.categories.filter((c) => c !== catValue)
        : [...prev.categories, catValue],
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setWarningMessage("Title is required");
      setShowWarning(true);
      return;
    }
    updateTodo(id, {
      ...task,
      ...formData,
      startDate: formData.startDate ? formData.startDate.toISOString() : null,
      endDate: formData.endDate ? formData.endDate.toISOString() : null,
    });
    // Show snackbar instead of navigating immediately
    setSnackbar({
      open: true,
      message: "Changes saved successfully!",
      severity: "success",
    });

    // Scroll to top to show the snackbar
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
    navigate("/"); // Navigate after snackbar closes
  };

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
          onComplete: () => navigate("/"),
        });
      },
    });
  };

  if (!task)
    return (
      <div className="text-center text-red-500 font-bold mt-10">
        Task not found. (ID: {id})
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-br from-[#232526] to-[#414345] overflow-auto hide-scrollbar"
      style={{ background: undefined }}
    >
      {/* Snackbar positioned at top center */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          position: "fixed",
          top: "20px !important",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
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
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-8 py-2 h-full flex flex-col justify-start pt-8">
        {/* HEADER */}
        <div ref={headerRef} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              ref={backButtonRef}
              onClick={handleBackClick}
              className="w-11 h-11 bg-[#d6ff76] rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowBackIcon
                className="text-black"
                style={{ fontSize: "24px" }}
              />
            </button>
            <div>
              <h1
                ref={titleRef}
                className="text-4xl font-bold text-[#5BFF55] mt-4"
              >
                Edit Task
              </h1>
              <p ref={subtitleRef} className="text-[#FFF654] text-md">
                Update your task details
              </p>
            </div>
          </div>
        </div>
        {/* FORM */}
        <form
          ref={formRef}
          onSubmit={handleSave}
          className="backdrop-blur-xl border border-transparent rounded-2xl p-3 sm:p-6 md:p-8 w-full transition-all duration-200 shadow-[inset_0_4px_10px_rgba(30,30,30,0.5),_0_6px_12px_rgba(0,0,0,0.9)] bg-gradient-to-br from-[#232526] to-[#414345]"
        >
          <TaskTitle
            formData={formData}
            handleInputChange={handleInputChange}
            selectedEmoji={formData.emoji}
            setSelectedEmoji={(emoji) =>
              setFormData((prev) => ({ ...prev, emoji }))
            }
            selectedColor={formData.color}
            setSelectedColor={(color) =>
              setFormData((prev) => ({ ...prev, color }))
            }
            handleEmojiSelect={(emojiObj) =>
              setFormData((prev) => ({ ...prev, emoji: emojiObj.emoji }))
            }
            handleColorSelect={(color) =>
              setFormData((prev) => ({ ...prev, color }))
            }
            styleConfig={editColors}
          />
          <Description
            formData={formData}
            handleInputChange={handleInputChange}
            styleConfig={editColors}
          />
          <Category
            categories={categories}
            formData={formData}
            handleCategoryToggle={handleCategoryToggle}
            getContrastColor={(color) => {
              if (!color) return "#fff";
              const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
              if (!match) return "#fff";
              const r = parseInt(match[1]);
              const g = parseInt(match[2]);
              const b = parseInt(match[3]);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              return luminance > 0.5 ? "#000" : "#fff";
            }}
            styleConfig={editColors}
          />
          <Priority
            formData={formData}
            setFormData={setFormData}
            getContrastColor={(color) => {
              if (!color) return "#fff";
              const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
              if (!match) return "#fff";
              const r = parseInt(match[1]);
              const g = parseInt(match[2]);
              const b = parseInt(match[3]);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              return luminance > 0.5 ? "#000" : "#fff";
            }}
            styleConfig={editColors}
          />
          <DateSection
            formData={formData}
            setFormData={setFormData}
            styleConfig={editColors}
          />
          {error && <div className="text-red-500 font-bold mb-2">{error}</div>}
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              className={`${editColors.formButtons.cancel}  rounded-3xl text-lg sm:text-xl px-3 py-2 sm:px-6 sm:py-3 font-bold hover:bg-red-800 cursor-pointer transition`}
              onClick={() => navigate(-1)}
              style={{
                boxShadow: editColors.formButtons.boxShdowCancel,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${editColors.formButtons.save} rounded-3xl px-3 py-2 sm:px-6 sm:py-3 hover:bg-green-800 cursor-pointer transition font-bold shadow-md text-lg sm:text-xl`}
              style={{
                boxShadow: editColors.formButtons.boxShdowSave,
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      {/* Warning Alert */}
      {showWarning && (
        <>
          {createPortal(
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] transition-all duration-300"
              onClick={() => setShowWarning(false)}
              aria-label="Close warning"
            />,
            document.body
          )}
          {createPortal(
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
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
}
