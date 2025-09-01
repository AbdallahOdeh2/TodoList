import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../contexts/CategoryContext";
import { gsap } from "gsap";
import EmojiPicker from "emoji-picker-react";
import { SketchPicker } from "react-color";
import {
  IconButton,
  Tooltip,
  Button,
  TextField,
  Alert,
  Snackbar,
  ClickAwayListener,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { createPortal } from "react-dom";

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, editCategory } = useCategories();
  const category = categories.find((cat) => cat.id === id);

  // State for form data
  const [formData, setFormData] = useState({
    label: category?.label || "",
    value: category?.value || "",
    color: category?.color || "rgb(131, 92, 240)",
  });

  // UI state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Refs for animations
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const formElementsRef = useRef(null);
  const backButtonRef = useRef(null);

  const convertToRgb = (color) => {
    if (color.startsWith("rgb")) return color;
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
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
          onComplete: () => navigate(-1),
        });
      },
    });
  };

  useEffect(() => {
    if (!category) {
      navigate("/", { replace: true });
      return;
    }

    // Initialize form data with category data
    setFormData({
      label: category.label,
      value: category.value,
      color: category.color,
    });

    // GSAP Animations
    const tl = gsap.timeline();

    // Initial page entrance
    tl.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" }
    );

    // Header animation
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" },
      "-=0.3"
    );

    // Form elements animation with stagger
    if (formElementsRef.current) {
      const formElements = formElementsRef.current.children;
      gsap.fromTo(
        formElements,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.15,
          delay: 0.3,
        }
      );
    }
  }, [category, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.label.trim() || !formData.value.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        severity: "error",
      });
      return;
    }

    editCategory(id, formData);
    setSnackbar({
      open: true,
      message: "Category updated successfully!",
      severity: "success",
    });

    // Navigate back after a short delay to show the success message
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  const getContrastColor = (rgbColor) => {
    const rgb = rgbColor.match(/\d+/g);
    if (!rgb) return "#000000";

    const brightness =
      (parseInt(rgb[0]) * 299 +
        parseInt(rgb[1]) * 587 +
        parseInt(rgb[2]) * 114) /
      1000;
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  if (!category) {
    return null; // Will redirect in useEffect
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] overflow-auto hide-scrollbar"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="p-4 sm:p-8 w-full max-w-4xl mx-auto h-full flex flex-col justify-center"
      >
        <div className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
          <Tooltip title="Back">
            <button
              onClick={handleBackClick}
              ref={backButtonRef}
              className="bg-[#EECAFF] backdrop-blur-lg p-2 sm:p-3 rounded-full hover:bg-[#351239]/80 cursor-pointer"
              style={{
                boxShadow: "0 5px 20px rgba(238,202,255, 0.8)",
              }}
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
            >
              <ArrowBackIcon className="text-black text-lg sm:text-xl" />
            </button>
          </Tooltip>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFF86D] drop-shadow-lg">
            Edit Category
          </h1>
        </div>
      </div>

      <div className="w-full max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto px-5 py-5 sm:py-5 sm:px-10 h-full flex flex-col justify-center scroll-auto">
        <div className="mb-4 sm:mb-8 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#6EFFF3] drop-shadow-xl">
            Edit Category: {category.value}
          </h2>
        </div>

        {/* Edit Category Section */}
        <div className="relative bg-[#f1f1f4]/40 rounded-2xl p-3 sm:p-4 md:p-6 border border-black/20 shadow-inner backdrop-blur-lg">
          <div className="relative z-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6"
              ref={formElementsRef}
            >
              {/* Emoji and Name */}
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 my-3 sm:my-4 md:my-6">
                  <button
                    type="button"
                    className="w-12 h-10 sm:w-15 sm:h-14 text-xl sm:text-2xl rounded-full bg-[#16230A]/60 flex items-center justify-center border border-white/30 shadow-xl cursor-pointer hover:scale-105 transition-all duration-200"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                      boxShadow: "0 5px 20px rgba(22,35,10,0.7)",
                    }}
                  >
                    {formData.label || "📝"}
                  </button>
                  <input
                    type="text"
                    label="Category Name"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="Category Name"
                    className="capitalize bg-transparent rounded-2xl w-full border-2 border-black/60 p-3 sm:p-5 text-yellow-400 placeholder:text-black/70 font-semibold
                    focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 focus:border-transparent focus:placeholder-transparent text-sm sm:text-lg"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 md:mt-8">
                  <label className="block text-[#000]/80 font-bold text-base sm:text-lg md:text-xl">
                    Category Color
                  </label>
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-3 border-white/30 shadow-lg cursor-pointer"
                      style={{
                        background: formData.color,
                        boxShadow: `0 3px 10px ${formData.color}`,
                      }}
                    />
                    <Tooltip title="Change category color" placement="top">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#000]/70 hover:bg-neutral-700 rounded-4xl flex items-center justify-center hover:scale-105 cursor-pointer transition-all duration-200">
                        <IconButton
                          type="button"
                          onClick={() => setShowColorPicker(!showColorPicker)}
                          className="ml-1 text-black hover:text-gray-700 transition-colors"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ColorLensIcon
                            style={{ fontSize: "20px", sm: "25px" }}
                            className="text-white"
                          />
                        </IconButton>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <label className="block text-[#000]/80 mt-4 sm:mt-6 md:mt-8 font-bold text-base sm:text-lg md:text-xl">
                Preview
              </label>
              <div className="space-y-2 mt-1 sm:mt-2 md:mt-4 relative rounded-2xl sm:rounded-3xl">
                <div className="absolute inset-0 rounded-3xl pointer-events-none z-10 bg-black/40 backdrop-blur-sm" />
                <div className="p-3 sm:p-4 bg-transparent flex items-center">
                  <div className="p-3 sm:p-4 bg-transparent flex items-center">
                    {/* Convert preview color to RGB and generate shadows */}
                    {(() => {
                      const previewRgb = convertToRgb(formData.color);
                      const previewShadow1 = previewRgb
                        .replace("rgb", "rgba")
                        .replace(")", ", 0.5)");
                      const previewShadow2 = previewRgb
                        .replace("rgb", "rgba")
                        .replace(")", ", 0.25)");
                      const previewTextColor = getContrastColor(previewRgb);

                      return (
                        <div
                          className="inline-block rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-200 hover:scale-105 z-20"
                          style={{
                            background: previewRgb,
                            color: previewTextColor,
                            boxShadow: `
                            0 6px 16px ${previewShadow1}, 
                            0 2px 8px ${previewShadow2}`,
                          }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-sm sm:text-base md:text-lg">
                              {formData.label || "📝"}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold">
                              {formData.value || "Category Name"}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
                <button
                  onClick={() => navigate(-1)}
                  className="text-white border font-semibold border-red-500 bg-[rgba(255,10,10,0.5)] rounded-xl sm:rounded-2xl cursor-pointer px-3 sm:px-6 py-1 sm:py-3 transition-transform duration-200 hover:bg-[rgba(255,0,0,0.8)] hover:scale-105"
                  style={{ boxShadow: "0 5px 20px rgba(255,0,0,0.5)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white font-semibold border border-[rgba(70,195,90,0.7)] bg-[rgba(70,200,80,0.8)] rounded-xl sm:rounded-2xl cursor-pointer px-3 sm:px-6 py-1 sm:py-3 transition-transform duration-200 hover:bg-[rgba(70,200,80,0.9)] hover:scale-105"
                  style={{ boxShadow: "0 5px 20px rgba(80,210,100,0.5)" }}
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
        <>
          {createPortal(
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] transition-all duration-300"
              onClick={() => setShowEmojiPicker(false)}
              aria-label="Close emoji picker"
            />,
            document.body
          )}
          {createPortal(
            <div className="fixed top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[350px]">
              <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
                <div className="scale-[0.85] sm:scale-100 origin-center">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) => {
                      setFormData((prev) => ({
                        ...prev,
                        label: emojiObject.emoji,
                      }));
                    }}
                  />
                </div>
              </ClickAwayListener>
            </div>,
            document.body
          )}
        </>
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <>
          {createPortal(
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] transition-all duration-300"
              onClick={() => setShowColorPicker(false)}
              aria-label="Close color picker"
            />,
            document.body
          )}
          {createPortal(
            <div className="fixed top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[250px]">
              <ClickAwayListener onClickAway={() => setShowColorPicker(false)}>
                <div
                  className="scale-[0.85] sm:scale-100 origin-center"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    padding: "12px",
                  }}
                >
                  <SketchPicker
                    color={formData.color}
                    onChangeComplete={(color) => {
                      setFormData((prev) => ({
                        ...prev,
                        color: color.hex,
                      }));
                    }}
                    styles={{
                      default: { picker: { boxShadow: "none" } },
                    }}
                    width="100%"
                  />
                </div>
              </ClickAwayListener>
            </div>,
            document.body
          )}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
