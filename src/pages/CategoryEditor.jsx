import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCategories } from "../contexts/CategoryContext";
import EmojiPicker from "emoji-picker-react";
import { SketchPicker } from "react-color";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Snackbar,
  ClickAwayListener,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

export default function CategoryEditor() {
  const navigate = useNavigate();
  const {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    categoryExists,
  } = useCategories();

  // State for form data
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    color: "rgb(131, 92, 240)",
  });

  // UI state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Refs for animations
  const containerRef = useRef(null);
  const backButtonRef = useRef(null);
  const headerRef = useRef(null);
  const categoriesGridRef = useRef(null);
  const newCategorySectionRef = useRef(null);
  const formElementsRef = useRef(null);
  const scrollContainerRef = useRef(null);

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
          onComplete: () => navigate(-1), // or wherever you want to go
        });
      },
    });
  };

  const convertToRgb = (color) => {
    if (color.startsWith("rgb")) return color;
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });

    // Scroll both window and container
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // GSAP Animations
  useEffect(() => {
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

    // Categories grid animation with stagger
    if (categoriesGridRef.current) {
      const categoryCards = categoriesGridRef.current.children;
      gsap.fromTo(
        categoryCards,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
          stagger: 0.1,
          delay: 0.5, // Increased delay to prevent scroll interference
        }
      );
    }

    // New category section animation
    tl.fromTo(
      newCategorySectionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      "-=0.2"
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
          delay: 0.8,
        }
      );
    }
  }, [categories]);

  // Handle scroll restoration and prevent scroll jumping
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Ensure scroll position is maintained when categories change
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = Math.min(
        scrollContainer.scrollTop,
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      );
    }
  }, [categories]);

  // Prevent scroll jumping during animations
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isAnimating = false;
    let scrollTimeout;

    const handleScroll = () => {
      if (isAnimating) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isAnimating = false;
        }, 100);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.label.trim() || !formData.value.trim()) {
      showSnackbar("Please fill in all fields", "error");
      return;
    }

    if (editingCategory) {
      // Edit existing category
      editCategory(editingCategory.id, formData);
      showSnackbar("Category updated successfully!", "info");
    } else {
      // Add new category
      if (categoryExists(formData.value.trim())) {
        showSnackbar("Category already exists!", "error");
        return;
      }
      addCategory(formData);
      showSnackbar("Category added successfully!", "success");
    }

    setEditingCategory(null);
    setFormData({
      label: "",
      value: "",
      color: "rgb(131, 92, 240)",
    });
  };

  const handleDeleteCategory = (categoryId) => {
    deleteCategory(categoryId);
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
    showSnackbar("Category deleted successfully!", "error");
  };

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setFormData({ label: cat.label, value: cat.value, color: cat.color });

    // Scroll to the form
    if (newCategorySectionRef.current) {
      newCategorySectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
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

  const animateCategoryCard = (element) => {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.1,
          ease: "power2.out",
        });
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-l from-[#EDE574] to-[#E1F5C4] overflow-auto hide-scrollbar "
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="p-6 sm:p-8 w-full max-w-4xl mx-auto h-full flex flex-col justify-center"
      >
        <div className="flex items-center justify-start gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Tooltip title="Back">
            <button
              onClick={handleBackClick}
              ref={backButtonRef}
              className="bg-[#490C3E] flex items-center justify-center backdrop-blur-lg p-2 sm:p-3 rounded-full hover:bg-[#490C3E]/80 cursor-pointer"
              style={{
                boxShadow: "0 5px 20px rgba(73,12,62, 0.8)",
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
              <ArrowBackIcon
                className="text-white"
                style={{ fontSize: "20px" }}
              />
            </button>
          </Tooltip>
          <h1 className=" text-3xl md:text-4xl font-bold text-[#13105F] drop-shadow-lg">
            Category Manager
          </h1>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 h-full flex flex-col justify-center scroll-auto">
        {/* Categories List */}
        <div className="mb-7 sm:mb-10">
          <div className="mb-3 sm:mb-6 flex items-center justify-center">
            <h2 className="text-xl sm:text-2xl font-bold text-[#4A0C0C] drop-shadow-xl mb-4">
              Existing Categories
            </h2>
          </div>

          {/* 3D Inset Container for Categories */}
          <div className="relative bg-gradient-to-r from-white/5 to-white/10 rounded-3xl p-4 sm:p-6 border border-black/20 shadow-inner backdrop-blur-sm">
            {/* Inner shadow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-3xl pointer-events-none"></div>

            {/* Scrollable Categories Container */}
            <div
              ref={scrollContainerRef}
              className="relative z-10 max-h-98 overflow-y-auto scrollbar-hide mx-auto category-scroll-container"
              style={{
                willChange: "transform",
              }}
            >
              <div
                ref={categoriesGridRef}
                className="flex flex-col gap-3 pt-2 pb-2"
              >
                {categories.map((cat) => {
                  const rgb = convertToRgb(cat.color);
                  const shadowColor1 = rgb
                    .replace("rgb", "rgba")
                    .replace(")", ", 0.5)");
                  const shadowColor2 = rgb
                    .replace("rgb", "rgba")
                    .replace(")", ", 0.25)");

                  const textColor = getContrastColor(rgb);
                  const isSelected = editingCategory?.id === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="relative group w-full max-w-xl mx-auto rounded-2xl p-3 sm:p-5 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                      style={{
                        background: rgb,
                        color: textColor,
                        boxShadow: `
                          0 6px 16px ${shadowColor1}, 
                          0 2px 8px ${shadowColor2}`,
                        border: isSelected ? `2.5px solid ${rgb}` : undefined,
                      }}
                      onClick={(e) => {
                        // Only trigger animation if not clicking on action buttons
                        if (!e.target.closest(".action-buttons")) {
                          animateCategoryCard(e.currentTarget);
                        }
                      }}
                    >
                      {/* Category Content */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span
                            className="text-base sm:text-lg"
                            style={{ color: textColor }}
                          >
                            {cat.label}
                          </span>
                          <span
                            className="text-xs sm:text-sm font-semibold"
                            style={{ color: textColor }}
                          >
                            {cat.value}
                          </span>
                        </div>
                        {editingCategory?.id === cat.id && (
                          <span
                            className="text-base sm:text-lg ml-2"
                            style={{
                              color: textColor,
                              textShadow: `0 0 6px ${textColor}`,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Action Buttons - Always Visible */}
                      <div className="flex gap-1 absolute top-2 right-2 z-20 mr-1 sm:mr-2">
                        <Tooltip title="Edit category">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(cat);
                            }}
                            sx={{
                              color: textColor,
                              width: "20px",
                              height: "20px",
                              zIndex: 30,
                              "&:hover": {
                                background: "rgba(255,255,255,0.3)",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <EditIcon sx={{ fontSize: "17px" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete category">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(cat);
                            }}
                            sx={{
                              color: textColor,
                              width: "20px",
                              height: "20px",
                              zIndex: 30,
                              "&:hover": {
                                background: "rgba(255,0,0,0.5)",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: "17px" }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Add New Category Section - 3D Inset */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#17270D] mb-6 sm:mb-8 drop-shadow-lg flex items-center justify-center">
          {editingCategory
            ? `Edit Category: ${editingCategory.value}`
            : "Add New Category"}
        </h2>
        <div
          ref={newCategorySectionRef}
          className="relative  mb-5 sm:mb-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-4 sm:p-6 border border-white/20 shadow-[inset_0_8px_32px_rgba(0,0,0,0.3)]"
        >
          {/* Inner shadow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-3xl pointer-events-none border border-transparent"></div>

          <div className="relative z-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              ref={formElementsRef}
            >
              <div>
                {/* Left Column - Emoji and Name */}
                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 mt-2 sm:mt-4">
                  <div className="relative">
                    <button
                      type="button"
                      className="w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl rounded-full bg-[#1E1011]/70 flex items-center justify-center border border-white/80 shadow-xl cursor-pointer hover:scale-105 transition-all duration-200"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      style={{
                        boxShadow: "0 5px 12px rgba(0,0,0,0.7)",
                      }}
                    >
                      {formData.label || "📝"}
                    </button>
                  </div>
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
                    className="capitalize bg-transparent rounded-2xl w-full border-2 border-black/80 p-2 sm:p-4 text-[#261C56] placeholder:text-black font-semibold
                    focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all duration-200 focus:border-transparent focus:placeholder-transparent"
                  />
                </div>

                {/* Right Column - Color Picker */}
                <div className="space-y-4 mt-6 sm:mt-8">
                  <label className="block text-[#4A0C0C] font-bold text-lg sm:text-xl">
                    Category Color
                  </label>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-white/80 shadow-lg cursor-pointer"
                      style={{
                        background: formData.color,
                        boxShadow: `0 3px 10px ${formData.color}`,
                      }}
                    />
                    <Tooltip title="Change category color" placement="top">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#3E156E]/80 hover:bg-purple-900 rounded-4xl flex items-center justify-center hover:scale-105 cursor-pointer transition-all duration-200">
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
                            style={{ fontSize: "25px" }}
                            className="text-white"
                          />
                        </IconButton>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <label className="block text-[#4A0C0C] mt-6 sm:mt-8 font-bold text-lg sm:text-xl">
                Preview
              </label>
              <div className="space-y-2 mt-2 sm:mt-4 relative rounded-3xl">
                <div className="absolute inset-0 rounded-3xl pointer-events-none z-10 bg-gradient-to-l from-black/10 to-black/40 backdrop-blur-md" />
                <div className="p-4 bg-transparent flex items-center justify-start">
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
                        className="inline-block rounded-2xl p-3 sm:p-4 transition-all duration-200 hover:scale-103 z-20"
                        style={{
                          background: previewRgb,
                          color: previewTextColor,
                          boxShadow: `
                            0 6px 16px ${previewShadow1}, 
                            0 2px 8px ${previewShadow2}`,
                        }}
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-base sm:text-lg">
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

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                {editingCategory && (
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setFormData({
                        label: "",
                        value: "",
                        color: "rgb(131, 92, 240)",
                      });
                    }}
                    className="p-3 sm:p-4 bg-red-500 rounded-3xl text-white cursor-pointer font-bold transition-all duration-200 hover:bg-red-600 shadow-lg hover:scale-105"
                    style={{ boxShadow: "0 3px 20px rgba(239,68,68,0.9)" }}
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 sm:px-6 sm:py-4 bg-green-500 rounded-3xl text-black/70 cursor-pointer font-bold transition-all duration-200 hover:bg-green-600 shadow-lg hover:scale-105"
                  style={{ boxShadow: "0 3px 20px rgba(34,197,94,0.9)" }}
                >
                  {editingCategory ? "Update Category" : "Add Category"}
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
            <div className="fixed top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2">
              <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
                <div>
                  <EmojiPicker
                    onEmojiClick={(emojiObject) => {
                      setFormData((prev) => ({
                        ...prev,
                        label: emojiObject.emoji,
                      }));
                      // Removed automatic closing - picker stays open
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
            <div className="fixed top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2">
              <ClickAwayListener onClickAway={() => setShowColorPicker(false)}>
                <div
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
                      // Removed automatic closing - picker stays open
                    }}
                    styles={{
                      default: { picker: { boxShadow: "none" } },
                    }}
                  />
                </div>
              </ClickAwayListener>
            </div>,
            document.body
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "linear-gradient(145deg, #AA4A44, #E30B5C)",
            border: "2px solid rgba(255,255,255,0.3)",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(15px)",
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
      >
        <p className="text-[#F1FDEF] font-bold text-center text-xl sm:text-2xl mt-3 sm:mt-5">
          Delete Category
        </p>
        <DialogContent>
          <p className="text-white/90 text-center font-semibold text-lg sm:text-xl">
            Are you sure you want to delete
            <br />
            <span className="font-bold">
              "{categoryToDelete?.value}" Category ?
            </span>
            <br />
            This action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            sx={{
              color: "#000",
              fontWeight: "bold",
              borderRadius: "20px",
              padding: "8px 16px",
              background: "#F1F1F1	",
              borderColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255,255,255,0.5)",
              },
              textTransform: "capitalize",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteCategory(categoryToDelete?.id)}
            variant="contained"
            sx={{
              color: "#ccc",
              fontWeight: "bold",
              borderRadius: "20px",
              padding: "8px 16px",
              background: "#990033	",
              borderColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                borderColor: "white",
                background: "#FF4D6D",
              },
              textTransform: "capitalize",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
}
